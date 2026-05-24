importScripts('lib/jszip.min.js');

const VERSION_CHECK_URL = 'https://raw.githubusercontent.com/ludovictant/microsoft-webteams-chat-extractor/main/version.json';

let currentDebugMode = false;
function debugLog(...args) {
  if (currentDebugMode) console.log('[DEBUG]', ...args);
}

// Version comparison helper
function isVersionNewer(remote, local) {
  const r = remote.split('.').map(Number);
  const l = local.split('.').map(Number);
  for (let i = 0; i < Math.max(r.length, l.length); i++) {
    const rv = r[i] || 0;
    const lv = l[i] || 0;
    if (rv > lv) return true;
    if (rv < lv) return false;
  }
  return false;
}

async function checkVersion(isManual = false) {
  debugLog('Checking for updates...', isManual ? '(manual)' : '(automatic)');
  try {
    const response = await fetch(VERSION_CHECK_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    const currentVersion = chrome.runtime.getManifest().version;
    const isNewer = isVersionNewer(data.version, currentVersion);
    
    const updateData = {
      lastCheckTimestamp: Date.now(),
      pendingUpdateVersion: isNewer ? data.version : null,
      updateMessage: isNewer ? data.message : null
    };

    await chrome.storage.local.set(updateData);
    debugLog('Update check complete. New version available:', isNewer);
    return { success: true, isNewer, ...data };
  } catch (error) {
    console.error('Update check failed:', error);
    return { success: false, error: error.message };
  }
}

function finalizeExtraction() {
  debugLog('Finalizing extraction data (sorting and filtering)...');
  extractionData.messages.sort((a, b) => a.timestamp - b.timestamp);
  
  if (extractionData.days > 0) {
    const cutoff = Date.now() - extractionData.days * 86400000;
    const initialCount = extractionData.messages.length;
    extractionData.messages = extractionData.messages.filter(m => m.timestamp >= cutoff);
    debugLog(`Filtered ${initialCount - extractionData.messages.length} messages older than ${extractionData.days} days.`);
  }
  extractionData.count = extractionData.messages.length;
}

// Initial load of debug mode
chrome.storage.session.get(['debugMode'], (result) => {
  currentDebugMode = !!result.debugMode;
  debugLog('Initial debug mode:', currentDebugMode);
});

// Watch for changes in debug mode
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && changes.debugMode) {
    currentDebugMode = !!changes.debugMode.newValue;
    debugLog('Debug mode updated to:', currentDebugMode);
  }
});

// Update Check Alarm Setup
const UPDATE_ALARM_NAME = 'check-for-updates';
chrome.alarms.create(UPDATE_ALARM_NAME, { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === UPDATE_ALARM_NAME) {
    checkVersion();
  }
});

// Check on install/startup
chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed/updated. Running initial version check.');
  checkVersion();
  
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error('Error setting side panel behavior:', error));
  }
});

function broadcastStatus() {
  chrome.runtime.sendMessage({ action: 'STATUS_UPDATE_BROADCAST', data: extractionData }).catch(() => {
    // This will fail if no extension pages (like side panel) are open, which is fine.
  });
}

/**
 * Ensures an asset URL is tracked exactly once in totalAssets.
 * Returns true if this is a NEW discovery.
 */
function registerAsset(url) {
  if (!url || url.startsWith('data:') || extractionData.seenAssetUrls.has(url)) return false;
  extractionData.seenAssetUrls.add(url);
  // We only increment totalAssets if we don't ALREADY have the blob in memory
  // (e.g., from a previous CHECK_ASSET success in the same session)
  if (!extractionData.urlToBlob.has(url)) {
    extractionData.totalAssets++;
    return true;
  }
  return false;
}

debugLog('Background script: Initializing...');

let extractionData = {
  title: '',
  teamsId: null,
  localStorageEnabled: true,
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
  noChangeCount: 0,
  waitTime: 2500,
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

function formatLogTS(ts) {
  if (!ts) return "unknown";
  const d = new Date(ts);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function getAvatarFileName(author) {
  return `avatar_${sanitizeFileName(author)}.png`;
}

function base64ToBlob(base64, type) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: type });
}

/**
 * TeamsExtractorDB - Persistent Local Storage Management
 */
