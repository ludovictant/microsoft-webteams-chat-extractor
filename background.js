importScripts('lib/jszip.min.js');

let currentDebugMode = false;
function debugLog(...args) {
  if (currentDebugMode) console.log('[DEBUG]', ...args);
}

// Initial load of debug mode
chrome.storage.session.get(['debugMode'], (result) => {
  // Use !! to explicitly cast to boolean (handles undefined as false)
  currentDebugMode = !!result.debugMode;
  debugLog('Initial debug mode:', currentDebugMode);
});

// Watch for changes in debug mode
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && changes.debugMode) {
    // Use !! to explicitly cast to boolean (handles undefined as false)
    currentDebugMode = !!changes.debugMode.newValue;
    debugLog('Debug mode updated to:', currentDebugMode);
  }
});

  debugLog('Background script: Initializing...');

let extractionData = {
  title: '',
  days: 0,
  startTime: null,
  activeTabId: null,
  messages: [],
  urlToBlob: new Map(), // url -> blob
  authorToAvatarUrl: new Map(), // author -> url
  seenAssetUrls: new Set(),
  status: 'idle',
  count: 0,
  oldestTS: null,
  processedAssets: 0,
  totalAssets: 0
};

function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9]/gi, '_');
}

function formatFileTS(ts) {
  const d = new Date(ts || 0);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function getAvatarFileName(author) {
  return `avatar_${sanitizeFileName(author)}.png`;
}

async function base64ToBlob(base64, type) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: type });
}

