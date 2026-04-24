(function () {
  // Guard against multiple injections
  if (window._teamsExtractorLoaded) return;
  window._teamsExtractorLoaded = true;

  var stopRequested = false;

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

    // Return null if no timestamp can be found. This is important for the scroll logic
    // to distinguish between a message with an unknown date and the absolute beginning of time.
    return null;
  }

  // Return the earliest timestamp found among collected nodes.
  // We only look for timestamps that are inside valid message bodies to avoid
  // being tricked by hidden system messages or "ghost" elements in the DOM.
  function getOldestTimestamp(nodes) {
    var oldest = null;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      // Only consider nodes that have a message body or content
      if (!n.querySelector('[id^="message-body-"], [id^="content-"]')) continue;
      
      var dt = getTimestamp(n);
      if (dt) {
        if (!oldest || dt < oldest) oldest = dt;
      }
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

  // Remove Teams-specific CSS classes and data attributes for clean HTML export.
  function cleanNode(node) {
    // Remove useless canvas elements
    node.querySelectorAll('canvas').forEach(function (can) {
      can.parentNode.removeChild(can);
    });

    node.querySelectorAll('*').forEach(function (el) {
      el.removeAttribute('class');
      el.removeAttribute('id');
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      el.removeAttribute('aria-labelledby');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('data-tid');
      el.removeAttribute('data-is-focusable');

      // Remove all other data-* attributes
      for (var j = el.attributes.length - 1; j >= 0; j--) {
        var attr = el.attributes[j];
        if (attr.name.startsWith('data-')) {
          // Debugging: Keep data-orig-src and data-gallery-src for images
          if (attr.name === 'data-orig-src' || attr.name === 'data-gallery-src') {
            continue;
          }
          el.removeAttribute(attr.name);
        }
      }
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

  // Find all images within a node and convert them to Base64.
  async function replaceImagesWithBase64(node) {
    var images = Array.from(node.querySelectorAll('img'));
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      
      // Strategy: Create a prioritized list of potential URLs for this image.
      // We prioritize data-gallery-src (often higher res) over data-orig-src.
      var candidates = [];
      if (img.getAttribute('data-gallery-src')) candidates.push(img.getAttribute('data-gallery-src'));
      if (img.getAttribute('data-orig-src')) candidates.push(img.getAttribute('data-orig-src'));
      if (img.src) candidates.push(img.src);

      var success = false;
      for (var j = 0; j < candidates.length; j++) {
        var targetUrl = candidates[j];

        // Skip if empty or already Base64
        if (!targetUrl || targetUrl.startsWith('data:')) continue;

        // Skip if it's the 1x1 placeholder
        var isPlaceholder = targetUrl.indexOf('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=') !== -1;
        if (isPlaceholder) continue;

        try {
          console.log('Chat Extractor: Attempting image fetch (' + (j+1) + '/' + candidates.length + '):', targetUrl.substring(0, 100));
          var base64 = await fetchAsBase64(targetUrl);
          
          if (base64 && base64.startsWith('data:image')) {
            img.src = base64;
            img.removeAttribute('data-orig-src');
            img.removeAttribute('data-gallery-src');
            console.log('Chat Extractor: Success! Image converted to Base64.');
            success = true;
            break; // Exit the candidates loop for this image
          }
        } catch (e) {
          console.warn('Chat Extractor: Candidate failed:', targetUrl.substring(0, 50), e);
        }
      }

      if (!success) {
        console.warn('Chat Extractor: All image candidates failed for this node.');
      }
    }
  }

  // Build the final HTML transcript from an array of sorted message nodes.
  async function buildTranscript(nodes) {
    var lastAuthor = '';
    var lastDate = null;
    var results = [];

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
      var ts = getTimestamp(clone) || new Date(0); // Use Epoch fallback for display/sorting
      var bodyEl = clone.querySelector('[id^="message-body-"] [id^="content-"], [id^="content-"]');

      // Strategy: Only skip if there is absolutely no content AND no images.
      // This ensures image-only messages or file attachments are preserved.
      if (!bodyEl && !clone.querySelector('img')) continue;

      var author = authorEl ? authorEl.innerText.trim() : 'Unknown';
      // Format: exclude seconds (HH:mm)
      var tsStr = ts.getTime() === 0 ? 'unknown time' : ts.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      var date = ts.getTime() === 0 ? 'unknown date' : ts.toLocaleDateString();
      var newDay = lastDate && ts.getTime() !== 0 && lastDate.getTime() !== 0 && ts.toDateString() !== lastDate.toDateString();

      var container = document.createElement('div');
      container.className = 'message-container';

      if (author !== lastAuthor || newDay) {
        if (newDay) {
          var divider = document.createElement('div');
          divider.className = 'date-divider';
          divider.innerHTML = '<span>' + date + '</span>';
          results.push(divider.outerHTML);
        }

        var header = document.createElement('div');
        header.className = 'message-header';
        
        var authorSpan = document.createElement('span');
        authorSpan.className = 'author';
        authorSpan.textContent = author;
        header.appendChild(authorSpan);
        
        var timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = tsStr;
        header.appendChild(timeSpan);
        
        container.appendChild(header);
      }

      var messageBox = document.createElement('div');
      messageBox.className = 'message-box';

      lastAuthor = author;
      lastDate = ts;

      var section = document.createElement('section');
      section.className = 'message-body';
      if (bodyEl) {
        section.innerHTML = bodyEl.innerHTML;
      } else {
        var imgWrapper = clone.querySelector('.fui-Image, [class*="image-"], img');
        if (imgWrapper) section.appendChild(imgWrapper);
      }
      
      cleanNode(section);
      messageBox.appendChild(section);
      container.appendChild(messageBox);

      results.push(container.outerHTML);
    }

    var version = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : 'unknown';
    var versionHtml = '<div id="version-tag">Generated by Microsoft Teams Chat Extractor v' + version + '</div>';
    
    // Join messages with double newlines for human readability in source code
    return results.join('\n\n') + '\n\n' + versionHtml;
  }

  // ---- Main extraction routine ----
  // days = -1 : extract only currently-loaded messages (no scrolling)
  // days =  0 : scroll all the way to the beginning
  // days >  0 : scroll back until we pass the cutoff date
  async function scrollAndExtract(days, sort) {
    stopRequested = false;
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

      // Strategy: Use a Map to accumulate ALL unique messages seen during scrolling.
      // This prevents losing data when Teams' virtualized list removes nodes from the DOM.
      var allMessagesMap = new Map();
      
      var collect = function () {
        var nodes = [];
        if (list.id === 'chat-pane-list') {
          nodes = Array.from(list.children);
        } else {
          nodes = Array.from(list.querySelectorAll('[data-tid="channel-pane-message"], [id^="reply-chain-summary-"]'));
        }

        nodes.forEach(function(node) {
          var id = getMessageId(node);
          if (id) {
            var existing = allMessagesMap.get(id);
            // Strategy: Always keep the "best" version of a message.
            // If we find a version of the same message that has data-orig-src or real images,
            // overwrite the stored version which might just be a placeholder.
            var hasRealImages = !!node.querySelector('img[data-orig-src], img[src^="blob:"]');
            var existingHasReal = existing && !!existing.querySelector('img[data-orig-src], img[src^="blob:"]');
            
            if (!existing || (hasRealImages && !existingHasReal)) {
              allMessagesMap.set(id, node.cloneNode(true));
            }
          }
        });
      };
      collect();

      if (needsScroll) {
        var scrollContainer = findScrollContainer(list);
        if (scrollContainer) {
          // Strategy: Initial scroll to bottom to ensure we capture the most recent messages
          // if the user had manually scrolled up before starting the extraction.
          console.log('Chat Extractor: Initial scroll to bottom...');
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          await sleep(1000); // Wait for recent messages to load/render
          collect();

          var obs = new MutationObserver(function () { collect(); });
          obs.observe(list, { childList: true, subtree: true, characterData: true });

          var noChangeCount = 0;
          var prevOldest = null;
          while (true) {
            if (stopRequested) {
              console.log('Chat Extractor: Stop requested by user.');
              break;
            }
            console.log('Chat Extractor: Attempting scroll up... (Collected ' + allMessagesMap.size + ' unique messages)');
            // Scroll up using scrollTop and keyboard fallback
            scrollContainer.scrollTop = 0;
            list.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Home', code: 'Home', bubbles: true, cancelable: true
            }));

            await sleep(2500);
            collect();

            // Check date cutoff against our persistent collection
            if (cutoffDate) {
              var oldest = getOldestTimestamp(Array.from(allMessagesMap.values()));
              console.log('Chat Extractor: Checking date cutoff. Oldest found:', oldest ? oldest.toLocaleString() : 'none', 'Target:', cutoffDate.toLocaleString());
              if (oldest && oldest <= cutoffDate) {
                console.log('Chat Extractor: Target date reached. Stopping scroll.');
                break;
              }
            }

            var currentOldest = getOldestTimestamp(Array.from(allMessagesMap.values()));
            var changed = !prevOldest || !currentOldest
              || currentOldest.getTime() !== prevOldest.getTime();
            
            if (!changed) {
              noChangeCount++;
              console.log('Chat Extractor: No new messages loaded. Retry ' + noChangeCount + '/5');
              if (noChangeCount >= 5) {
                console.log('Chat Extractor: Maximum retries reached. Assuming top of chat.');
                break;
              }
            } else {
              console.log('Chat Extractor: New messages loaded. Oldest timestamp is now:', currentOldest.toLocaleString());
              noChangeCount = 0;
            }
            prevOldest = currentOldest;

            sendMsg({ type: 'progress', count: allMessagesMap.size });
          }

          obs.disconnect();
        }
      }

      // Convert our Map back to a sorted array for final processing
      var nodes = filterAndSort(Array.from(allMessagesMap.values()));

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
      
      // Strategy: Extract the absolute first and last message timestamps from the final sorted set
      // to ensure the filename correctly reflects the exported range.
      var oldestTS = nodes.length > 0 ? getTimestamp(nodes[0]) : null;
      var newestTS = nodes.length > 0 ? getTimestamp(nodes[nodes.length - 1]) : null;

      sendMsg({ 
        type: 'result', 
        html: html, 
        count: nodes.length, 
        title: chatTitle,
        oldestTS: oldestTS ? oldestTS.toISOString() : null,
        newestTS: newestTS ? newestTS.toISOString() : null
      });
    } catch (e) {
      sendMsg({ type: 'error', error: 'Extraction failed: ' + e.message });
    }
  }

  // Listen for extraction requests from the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'extract') {
      scrollAndExtract(message.days, message.sort);
      sendResponse({ status: 'started' });
    } else if (message.action === 'stop') {
      stopRequested = true;
      sendResponse({ status: 'stopping' });
    }
    return false;
  });
})();
