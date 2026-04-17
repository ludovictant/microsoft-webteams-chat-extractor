(function () {
  // Guard against multiple injections
  if (window._teamsExtractorLoaded) return;
  window._teamsExtractorLoaded = true;

  // Send a message to the popup, silently ignoring errors if it's closed
  function sendMsg(data) {
    chrome.runtime.sendMessage(data).catch(function () {});
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Find the scroll container for the chat list.
  // Teams v2 may use overflow:auto, overflow:scroll, or overflow:hidden
  // on a virtualised wrapper. We try multiple strategies.
  function findScrollContainer(el) {
    // Strategy 1: standard scrollable ancestor (auto / scroll)
    var current = el;
    while (current && current !== document.documentElement) {
      var style = getComputedStyle(current);
      var ov = style.overflowY;
      if ((ov === 'auto' || ov === 'scroll') && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    // Strategy 2: any ancestor that is already scrolled (catches hidden containers)
    current = el;
    while (current && current !== document.documentElement) {
      if (current.scrollTop > 0 && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    // Strategy 3: the element itself if it has overflow content
    if (el.scrollHeight > el.clientHeight) return el;
    return null;
  }

  // Extract a unique identifier for a message node.
  // Teams uses different ID structures for private chats (message-body-)
  // and channel conversations (reply-chain-summary- or data-tid attributes).
  function getMessageId(node) {
    // Strategy 1: Standard chat message body ID
    var msgBody = node.querySelector('[id^="message-body-"]');
    if (msgBody) return msgBody.id;

    // Strategy 2: Channel message wrapper ID (contains timestamp)
    if (node.id && (node.id.startsWith('reply-chain-summary-') || node.id.startsWith('post-message-renderer-'))) {
      return node.id;
    }

    // Strategy 3: Channel message data-tid fallback
    var channelMsg = node.closest('[data-tid="channel-pane-message"]');
    if (channelMsg && channelMsg.id) return channelMsg.id;

    return null;
  }

  // Extract a Date object from a message node using multiple possible structures.
  function getTimestamp(node) {
    // Strategy 1: Standard timestamp element with datetime attribute (most reliable)
    var timeEl = node.querySelector('[id^="timestamp-"]');
    if (timeEl && timeEl.getAttribute('datetime')) {
      return new Date(timeEl.getAttribute('datetime'));
    }

    // Strategy 2: Attachment arrival time (often present when timestamp element is virtualized)
    var arrivalEl = node.querySelector('[originalarrivaltime]');
    if (arrivalEl) {
      return new Date(arrivalEl.getAttribute('originalarrivaltime'));
    }

    // Strategy 3: Parse from element IDs (many Teams IDs contain a Unix epoch)
    var idMatch = (node.id || "").match(/(\d{13})/);
    if (idMatch) {
      return new Date(parseInt(idMatch[1], 10));
    }

    return null;
  }

  // Return the earliest timestamp found among collected nodes.
  // Updated to use the generic getTimestamp helper for cross-compatibility.
  function getOldestTimestamp(nodes) {
    var oldest = null;
    for (var i = 0; i < nodes.length; i++) {
      var dt = getTimestamp(nodes[i]);
      if (dt && (!oldest || dt < oldest)) oldest = dt;
    }
    return oldest;
  }

  // Count unique message IDs among collected nodes.
  // Updated to use the generic getMessageId helper.
  function countUnique(nodes) {
    var ids = new Set();
    for (var i = 0; i < nodes.length; i++) {
      var id = getMessageId(nodes[i]);
      if (id) ids.add(id);
    }
    return ids.size;
  }

  // Deduplicate nodes by ID and sort chronologically.
  // Handles both chat IDs and channel-style identifiers.
  function filterAndSort(nodes) {
    var map = new Map();
    nodes.forEach(function (n) {
      var id = getMessageId(n);
      // Skip GIFs and nodes without identifiable IDs
      if (id && !n.querySelector('[aria-label="Animated GIF"]')) {
        if (!map.has(id)) map.set(id, n);
      }
    });

    return Array.from(map.values()).sort(function (a, b) {
      var tsA = getTimestamp(a) || 0;
      var tsB = getTimestamp(b) || 0;
      return tsA - tsB;
    });
  }

  // Replace emoji <img> tags with their alt-text
  function replaceEmojiImages(node) {
    node.querySelectorAll('img[itemtype*="Emoji"]').forEach(function (img) {
      var span = document.createElement('span');
      span.innerText = img.alt || '';
      img.parentNode.replaceChild(span, img);
    });
  }

  // Turn block-level @mention divs into inline spans
  function replaceMentions(node) {
    node.querySelectorAll('div[aria-label*="Mention"]').forEach(function (div) {
      var span = document.createElement('span');
      span.innerHTML = div.innerHTML;
      span.className = div.className;
      span.style.fontWeight = 'bold';
      div.parentNode.insertBefore(span, div);
      div.parentNode.removeChild(div);
    });
  }

  // Convert quoted-reply wrappers into <blockquote>
  function replaceQuotedReplies(node) {
    node.querySelectorAll('div[data-track-module-name="messageQuotedReply"]').forEach(function (div) {
      var blockquote = document.createElement('blockquote');
      blockquote.innerHTML = div.innerHTML;
      blockquote.className = div.className;
      div.parentNode.insertBefore(blockquote, div);
      div.parentNode.removeChild(div);
    });
  }

  // Fetch an image as a Blob and convert it to a Base64 string.
  // We use this to embed images directly into the HTML transcript so they work offline.
  function fetchAsBase64(url) {
    return fetch(url)
      .then(function (response) { return response.blob(); })
      .then(function (blob) {
        return new Promise(function (resolve) {
          var reader = new FileReader();
          reader.onloadend = function () { resolve(reader.result); };
          reader.onerror = function () { resolve(url); }; // Fallback to original URL on error
          reader.readAsDataURL(blob);
        });
      })
      .catch(function () { return url; }); // Fallback on fetch error
  }

  // Find all images within a node that are hosted on Teams servers and convert them to Base64.
  async function replaceImagesWithBase64(node) {
    // Strategy: Target any image hosted on Microsoft Teams infrastructure.
    // This includes fr-prod.asyncgw.teams.microsoft.com, blob: URLs, etc.
    var images = Array.from(node.querySelectorAll('img[src*="teams.microsoft.com"]'));
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      // Skip if it's already a data URI
      if (img.src.startsWith('data:')) continue;
      
      try {
        var base64 = await fetchAsBase64(img.src);
        // Verify we actually got a Base64 string back
        if (base64 && base64.startsWith('data:image')) {
          img.src = base64;
        } else {
          console.warn('Chat Extractor: Failed to convert image to Base64:', img.src);
        }
      } catch (e) {
        console.error('Chat Extractor: Error processing image:', img.src, e);
      }
    }
  }

  // Build the final HTML transcript from an array of sorted message nodes.
  async function buildTranscript(nodes) {
    var lastAuthor = '';
    var lastDate = null;
    var output = document.createElement('div');

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      // Clone so we don't mutate the live Teams DOM
      var clone = n.cloneNode(true);
      replaceEmojiImages(clone);
      replaceMentions(clone);
      replaceQuotedReplies(clone);
      await replaceImagesWithBase64(clone);

      // --- Extraction Strategy Explanation ---
      // Teams Chat vs. Channels:
      // Author: Regular chats use data-tid="message-author-name". Channels often use an element with id starting with "author-".
      // Time: Regular chats have a discrete timestamp element. In Channels, we use our getTimestamp helper to check multiple fallback IDs/attributes.
      // Body: Regular chats nest the content inside [id^="message-body-"]. Channels often have the [id^="content-"] directly within the message wrapper.

      var authorEl = clone.querySelector('[data-tid="message-author-name"], [id^="author-"]');
      var ts = getTimestamp(clone);
      var bodyEl = clone.querySelector('[id^="message-body-"] [id^="content-"], [id^="content-"]');

      // If we can't find the core components, skip this node (it might be a divider or system notification)
      if (!ts || !bodyEl) return;

      var author = authorEl ? authorEl.innerText.trim() : 'Unknown';
      var tsStr = ts.toLocaleString();
      var date = tsStr.split(',')[0];
      var newDay = lastDate && ts.toDateString() !== lastDate.toDateString();

      var messageDiv = document.createElement('div');
      messageDiv.className = 'message';

      if (author !== lastAuthor) {
        messageDiv.appendChild(document.createElement('hr'));
        var b = document.createElement('b');
        b.textContent = author;
        messageDiv.appendChild(b);
        var timeSpan = document.createElement('span');
        timeSpan.textContent = ' [' + tsStr + ']:';
        messageDiv.appendChild(timeSpan);
        messageDiv.appendChild(document.createElement('br'));
      } else if (newDay) {
        var divider = document.createElement('div');
        divider.className = 'divider';
        divider.innerHTML = '<hr/>' + date + '<hr/>';
        messageDiv.appendChild(divider);
      }

      lastAuthor = author;
      lastDate = ts;

      var section = document.createElement('section');
      section.innerHTML = bodyEl.innerHTML;
      messageDiv.appendChild(section);

      output.appendChild(messageDiv);
    }

    var versionDiv = document.createElement('div');
    versionDiv.style.fontSize = '10px';
    versionDiv.style.color = '#888';
    versionDiv.style.marginTop = '20px';
    versionDiv.style.textAlign = 'right';
    var version = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : 'unknown';
    versionDiv.innerHTML = 'Generated by Microsoft Teams Chat Extractor v' + version;
    output.appendChild(versionDiv);

    return output.innerHTML;
  }

  // ---- Main extraction routine ----
  // days = -1 : extract only currently-loaded messages (no scrolling)
  // days =  0 : scroll all the way to the beginning
  // days >  0 : scroll back until we pass the cutoff date
  async function scrollAndExtract(days, sort) {
    try {
      // Strategy: Detect the active view. Regular chats use #chat-pane-list.
      // Channel conversations use [data-tid="channel-pane-runway"].
      var list = document.getElementById('chat-pane-list') || 
                 document.querySelector('[data-tid="channel-pane-runway"]');

      if (!list) {
        sendMsg({ type: 'error', error: 'No chat or channel pane found. Make sure you have a conversation open in Teams.' });
        return;
      }

      var needsScroll = days >= 0;
      var cutoffDate = days > 0 ? new Date(Date.now() - days * 86400000) : null;

      var collected = [];
      var collect = function () {
        // Strategy: In standard chats, each message is a direct child of the list.
        // In Channels, messages are specific wrappers often nested or in multiple lists.
        var nodes = [];
        if (list.id === 'chat-pane-list') {
          nodes = Array.from(list.children);
        } else {
          // Robust selector for channel message wrappers
          nodes = Array.from(list.querySelectorAll('[data-tid="channel-pane-message"], [id^="reply-chain-summary-"]'));
        }
        collected.push.apply(collected, nodes);
      };
      collect();

      if (needsScroll) {
        var scrollContainer = findScrollContainer(list);
        if (scrollContainer) {
          var obs = new MutationObserver(function () { collect(); });
          obs.observe(list, { childList: true, subtree: true, characterData: true });

          var noChangeCount = 0;
          var prevOldest = null;
          while (true) {
            // Scroll up using scrollTop and keyboard fallback
            scrollContainer.scrollTop = 0;
            list.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Home', code: 'Home', bubbles: true, cancelable: true
            }));

            await sleep(1500);
            collect();

            // If we have a date target, check whether we've scrolled past it
            if (cutoffDate) {
              var oldest = getOldestTimestamp(collected);
              if (oldest && oldest <= cutoffDate) break;
            }

            // Detect when no new messages are loading by tracking the
            // oldest timestamp. Virtual lists keep constant scrollHeight
            // so we can't rely on that.
            var currentOldest = getOldestTimestamp(collected);
            var changed = !prevOldest || !currentOldest
              || currentOldest.getTime() !== prevOldest.getTime();
            if (!changed) {
              noChangeCount++;
              if (noChangeCount >= 3) break;
            } else {
              noChangeCount = 0;
            }
            prevOldest = currentOldest;

            sendMsg({ type: 'progress', count: countUnique(collected) });
          }

          obs.disconnect();
        }
      }

      // Deduplicate and sort
      var nodes = filterAndSort(collected);

      // Trim to the requested date range using our robust getTimestamp helper
      if (cutoffDate) {
        nodes = nodes.filter(function (n) {
          var ts = getTimestamp(n);
          if (!ts) return true; // Keep if we can't determine date
          return ts >= cutoffDate;
        });
      }

      if (nodes.length === 0) {
        sendMsg({ type: 'error', error: 'No messages could be extracted.' });
        return;
      }

      if (sort === 'newest') nodes.reverse();

      // Strategy: Use specific data-tid for channel titles, fallback to active chat title, 
      // and finally fallback to document title.
      var domTitle = document.querySelector('[data-tid="channelTitle-text"], [data-tid="active-chat-title"]');
      var chatTitle = domTitle ? domTitle.innerText.trim() : '';
      if (!chatTitle) {
        // Fallback to window title: strip leading (notifications) and trailing Teams suffix
        // Regex ^\(.*\)\s* is laxist to catch (3), (*3), ( 3), etc.
        chatTitle = document.title
          .replace(/^\(.*\)\s*/, '')
          .replace(/\s*\|\s*Microsoft Teams$/, '')
          .trim();
      }
      if (!chatTitle) chatTitle = 'teams-chat';

      var html = await buildTranscript(nodes);
      sendMsg({ type: 'result', html: html, count: nodes.length, title: chatTitle });
    } catch (e) {
      sendMsg({ type: 'error', error: 'Extraction failed: ' + e.message });
    }
  }

  // Listen for extraction requests from the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'extract') {
      scrollAndExtract(message.days, message.sort);
      sendResponse({ status: 'started' });
    }
    return false;
  });
})();
