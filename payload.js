(function () {
  // Guard against multiple injections
  if (window._teamsExtractorLoaded) return;
  window._teamsExtractorLoaded = true;

  var stopRequested = false;
  var heartbeatInterval = null;

  // Send a message to the background script
  function sendToBackground(action, data) {
    console.log('Content Script sending to background:', action, data);
    chrome.runtime.sendMessage({ action: action, ...data }).catch(function (err) {
      console.warn('Content Script failed to send message:', action, err);
    });
  }

  function startHeartbeat() {
    if (heartbeatInterval) return;
    heartbeatInterval = setInterval(function() {
      sendToBackground('HEARTBEAT', {});
    }, 10000);
  }

  function stopHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Find the scroll container for the chat list.
  function findScrollContainer(el) {
    var current = el;
    while (current && current !== document.documentElement) {
      var style = getComputedStyle(current);
      var ov = style.overflowY;
      if ((ov === 'auto' || ov === 'scroll') && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    current = el;
    while (current && current !== document.documentElement) {
      if (current.scrollTop > 0 && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    if (el.scrollHeight > el.clientHeight) return el;
    return null;
  }

  // Standalone helper for message ID
  function getMessageId(node) {
    var msgBody = node.querySelector('[id^="message-body-"]');
    if (msgBody) return msgBody.id;
    if (node.id && (node.id.startsWith('reply-chain-summary-') || node.id.startsWith('post-message-renderer-'))) {
      return node.id;
    }
    var channelMsg = node.closest('[data-tid="channel-pane-message"]');
    if (channelMsg && channelMsg.id) return channelMsg.id;
    return null;
  }

  // Standalone helper for timestamp
  function getTimestamp(node) {
    var timeEl = node.querySelector('[id^="timestamp-"]');
    if (timeEl && timeEl.getAttribute('datetime')) {
      return new Date(timeEl.getAttribute('datetime'));
    }
    var arrivalEl = node.querySelector('[originalarrivaltime]');
    if (arrivalEl) {
      return new Date(arrivalEl.getAttribute('originalarrivaltime'));
    }
    var idMatch = (node.id || "").match(/(\d{13})/);
    if (idMatch) {
      return new Date(parseInt(idMatch[1], 10));
    }
    return null;
  }

  // Helper to find the Teams access token in storage
  function getTeamsToken() {
    try {
      var sources = [sessionStorage, localStorage];
      for (var s = 0; s < sources.length; s++) {
        var storage = sources[s];
        for (var i = 0; i < storage.length; i++) {
          var key = storage.key(i);
          if (key && (key.indexOf('ts.access_token') !== -1 || key.indexOf('token') !== -1)) {
            var item = JSON.parse(storage.getItem(key));
            if (item && item.credential) return item.credential;
            if (item && item.accessToken) return item.accessToken;
          }
        }
      }
    } catch (e) {}
    return null;
  }

  // Fetch an image and send it to the background
  var fetchedAssets = new Set();
  async function fetchAndSendAsset(url) {
    if (!url || fetchedAssets.has(url) || url.startsWith('data:')) return;
    fetchedAssets.add(url);

    // Detect if the URL belongs to a Teams/Microsoft internal domain
    var isInternal = url.indexOf('teams.microsoft.com') !== -1 || url.indexOf('microsoft.com') !== -1;
    
    console.log('[DEBUG] Starting ' + (isInternal ? 'authenticated' : 'anonymous') + ' download for asset:', url);
    
    var token = getTeamsToken();
    var headers = {};
    if (isInternal && token) {
      console.log('[DEBUG] Internal domain detected, attaching auth token.');
      headers['Authorization'] = 'Bearer ' + token;
    }

    try {
      const response = await fetch(url, {
        headers: headers,
        credentials: isInternal ? 'include' : 'omit'
      });
      
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' ' + response.statusText);
      }

      const blob = await response.blob();
      const size = blob.size;
      const reader = new FileReader();
      reader.onloadend = function() {
        console.log('[DEBUG] Asset downloaded (' + size + ' bytes) and converted to Base64:', url);
        sendToBackground('ASSET_READY', { 
          url: url, 
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.warn('[DEBUG] Content Script failed to fetch asset:', url, e.message);
    }
  }

  // Serialize a message node to JSON-based MDO format
  async function serializeMessage(node) {
    var id = getMessageId(node);
    if (!id || node.querySelector('[aria-label="Animated GIF"]')) return null;

    var authorEl = node.querySelector('[data-tid="message-author-name"], [id^="author-"]');
    var author = authorEl ? authorEl.innerText.trim() : 'Unknown';
    
    var avatarImg = node.querySelector('.fui-Avatar__image, [class*="Avatar"] img');
    var avatarUrl = (avatarImg && avatarImg.src && !avatarImg.src.startsWith('data:')) ? avatarImg.src : null;
    if (avatarUrl) fetchAndSendAsset(avatarUrl);

    var ts = getTimestamp(node);
    var timestamp = ts ? ts.getTime() : 0;
    
    var bodyEl = node.querySelector('[id^="message-body-"] [id^="content-"], [id^="content-"]');
    if (!bodyEl && !node.querySelector('img')) return null;

    // Clone and clean for HTML content
    var clone = node.cloneNode(true);
    
    // Remove useless canvas elements and their potentially empty div wrappers
    clone.querySelectorAll('canvas').forEach(function(canvas) {
        var parent = canvas.parentNode;
        if (parent && parent.tagName === 'DIV' && parent.children.length === 1 && parent.innerText.trim() === "") {
            if (parent.parentNode) parent.parentNode.removeChild(parent);
        } else if (parent) {
            parent.removeChild(canvas);
        }
    });

    // Identify body elements BEFORE stripping IDs/classes
    var bodyInClone = clone.querySelector('[id^="message-body-"] [id^="content-"], [id^="content-"]');
    
    // Remove headers/avatars from the clone if they exist to avoid duplicates in the body
    clone.querySelectorAll('.fui-Avatar, [class*="Avatar"]').forEach(function(el) {
        if (el.parentNode) el.parentNode.removeChild(el);
    });

    // Remove emoji images (replace with alt text)
    clone.querySelectorAll('img[itemtype*="Emoji"]').forEach(function (img) {
      var span = document.createElement('span');
      span.innerText = img.alt || '';
      img.parentNode.replaceChild(span, img);
    });

    // Convert quoted-reply wrappers into <blockquote>
    clone.querySelectorAll('div[data-track-module-name="messageQuotedReply"]').forEach(function (div) {
      var blockquote = document.createElement('blockquote');
      blockquote.innerHTML = div.innerHTML;
      // Extract author and content from the quote card if possible to make it cleaner
      var quoteAuthor = div.querySelector('[class*="StyledText"]');
      var quoteContent = div.querySelector('[data-tid="quoted-reply-preview-content"]');
      if (quoteAuthor && quoteContent) {
          blockquote.innerHTML = '<strong>' + quoteAuthor.innerText + '</strong>: ' + quoteContent.innerText;
      }
      div.parentNode.replaceChild(blockquote, div);
    });

    // Turn block-level @mention divs into inline spans
    clone.querySelectorAll('div[aria-label*="Mention"]').forEach(function (div) {
      var span = document.createElement('span');
      span.innerText = div.innerText;
      span.style.fontWeight = 'bold';
      div.parentNode.replaceChild(span, div);
    });

    // Extract body images
    var images = [];
    var bodyImages = clone.querySelectorAll('img:not(.fui-Avatar__image):not([class*="Avatar"] img):not([itemtype*="Emoji"])');
    for (var i = 0; i < bodyImages.length; i++) {
      var img = bodyImages[i];
      
      // 1. Correct SRC identification (Prioritize data-gallery-src if current src is a blob)
      var gallerySrc = img.getAttribute('data-gallery-src');
      var origSrc = img.getAttribute('data-orig-src');
      var rawSrc = img.src;
      var targetUrl = rawSrc;

      if (rawSrc.startsWith('blob:') && gallerySrc) {
        console.log('[DEBUG] Image ' + i + ': Detected blob src, correcting to data-gallery-src:', gallerySrc.substring(0, 80) + '...');
        targetUrl = gallerySrc;
      } else if (gallerySrc) {
        targetUrl = gallerySrc;
      } else if (origSrc) {
        targetUrl = origSrc;
      }

      // Preserve debug attributes
      if (rawSrc) img.setAttribute('DEBUG-src', rawSrc);
      var dsrc = img.getAttribute('data-src');
      if (dsrc) img.setAttribute('DEBUG-data-src', dsrc);
      if (gallerySrc) img.setAttribute('DEBUG-data-gallery-src', gallerySrc);

      if (targetUrl && !targetUrl.startsWith('data:')) {
        var imgId = 'img_' + timestamp + '_' + i;
        images.push({ url: targetUrl, id: imgId });
        
        // 2. Set the placeholder for background replacement
        console.log('[DEBUG] Image ' + i + ': Assigning placeholder ##' + imgId + '##');
        img.src = '##' + imgId + '##'; 
        
        fetchAndSendAsset(targetUrl);
      }
    }

    // Clean node attributes from the CLONE
    clone.querySelectorAll('*').forEach(function (el) {
      el.removeAttribute('class');
      el.removeAttribute('id');
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      el.removeAttribute('aria-labelledby');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('data-tid');
      el.removeAttribute('data-is-focusable');
      for (var j = el.attributes.length - 1; j >= 0; j--) {
        var attr = el.attributes[j];
        if (attr.name.startsWith('data-')) {
            if (attr.name.startsWith('DEBUG-')) continue;
            el.removeAttribute(attr.name);
        }
      }
    });

    // Extract HTML from the identified body
    var htmlContent = bodyInClone ? bodyInClone.innerHTML : '';
    
    if (!htmlContent) {
      var imgWrapper = clone.querySelector('.fui-Image, [class*="image-"], img');
      if (imgWrapper) htmlContent = imgWrapper.outerHTML;
    }

    // Extract reactions
    var reactions = [];
    var reactionSummary = node.querySelector('[data-tid="diverse-reaction-summary"], [data-tid="channel-message-reaction-summary"], [class*="reaction-summary"]');
    if (reactionSummary) {
      reactionSummary.querySelectorAll('[data-tid*="reaction-pill"], [class*="reaction-pill"]').forEach(function(pill) {
        var emoji = '';
        var img = pill.querySelector('img[alt]');
        if (img) {
          emoji = img.alt;
        } else {
          var text = pill.innerText.trim();
          var emojiMatch = text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\S)/);
          emoji = emojiMatch ? emojiMatch[0] : '';
        }

        var count = 1;
        var countMatch = pill.innerText.match(/\d+/);
        if (countMatch) {
          count = parseInt(countMatch[0], 10);
        }
        
        if (emoji) {
          reactions.push({ emoji: emoji, count: count });
        }
      });
    }

    return {
      id: id,
      author: author,
      avatarUrl: avatarUrl,
      timestamp: timestamp,
      htmlContent: htmlContent,
      reactions: reactions,
      images: images
    };
  }

  // ---- Main extraction routine ----
  async function scrollAndExtract(days, sort) {
    stopRequested = false;
    fetchedAssets.clear();
    startHeartbeat();
    
    try {
      var list = document.getElementById('chat-pane-list') || 
                 document.querySelector('[data-tid="channel-pane-runway"]');

      if (!list) {
        sendToBackground('ERROR', { error: 'No chat or channel pane found.' });
        return;
      }

      var cutoffDate = days > 0 ? new Date(Date.now() - days * 86400000) : null;
      var processedIds = new Set();
      var batchBuffer = [];

      var domTitle = document.querySelector('[data-tid="channelTitle-text"], [data-tid="active-chat-title"]');
      var chatTitle = domTitle ? domTitle.innerText.trim() : document.title.replace(/^\(.*\)\s*/, '').replace(/\s*\|\s*Microsoft Teams$/, '').trim() || 'teams-chat';

      sendToBackground('START_EXTRACTION', { title: chatTitle, days: days });

      var collectAndSend = async function () {
        var nodes = [];
        if (list.id === 'chat-pane-list') {
          nodes = Array.from(list.children);
        } else {
          nodes = Array.from(list.querySelectorAll('[data-tid="channel-pane-message"], [id^="reply-chain-summary-"]'));
        }

        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var id = getMessageId(node);
          if (id && !processedIds.has(id)) {
            processedIds.add(id); // Mark as processed BEFORE the await
            var mdo = await serializeMessage(node);
            if (mdo) {
              batchBuffer.push(mdo);
              if (batchBuffer.length >= 10) {
                sendToBackground('CHUNK_READY', { messages: batchBuffer });
                batchBuffer = [];
              }
            }
          }
        }
      };

      // Ensure we are at the bottom if we plan to scroll back in time
      if (days >= 0) {
        var scrollContainer = findScrollContainer(list);
        if (scrollContainer) {
          console.log('[DEBUG] Initial scroll to bottom to capture recent messages...');
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          await sleep(1000);
        }
      }

      await collectAndSend();

      if (days >= 0) {
        var scrollContainer = findScrollContainer(list);
        if (scrollContainer) {
          var obs = new MutationObserver(function () { collectAndSend(); });
          obs.observe(list, { childList: true, subtree: true, characterData: true });

          var noChangeCount = 0;
          var prevOldest = null;
          
          while (true) {
            if (stopRequested) break;
            
            scrollContainer.scrollTop = 0;
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', code: 'Home', bubbles: true, cancelable: true }));

            await sleep(2500);
            await collectAndSend();

            var currentOldestTS = null;
            // Since we don't store nodes anymore, we need a way to check cutoff
            // The background script will handle the final trim, but we need to stop scrolling
            // We'll use the oldest in the current batch or recently processed
            
            if (cutoffDate) {
              // This is a bit tricky now. Let's send the oldest TS seen so far to background
              // and let it decide or we keep track of global oldest here.
            }

            // For simplicity in this refactor, I'll keep a simple global oldest TS
            // (Note: getTimestamp is still available)
            var currentOldest = null;
            nodes = (list.id === 'chat-pane-list') ? Array.from(list.children) : Array.from(list.querySelectorAll('[data-tid="channel-pane-message"]'));
            nodes.forEach(n => {
              var ts = getTimestamp(n);
              if (ts && (!currentOldest || ts < currentOldest)) currentOldest = ts;
            });

            if (cutoffDate && currentOldest && currentOldest <= cutoffDate) break;

            var changed = !prevOldest || !currentOldest || currentOldest.getTime() !== prevOldest.getTime();
            if (!changed) {
              noChangeCount++;
              if (noChangeCount >= 5) break;
            } else {
              noChangeCount = 0;
            }
            prevOldest = currentOldest;
            
            sendToBackground('PROGRESS', { count: processedIds.size, oldestTS: currentOldest ? currentOldest.getTime() : null });
          }
          obs.disconnect();
        }
      }

      // Final flush
      if (batchBuffer.length > 0) {
        sendToBackground('CHUNK_READY', { messages: batchBuffer });
        batchBuffer = [];
      }

      sendToBackground('FINISH_EXTRACTION', { sort: sort });

    } catch (e) {
      sendToBackground('ERROR', { error: 'Extraction failed: ' + e.message });
    } finally {
      stopHeartbeat();
    }
  }

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