class TeamsExtractorDB {
  constructor() {
    this.dbName = 'TeamsExtractorDB';
    this.version = 2;
    this.db = null;
  }

  async open() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        debugLog('IndexedDB opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'teamsId' });
        }

        // Messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('conversationId', 'conversationId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
          messageStore.createIndex('conv_ts_index', ['conversationId', 'timestamp'], { unique: false });
        } else {
          const messageStore = event.currentTarget.transaction.objectStore('messages');
          if (!messageStore.indexNames.contains('conv_ts_index')) {
            messageStore.createIndex('conv_ts_index', ['conversationId', 'timestamp'], { unique: false });
          }
        }

        // Assets store
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'url' });
        }
      };
    });
  }

  async upsertConversation(convData) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');

      // Get existing to preserve metadata if needed
      const getRequest = store.get(convData.teamsId);
      getRequest.onsuccess = () => {
        const existing = getRequest.result || {};

        const updated = {
          ...existing,
          ...convData,
          lastCrawlTimestamp: Date.now()
        };

        const putRequest = store.put(updated);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (e) => reject(e.target.error);
      };
    });
  }

  async saveMessages(messages) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');

      messages.forEach(msg => {
        store.put(msg);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = (e) => reject(e.target.error);
    });
  }

  async saveAsset(assetData) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const request = store.put(assetData);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getAsset(url) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async isAssetStored(url) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.count(url);
      request.onsuccess = () => resolve(request.result > 0);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async isMessageStored(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const request = store.count(id);
      request.onsuccess = () => resolve(request.result > 0);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async clearAll() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations', 'messages', 'assets'], 'readwrite');
      transaction.objectStore('conversations').clear();
      transaction.objectStore('messages').clear();
      transaction.objectStore('assets').clear();

      transaction.oncomplete = () => {
        debugLog('IndexedDB cleared successfully');
        resolve();
      };
      transaction.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllConversations() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getConversationStats(teamsId) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conv_ts_index');
      
      const stats = {
        messageCount: 0,
        oldestMessageTimestamp: null,
        newestMessageTimestamp: null
      };

      // 1. Get Count
      const countRequest = index.count(IDBKeyRange.bound([teamsId, 0], [teamsId, Infinity]));
      countRequest.onsuccess = () => {
        stats.messageCount = countRequest.result;
        
        // 2. Get Oldest (first entry in range)
        const oldestRequest = index.openCursor(IDBKeyRange.bound([teamsId, 0], [teamsId, Infinity]), 'next');
        oldestRequest.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            stats.oldestMessageTimestamp = cursor.value.timestamp;
            
            // 3. Get Newest (last entry in range)
            const newestRequest = index.openCursor(IDBKeyRange.bound([teamsId, 0], [teamsId, Infinity]), 'prev');
            newestRequest.onsuccess = (e2) => {
              const cursor2 = e2.target.result;
              if (cursor2) {
                stats.newestMessageTimestamp = cursor2.value.timestamp;
              }
              resolve(stats);
            };
          } else {
            resolve(stats);
          }
        };
      };
      
      transaction.onerror = (e) => reject(e.target.error);
    });
  }
}
      
      
      
const db = new TeamsExtractorDB();

