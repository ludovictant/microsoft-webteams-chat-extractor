document.addEventListener('DOMContentLoaded', function () {
	var optionsDiv = document.getElementById('options');
	var statusDiv = document.getElementById('status');
	var progressText = document.getElementById('progressText');
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
		if (currentOldestTS && currentNewestTS) {
			return '_' + formatDateTime(currentOldestTS) + '_' + formatDateTime(currentNewestTS);
		}
		return '-' + new Date().toISOString().slice(0, 10);
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
			'body { font-family: sans-serif; max-width: 800px; margin: 2em auto; padding: 0 1em; line-height: 1.6; }' +
			'.message { margin-bottom: 1.5em; }' +
			'hr { border: none; border-top: 1px solid #ddd; margin: 1em 0; }' +
			'section { padding-left: 1em; border-left: 2px solid #ccc; }' +
			'blockquote { border-left: 3px solid #6264a7; margin: 0.5em 0; padding: 0.25em 0.75em; background: #f5f5f5; border-radius: 4px; }' +
			'.divider { text-align: center; color: #666; font-size: 0.9em; margin: 2em 0; }' +
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

		optionsDiv.style.display = 'none';
		statusDiv.style.display = 'block';
		chatDiv.style.display = 'none';

		if (days < 0) {
			progressText.textContent = 'Extracting loaded messages\u2026';
		} else if (days === 0) {
			progressText.textContent = 'Scrolling to load all messages\u2026';
		} else {
			progressText.textContent = 'Scrolling to load last ' + days + ' days\u2026';
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
});
