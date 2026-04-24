document.addEventListener('DOMContentLoaded', function () {
	var optionsDiv = document.getElementById('options');
	var statusDiv = document.getElementById('status');
	var rangeText = document.getElementById('rangeText');
	var progressText = document.getElementById('progressText');
	var stopBtn = document.getElementById('stopBtn');
	var chatDiv = document.getElementById('chat');
	var titleEl = document.getElementById('title');
	var toolbarDiv = document.getElementById('toolbar');
	var copyBtn = document.getElementById('copyBtn');
	var mdBtn = document.getElementById('mdBtn');
	var htmlBtn = document.getElementById('htmlBtn');
	var toast = document.getElementById('toast');
	var activeTabId = null;
	var currentChatTitle = 'teams-chat';
	var currentOldestTS = null;
	var currentNewestTS = null;

	// Set version number from manifest
	var versionNumber = document.getElementById('versionNumber');
	if (versionNumber) {
		versionNumber.textContent = chrome.runtime.getManifest().version;
	}

	function sanitizeFilename(name) {
		return name.replace(/[<>:"\/\\|?*]/g, '_').replace(/\s+/g, ' ').trim();
	}

	function formatDateTime(isoString) {
		if (!isoString) return '';
		var d = new Date(isoString);
		var pad = function (n) { return n.toString().padStart(2, '0'); };
		return d.getFullYear() +
			pad(d.getMonth() + 1) +
			pad(d.getDate()) +
			'.' +
			pad(d.getHours()) +
			pad(d.getMinutes()) +
			pad(d.getSeconds());
	}

	function getFilenameSuffix() {
		var oldest = currentOldestTS && new Date(currentOldestTS).getTime() !== 0 
			? formatDateTime(currentOldestTS) 
			: 'unknown';
		
		var newest = currentNewestTS && new Date(currentNewestTS).getTime() !== 0 
			? formatDateTime(currentNewestTS) 
			: 'unknown';

		return '_' + oldest + '_' + newest;
	}

	function showToast(text) {
		toast.textContent = text;
		toast.classList.add('show');
		setTimeout(function () { toast.classList.remove('show'); }, 2000);
	}

	// Convert the transcript HTML to Markdown
	function htmlToMarkdown(container) {
		var lines = [];
		container.querySelectorAll('.message').forEach(function (msg) {
			var hr = msg.querySelector('hr');
			var bold = msg.querySelector('b');
			var time = msg.querySelector('span');
			if (hr && bold) {
				lines.push('---');
				lines.push('**' + bold.textContent + '** ' + (time ? time.textContent : ''));
				lines.push('');
			}
			var divider = msg.querySelector('.divider');
			if (divider) {
				lines.push('---');
				lines.push(divider.textContent.trim());
				lines.push('---');
				lines.push('');
			}
			var section = msg.querySelector('section');
			if (section) {
				var clone = section.cloneNode(true);
				clone.querySelectorAll('a').forEach(function (a) {
					var linkText = a.innerText.trim() || a.href;
					var mdLink = '[' + linkText + '](' + a.href + ')';
					a.parentNode.replaceChild(document.createTextNode(mdLink), a);
				});
				clone.querySelectorAll('img').forEach(function (img) {
					var alt = img.alt || 'image';
					var mdImg = '![' + alt + '](' + img.src + ')';
					img.parentNode.replaceChild(document.createTextNode(mdImg), img);
				});
				lines.push('> ' + clone.innerText.trim().replace(/\n/g, '\n> '));
				lines.push('');
			}
		});
		return lines.join('\n');
	}

	// Copy transcript text to clipboard
	copyBtn.addEventListener('click', function () {
		var transcript = chatDiv.querySelector('#transcript');
		if (!transcript) return;
		var text = transcript.innerText;
		navigator.clipboard.writeText(text).then(function () {
			showToast('Copied!');
		});
	});

	// Export transcript as Markdown file
	mdBtn.addEventListener('click', function () {
		var transcript = chatDiv.querySelector('#transcript');
		if (!transcript) return;
		var md = htmlToMarkdown(transcript);
		var blob = new Blob([md], { type: 'text/markdown' });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = sanitizeFilename(currentChatTitle) + getFilenameSuffix() + '.md';
		a.click();
		URL.revokeObjectURL(url);
		showToast('Downloaded!');
	});

	// Export transcript as HTML file
	htmlBtn.addEventListener('click', function () {
		var transcript = chatDiv.querySelector('#transcript');
		if (!transcript) return;
		var content = transcript.innerHTML;
		var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + currentChatTitle + '</title><style>' +
			'body { font-family: "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif; ' +
			'       background-color: #ffffff; color: #242424; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.4; } ' +
			'h1 { font-size: 18px; font-weight: 600; color: #242424; border-bottom: 1px solid #e1e1e1; padding-bottom: 10px; margin-bottom: 20px; } ' +
			'.message-container { display: block; width: 100%; margin-bottom: 12px; } ' +
			'.message-header { display: flex; align-items: baseline; margin-bottom: 4px; padding-left: 8px; } ' +
			'.author { font-size: 12px; font-weight: 400; color: #616161; margin-right: 8px; } ' +
			'.timestamp { font-size: 12px; color: #616161; } ' +
			'.message-box { background-color: #F5F5F5; padding: 5px 14px; border-radius: 8px; display: inline-block; min-width: 100px; max-width: 90%; box-sizing: border-box; } ' +
			'.message-body { font-size: 14px; color: #242424; word-wrap: break-word; } ' +
			'.message-body img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; display: block; } ' +
			'blockquote { border-left: 3px solid #C7C7C7; margin: 8px 0; padding: 8px 12px; background-color: #FAFAFA; border-radius: 4px; font-size: 13px; color: #424242; display: inline-block; min-width: 150px; max-width: 100%; box-sizing: border-box; } ' +
			'.date-divider { display: flex; align-items: center; text-align: center; margin: 24px 0; color: #616161; font-size: 12px; font-weight: 600; } ' +
			'.date-divider::before, .date-divider::after { content: ""; flex: 1; border-bottom: 1px solid #e1e1e1; } ' +
			'.date-divider span { padding: 0 12px; } ' +
			'a { color: #6264a7; text-decoration: none; } ' +
			'a:hover { text-decoration: underline; } ' +
			'#version-tag { font-size: 10px; color: #888; margin-top: 40px; text-align: right; border-top: 1px solid #eee; padding-top: 10px; } ' +
			'</style></head><body><h1>' + currentChatTitle + '</h1>' + content + '</body></html>';
		var blob = new Blob([html], { type: 'text/html' });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = sanitizeFilename(currentChatTitle) + getFilenameSuffix() + '.html';
		a.click();
		URL.revokeObjectURL(url);
		showToast('Downloaded!');
	});

	// Listen for progress and result messages from the content script
	chrome.runtime.onMessage.addListener(function (message, sender) {
		if (!sender.tab || sender.tab.id !== activeTabId) return;

		if (message.type === 'progress') {
			progressText.textContent = message.count + ' messages collected so far\u2026';
		} else if (message.type === 'result') {
			statusDiv.style.display = 'none';
			toolbarDiv.style.display = 'flex';
			chatDiv.style.display = 'block';
			currentChatTitle = message.title || 'teams-chat';
			currentOldestTS = message.oldestTS;
			currentNewestTS = message.newestTS;
			chatDiv.innerHTML = '<div id="transcript">' + (message.html || '<p>No messages found.</p>') + '</div>';
			if (message.count) {
				titleEl.textContent = currentChatTitle + ' (' + message.count + ' messages)';
			}
		} else if (message.type === 'error') {
			statusDiv.style.display = 'none';
			chatDiv.style.display = 'block';
			chatDiv.innerHTML = '<p style="color:red;">' + message.error + '</p>';
		}
	});

	// Handle time-range button clicks
	optionsDiv.addEventListener('click', async function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;

		var days = parseInt(btn.dataset.days, 10);
		var sort = document.querySelector('input[name="sort"]:checked').value;
		var label = btn.textContent;

		optionsDiv.style.display = 'none';
		statusDiv.style.display = 'block';
		chatDiv.style.display = 'none';
		rangeText.textContent = label;
		stopBtn.textContent = 'Stop Extraction';
		stopBtn.disabled = false;

		if (days < 0) {
			progressText.textContent = 'Extracting loaded messages\u2026';
		} else if (days === 0) {
			progressText.textContent = 'Scrolling to load all messages\u2026';
		} else {
			progressText.textContent = 'Scrolling back in time\u2026';
		}

		var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
		var tab = tabs[0];
		if (!tab) {
			statusDiv.style.display = 'none';
			chatDiv.style.display = 'block';
			chatDiv.innerHTML = '<p style="color:red;">No active tab found.</p>';
			return;
		}

		activeTabId = tab.id;

		try {
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['payload.js']
			});

			await chrome.tabs.sendMessage(tab.id, { action: 'extract', days: days, sort: sort });
		} catch (err) {
			statusDiv.style.display = 'none';
			chatDiv.style.display = 'block';
			chatDiv.innerHTML = '<p style="color:red;">Could not extract chat. Make sure you are on a Microsoft Teams chat page (teams.microsoft.com).</p>';
			console.error('Extraction error:', err);
		}
	});

	// Handle stop button
	stopBtn.addEventListener('click', async function() {
		if (activeTabId) {
			try {
				await chrome.tabs.sendMessage(activeTabId, { action: 'stop' });
				stopBtn.textContent = 'Stopping...';
				stopBtn.disabled = true;
			} catch (e) {
				console.error('Stop error:', e);
			}
		}
	});
});