function renderHTML() {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${extractionData.title}</title>`;
  html += `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; } 
    body { font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background-color: #ffffff; color: #242424; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.4; } 
    h1 { font-size: 18px; font-weight: 600; color: #242424; border-bottom: 1px solid #e1e1e1; padding-bottom: 10px; margin-bottom: 20px; } 
    .message { display: flex; align-items: flex-start; margin-bottom: 16px; width: 100%; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; background-size: cover; background-position: center; background-color: #f0f0f0; flex-shrink: 0; }
    .content-wrapper { flex-grow: 1; max-width: 90%; }
    .header { display: flex; align-items: center; margin-bottom: 2px; }
    .author { font-weight: 600; font-size: 14px; color: #242424; margin-right: 12px; }
    .timestamp { font-size: 12px; color: #616161; }
    .body { background-color: #F5F5F5; padding: 4px 14px; border-radius: 8px; font-size: 14px; word-wrap: break-word; display: inline-block; max-width: 100%; line-height: 1.3; }
    .body img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; display: block; }
    blockquote { border-left: 3px solid #C7C7C7; margin: 8px 0; padding: 8px 12px; background-color: #FAFAFA; border-radius: 4px; font-size: 13px; color: #424242; }
    .reactions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: -2px; margin-left: 12px; }
    .reaction-pill { background: #ffffff; border-radius: 12px; padding: 1px 6px; font-size: 13px; display: flex; align-items: center; gap: 4px; border: 1px solid #e1e1e1; }     
    .system-message { display: flex; align-items: center; margin-bottom: 12px; margin-left: 42px; font-size: 13px; color: #616161; gap: 8px; }
    #version-tag { font-size: 10px; color: #888; margin-top: 40px; text-align: right; border-top: 1px solid #eee; padding-top: 10px; } 
  </style></head><body><h1>${extractionData.title}</h1>`;

  extractionData.messages.forEach(msg => {
    const dateStr = new Date(msg.timestamp).toLocaleString();
    
    if (msg.type === 'meta') {
      html += `<div class="system-message"><span>${msg.content}</span></div>`;
      return;
    }

    const bestAvatarUrl = msg.avatarUrl || extractionData.authorToAvatarUrl.get(msg.author);
    const avatarFile = bestAvatarUrl ? getAvatarFileName(msg.author) : null;
    
    let body = msg.htmlContent;
    msg.images.forEach(img => {
      body = body.split(`##${img.id}##`).join(`images/${img.localFilename}`);
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
    if (msg.type === 'meta') {
      md += `> **System:** ${msg.content} (${dateStr})\n\n`;
      md += `---\n\n`;
      return;
    }
    md += `### ${msg.author} (${dateStr})\n\n`;
    let content = msg.htmlContent.replace(/<br\s*\/?>/gi, '\n').replace(/<(?:.|\n)*?>/gm, '');
    
    if (msg.reactions && msg.reactions.length > 0) {
      content += ' (Reactions: ' + msg.reactions.map(r => `${r.emoji} ${r.count}`).join(', ') + ')';
    }

    md += `${content}\n\n`;
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
    if (msg.type === 'meta') {
      csv += `"${dateStr}","System","${msg.content.replace(/"/g, '""')}",""\n`;
      return;
    }
    const content = msg.htmlContent.replace(/<(?:.|\n)*?>/gm, '').replace(/"/g, '""');
    let reactions = msg.reactions && msg.reactions.length > 0 ? msg.reactions.map(r => `${r.emoji}: ${r.count}`).join(', ') : '';
    csv += `"${dateStr}","${msg.author.replace(/"/g, '""')}","${content}","${reactions.replace(/"/g, '""')}"\n`;
  });
  return csv;
}

function renderJSON() {
  const version = (chrome.runtime && chrome.runtime.getManifest) ? chrome.runtime.getManifest().version : 'unknown';
  const exportData = {
    title: extractionData.title,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: version,
      totalMessages: extractionData.messages.length
    },
    messages: extractionData.messages.map(msg => {
      let content = msg.type === 'meta' ? msg.content : msg.htmlContent;
      if (msg.images) {
        msg.images.forEach(img => {
          content = content.split(`##${img.id}##`).join(`images/${img.localFilename}`);
        });
      }

      return {
        id: msg.id,
        type: msg.type || 'true',
        timestamp: new Date(msg.timestamp).toISOString(),
        author: msg.author,
        content: content,
        reactions: msg.reactions || [],
        images: (msg.images || []).map(img => ({
          url: img.url,
          localFilename: img.localFilename
        }))
      };
    })
  };

  return JSON.stringify(exportData, null, 2);
}

async function generateZip() {
  const zip = new JSZip();
  zip.file("index.html", renderHTML());
  zip.file("transcript.md", renderMarkdown());
  zip.file("transcript.csv", renderCSV());
  zip.file("transcript.json", renderJSON());

  const imgFolder = zip.folder("images");
  const writtenFiles = new Set();

  extractionData.messages.forEach(msg => {
    if (msg.type === 'meta') return;

    const bestAvatarUrl = msg.avatarUrl || extractionData.authorToAvatarUrl.get(msg.author);
    if (bestAvatarUrl && msg.author) {
      const blob = extractionData.urlToBlob.get(bestAvatarUrl);
      const filename = getAvatarFileName(msg.author);
      if (blob && !writtenFiles.has(filename)) {
        imgFolder.file(filename, blob);
        writtenFiles.add(filename);
      }
    }

    if (msg.images) {
      msg.images.forEach(img => {
        const blob = extractionData.urlToBlob.get(img.url);
        if (blob && !writtenFiles.has(img.localFilename)) {
          imgFolder.file(img.localFilename, blob);
          writtenFiles.add(img.localFilename);
        }
      });
    }
  });

  return await zip.generateAsync({ type: "blob" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Background received message:', message.action);

  switch (message.action) {
    case 'START_EXTRACTION':
      if (extractionData.status !== 'idle') {
        sendResponse({ status: 'error', error: 'ALREADY_RUNNING' });
        return;
      }
      extractionData = {
        title: message.title,
        teamsId: message.teamsId,
        localStorageEnabled: !!message.localStorageEnabled,
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
        noChangeCount: 0,
        waitTime: 2500,
        processedAssets: 0,
        totalAssets: 0
      };
      broadcastStatus();
      sendResponse({ status: 'started' });
      break;

    case 'STOP_EXTRACTION':
      if (extractionData.activeTabId) {
        chrome.tabs.sendMessage(extractionData.activeTabId, { action: 'stop' }).catch(() => {});
        finalizeExtraction();
        extractionData.status = (extractionData.processedAssets < extractionData.totalAssets) ? 'processing' : 'ready';
      }
      broadcastStatus();
      sendResponse({ status: 'stopped' });
      break;

    case 'FORCE_STOP_PROCESSING':
      if (extractionData.activeTabId) {
        chrome.tabs.sendMessage(extractionData.activeTabId, { action: 'stop' }).catch(() => {});
      }
      extractionData.status = 'ready';
      broadcastStatus();
      sendResponse({ status: 'ready' });
      break;

    case 'RESET_STATUS':
      if (extractionData.activeTabId) {
        chrome.tabs.sendMessage(extractionData.activeTabId, { action: 'stop' }).catch(() => {});
      }
      extractionData = {
        title: '',
        teamsId: null,
        localStorageEnabled: true,
        days: 0,
        startTime: null,
        activeTabId: null,
        messages: [],
        authorToAvatarUrl: new Map(),
        urlToBlob: new Map(),
        seenAssetUrls: new Set(),
        status: 'idle',
        count: 0,
        oldestTS: null,
        noChangeCount: 0,
        waitTime: 2500,
        processedAssets: 0,
        totalAssets: 0
      };
      broadcastStatus();
      sendResponse({ status: 'idle' });
      break;

    case 'CHUNK_READY':
      const currentTeamsId = message.teamsId || extractionData.teamsId;
      message.messages.forEach(msg => {
        msg.conversationId = currentTeamsId;
        extractionData.messages.push(msg);
        if (msg.type === 'meta') return;
        if (msg.avatarUrl && msg.author && !extractionData.authorToAvatarUrl.has(msg.author)) {
          extractionData.authorToAvatarUrl.set(msg.author, msg.avatarUrl);
        }
        const finalAvatarUrl = msg.avatarUrl || (msg.author ? extractionData.authorToAvatarUrl.get(msg.author) : null);
        registerAsset(finalAvatarUrl);

        if (msg.images) {
          msg.images.forEach((img, idx) => {
            img.localFilename = `msg_${formatFileTS(msg.timestamp)}_${sanitizeFileName(msg.id)}_${idx}.png`;
            registerAsset(img.url);
          });
        }
      });
      extractionData.count = extractionData.messages.length;

      if (extractionData.localStorageEnabled && currentTeamsId) {
        db.upsertConversation({
          teamsId: currentTeamsId,
          name: extractionData.title
        }).catch(e => console.error(e));
        db.saveMessages(message.messages).catch(e => console.error(e));
      }

      broadcastStatus();
      sendResponse({ count: extractionData.count });
      break;

    case 'ASSET_READY':
      const blob = base64ToBlob(message.base64, 'image/png');
      if (!extractionData.urlToBlob.has(message.url)) {
        extractionData.urlToBlob.set(message.url, blob);
        // Register it so totalAssets increments correctly for fresh downloads
        registerAsset(message.url);
        extractionData.processedAssets++;
        if (extractionData.localStorageEnabled) {
          db.saveAsset({ url: message.url, content: blob, sanitizedFilename: `asset_${Date.now()}.png` }).catch(e => console.error(e));
        }
      }
      broadcastStatus();
      sendResponse({ ok: true });
      break;

    case 'ASSET_FAILED':
      extractionData.processedAssets++;
      broadcastStatus();
      sendResponse({ ok: true });
      break;

    case 'PROGRESS':
      extractionData.count = message.count;
      extractionData.oldestTS = message.oldestTS;
      extractionData.noChangeCount = message.noChangeCount || 0;
      extractionData.waitTime = message.waitTime || 2500;
      broadcastStatus();
      sendResponse({ ok: true });
      break;

    case 'STATUS_UPDATE':
      extractionData.status = message.status;
      broadcastStatus();
      sendResponse({ ok: true });
      break;

    case 'FORCE_RESUME':
      if (extractionData.activeTabId) {
        chrome.tabs.sendMessage(extractionData.activeTabId, { action: 'force_resume' });
      }
      sendResponse({ ok: true });
      break;

    case 'FINISH_EXTRACTION':
      finalizeExtraction();
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
      finalizeExtraction();
      let sTS = 0, eTS = 0;
      if (extractionData.messages.length > 0) {
        sTS = extractionData.messages[0].timestamp;
        eTS = extractionData.messages[extractionData.messages.length - 1].timestamp;
      }
      const fName = `${sanitizeFileName(extractionData.title)}_from_${formatFileTS(sTS)}_to_${formatFileTS(eTS)}.zip`;
      generateZip().then(async blob => {
        const buffer = await blob.arrayBuffer();
        let bStr = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i += 8192) {
          bStr += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
        }
        chrome.downloads.download({
          url: 'data:application/zip;base64,' + btoa(bStr),
          filename: fName,
          conflictAction: 'uniquify',
          saveAs: false
        }, (id) => {
          if (chrome.runtime.lastError) sendResponse({ error: chrome.runtime.lastError.message });
          else sendResponse({ success: true, filename: fName });
        });
      }).catch(err => sendResponse({ error: err.message }));
      return true;

    case 'HEARTBEAT':
      sendResponse({ status: 'alive' });
      break;

    case 'CHECK_FOR_UPDATES':
      checkVersion(true).then(result => sendResponse(result));
      return true;

    case 'CHECK_MESSAGE':
      if (extractionData.localStorageEnabled) {
        db.isMessageStored(message.id).then(stored => {
          sendResponse({ stored: stored });
        }).catch(err => {
          console.error('Failed to check message in DB:', err);
          sendResponse({ stored: false });
        });
      } else {
        sendResponse({ stored: false });
      }
      return true;

    case 'CHECK_ASSET':
      if (extractionData.localStorageEnabled) {
        db.getAsset(message.url).then(asset => {
          if (asset && asset.content) {
            debugLog('Asset found in IndexedDB, skipping download:', message.url);
            if (!extractionData.urlToBlob.has(message.url)) {
              extractionData.urlToBlob.set(message.url, asset.content);
              // Register it so totalAssets increments correctly if not already seen
              registerAsset(message.url);
              extractionData.processedAssets++;
              broadcastStatus();
            }
            sendResponse({ stored: true });
          } else {
            sendResponse({ stored: false });
          }
        }).catch(err => {
          console.error('Failed to check asset in DB:', err);
          sendResponse({ stored: false });
        });
      } else {
        sendResponse({ stored: false });
      }
      return true;

    case 'ERROR':
      extractionData.status = 'error';
      extractionData.error = message.error;
      sendResponse({ ok: true });
      break;

    case 'CLEAR_LOCAL_STORAGE':
      db.clearAll().then(() => {
        sendResponse({ success: true });
      }).catch(err => {
        console.error('Failed to clear DB:', err);
        sendResponse({ success: false, error: err.message });
      });
      return true;

    case 'GET_LOCAL_CONVERSATIONS':
      db.getAllConversations().then(async (convs) => {
        const enriched = await Promise.all(convs.map(async (c) => {
          try {
            const stats = await db.getConversationStats(c.teamsId);
            return { ...c, ...stats };
          } catch (e) {
            console.error('Failed to get stats for', c.teamsId, e);
            return c;
          }
        }));
        sendResponse({ success: true, conversations: enriched });
      }).catch(err => {
        console.error('Failed to fetch conversations:', err);
        sendResponse({ success: false, error: err.message });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
      break;
  }
  return true;
});