// Rendering functions
function renderHTML() {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${extractionData.title}</title>`;
  html += `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; } 
    body { font-family: "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif; 
           background-color: #ffffff; color: #242424; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.4; } 
    h1 { font-size: 18px; font-weight: 600; color: #242424; border-bottom: 1px solid #e1e1e1; padding-bottom: 10px; margin-bottom: 20px; margin-top: 10px; } 
    .message { display: flex; align-items: flex-start; margin-bottom: 16px; width: 100%; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; background-size: cover; background-position: center; background-color: #f0f0f0; flex-shrink: 0; }
    .content-wrapper { flex-grow: 1; max-width: 90%; position: relative; }
    .header { display: flex; align-items: center; margin-bottom: 2px; }
    .author { font-weight: 600; font-size: 14px; color: #242424; margin-right: 12px; }
    .timestamp { font-size: 12px; color: #616161; }
    .body { background-color: #F5F5F5; padding: 4px 14px; border-radius: 8px; font-size: 14px; color: #242424; word-wrap: break-word; display: inline-block; min-width: 100px; max-width: 100%; line-height: 1.3; }
    .body img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; display: block; }
    blockquote { border-left: 3px solid #C7C7C7; margin: 8px 0; padding: 8px 12px; background-color: #FAFAFA; border-radius: 4px; font-size: 13px; color: #424242; display: inline-block; min-width: 150px; max-width: 100%; box-sizing: border-box; }
    .reactions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: -2px; margin-left: 12px; position: relative; z-index: 1; }    .reaction-pill { background: #ffffff; border-radius: 12px; padding: 1px 6px; font-size: 13px; display: flex; align-items: center; gap: 4px; color: #424242; border: 1px solid #e1e1e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }     .date-divider { display: flex; align-items: center; text-align: center; margin: 24px 0; color: #616161; font-size: 12px; font-weight: 600; } 
    .date-divider::before, .date-divider::after { content: ""; flex: 1; border-bottom: 1px solid #e1e1e1; } 
    .date-divider span { padding: 0 12px; } 
    a { color: #6264a7; text-decoration: none; } 
    a:hover { text-decoration: underline; } 
    #version-tag { font-size: 10px; color: #888; margin-top: 40px; text-align: right; border-top: 1px solid #eee; padding-top: 10px; } 
  </style></head><body><h1>${extractionData.title}</h1>`;

  extractionData.messages.forEach(msg => {
    const dateStr = new Date(msg.timestamp).toLocaleString();
    
    // Propagate avatar from master map if missing on this specific message
    const bestAvatarUrl = msg.avatarUrl || extractionData.authorToAvatarUrl.get(msg.author);
    const avatarFile = bestAvatarUrl ? getAvatarFileName(msg.author) : null;
    
    let body = msg.htmlContent;
    msg.images.forEach(img => {
      const placeholder = `##${img.id}##`;
      body = body.split(placeholder).join(`images/${img.localFilename}`);
    });

    let reactionsHtml = '';
    if (msg.reactions && msg.reactions.length > 0) {
      reactionsHtml = '<div class="reactions">';
      msg.reactions.forEach(r => {
        reactionsHtml += `<span class="reaction-pill"><span>${r.emoji}</span> <span>${r.count}</span></span>`;
      });
      reactionsHtml += '</div>';
    }

    html += `<div class="message">`;
    if (avatarFile) {
      html += `<div class="avatar" style="background-image: url('images/${avatarFile}')"></div>`;
    } else {
      html += `<div class="avatar"></div>`;
    }
    html += `<div class="content-wrapper">
      <div class="header">
        <span class="author">${msg.author}</span>
        <span class="timestamp">${dateStr}</span>
      </div>
      <div class="body">${body}</div>
      ${reactionsHtml}
    </div></div>`;
  });

  const version = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : 'unknown';
  html += `<div id="version-tag">Generated by Microsoft Teams Chat Extractor v${version}</div>`;
  html += `</body></html>`;
  return html;
}

function renderMarkdown() {
  let md = `# ${extractionData.title}\n\n`;
  extractionData.messages.forEach(msg => {
    const dateStr = new Date(msg.timestamp).toLocaleString();
    md += `### ${msg.author} (${dateStr})\n\n`;
    let content = msg.htmlContent.replace(/<br\s*\/?>/gi, '\n')
                                 .replace(/<(?:.|\n)*?>/gm, '');
    
    let reactionSummary = '';
    if (msg.reactions && msg.reactions.length > 0) {
      reactionSummary = ' (Reactions: ' + msg.reactions.map(r => `${r.emoji} ${r.count}`).join(', ') + ')';
    }

    md += `${content}${reactionSummary}\n\n`;
    msg.images.forEach(img => {
      md += `![Image](images/${img.localFilename})\n\n`;
    });
    md += `---\n\n`;
  });
  return md;
}

function renderCSV() {
  let csv = "Timestamp,Author,Content,Reactions\n";
  extractionData.messages.forEach(msg => {
    const dateStr = new Date(msg.timestamp).toISOString();
    const content = msg.htmlContent.replace(/<(?:.|\n)*?>/gm, '').replace(/"/g, '""');
    let reactions = '';
    if (msg.reactions && msg.reactions.length > 0) {
      reactions = msg.reactions.map(r => `${r.emoji}: ${r.count}`).join(', ');
    }
    csv += `"${dateStr}","${msg.author.replace(/"/g, '""')}","${content}","${reactions.replace(/"/g, '""')}"\n`;
  });
  return csv;
}

async function generateZip() {
  const zip = new JSZip();
  zip.file("index.html", renderHTML());
  zip.file("transcript.md", renderMarkdown());
  zip.file("transcript.csv", renderCSV());

  const imgFolder = zip.folder("images");
  const writtenFiles = new Set();

  extractionData.messages.forEach(msg => {
    // Save master avatar for this author
    const bestAvatarUrl = msg.avatarUrl || extractionData.authorToAvatarUrl.get(msg.author);
    if (bestAvatarUrl) {
      const blob = extractionData.urlToBlob.get(bestAvatarUrl);
      const filename = getAvatarFileName(msg.author);
      if (blob && !writtenFiles.has(filename)) {
        debugLog('[ZIP] Adding master avatar asset:', filename);
        imgFolder.file(filename, blob);
        writtenFiles.add(filename);
      }
    }

    // Save message images
    msg.images.forEach(img => {
      const blob = extractionData.urlToBlob.get(img.url);
      const filename = img.localFilename;
      if (blob && !writtenFiles.has(filename)) {
        debugLog('[ZIP] Adding message asset:', filename);
        imgFolder.file(filename, blob);
        writtenFiles.add(filename);
      }
    });
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Background received message:', message.action);

  switch (message.action) {
    case 'START_EXTRACTION':
      debugLog('Starting extraction for:', message.title);
      extractionData = {
        title: message.title,
        days: message.days,
        startTime: Date.now(),
        activeTabId: sender.tab ? sender.tab.id : null,
        messages: [],
        urlToBlob: new Map(),
        authorToAvatarUrl: new Map(),
        seenAssetUrls: new Set(),
        status: 'extracting',
        count: 0,
        oldestTS: null,
        processedAssets: 0,
        totalAssets: 0
      };
      sendResponse({ status: 'started' });
      break;

    case 'STOP_EXTRACTION':
      if (extractionData.activeTabId) {
        chrome.tabs.sendMessage(extractionData.activeTabId, { action: 'stop' }).catch(() => {});
        extractionData.status = 'idle';
      }
      sendResponse({ status: 'stopped' });
      break;

    case 'RESET_STATUS':
      extractionData = {
        title: '',
        days: 0,
        startTime: null,
        activeTabId: null,
        messages: [],
        urlToBlob: new Map(),
        authorToAvatarUrl: new Map(),
        seenAssetUrls: new Set(),
        status: 'idle',
        count: 0,
        oldestTS: null,
        processedAssets: 0,
        totalAssets: 0
      };
      debugLog('Background state reset to idle.');
      sendResponse({ status: 'idle' });
      break;

    case 'CHUNK_READY':
      message.messages.forEach(msg => {
        extractionData.messages.push(msg);
        
        // Update master avatar map
        if (msg.avatarUrl && !extractionData.authorToAvatarUrl.has(msg.author)) {
          extractionData.authorToAvatarUrl.set(msg.author, msg.avatarUrl);
        }

        // Register unique avatar for download
        const finalAvatarUrl = msg.avatarUrl || extractionData.authorToAvatarUrl.get(msg.author);
        if (finalAvatarUrl && !extractionData.seenAssetUrls.has(finalAvatarUrl)) {
          extractionData.seenAssetUrls.add(finalAvatarUrl);
          extractionData.totalAssets++;
        }

        // Register unique body images for download
        msg.images.forEach((img, idx) => {
          const filename = `msg_${formatFileTS(msg.timestamp)}_${sanitizeFileName(msg.id)}_${idx}.png`;
          img.localFilename = filename; 
          if (!extractionData.seenAssetUrls.has(img.url)) {
            extractionData.seenAssetUrls.add(img.url);
            extractionData.totalAssets++;
          }
        });
      });
      extractionData.count = extractionData.messages.length;
      sendResponse({ count: extractionData.count });
      break;

    case 'ASSET_READY':
      base64ToBlob(message.base64, 'image/png').then(blob => {
        extractionData.urlToBlob.set(message.url, blob);
        extractionData.processedAssets++;
        debugLog('Asset stored. Processed:', extractionData.processedAssets, '/', extractionData.totalAssets);
      });
      sendResponse({ ok: true });
      break;

    case 'PROGRESS':
      extractionData.count = message.count;
      extractionData.oldestTS = message.oldestTS;
      sendResponse({ ok: true });
      break;

    case 'FINISH_EXTRACTION':
      extractionData.messages.sort((a, b) => a.timestamp - b.timestamp);
      
      if (extractionData.days > 0) {
        const cutoff = Date.now() - extractionData.days * 86400000;
        extractionData.messages = extractionData.messages.filter(m => m.timestamp >= cutoff);
      }
      
      extractionData.status = 'processing';
      sendResponse({ status: extractionData.status });
      break;

    case 'GET_STATUS':
      if (extractionData.status === 'processing' && extractionData.processedAssets >= extractionData.totalAssets) {
        extractionData.status = 'ready';
      }
      sendResponse(extractionData);
      break;

    case 'DOWNLOAD_ZIP':
      debugLog('Generating ZIP archive...');
      
      // Calculate temporal range
      let startTS = 0;
      let endTS = 0;
      if (extractionData.messages.length > 0) {
        startTS = extractionData.messages[0].timestamp;
        endTS = extractionData.messages[extractionData.messages.length - 1].timestamp;
      }
      const rangeSuffix = `_${formatFileTS(startTS)}_${formatFileTS(endTS)}`;
      const finalFilename = `${sanitizeFileName(extractionData.title)}${rangeSuffix}.zip`;

      generateZip().then(async blob => {
        const buffer = await blob.arrayBuffer();
        
        let binaryString = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        const chunkSize = 8192;
        
        for (let i = 0; i < len; i += chunkSize) {
          binaryString += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)));
        }
        
        const base64 = btoa(binaryString);
        
        debugLog('ZIP generated. Size:', buffer.byteLength, 'bytes.');
        sendResponse({ 
          base64: base64, 
          filename: finalFilename 
        });
      }).catch(err => {
        console.error('ZIP generation failed:', err);
        sendResponse({ error: err.message });
      });
      return true;

    case 'HEARTBEAT':
      sendResponse({ status: 'alive' });
      break;
      
    case 'ERROR':
      console.error('Error reported from content script:', message.error);
      extractionData.status = 'error';
      extractionData.error = message.error;
      sendResponse({ ok: true });
      break;

    default:
      console.warn('Unknown background action:', message.action);
      sendResponse({ error: 'Unknown action' });
      break;
  }
  return true; 
});
