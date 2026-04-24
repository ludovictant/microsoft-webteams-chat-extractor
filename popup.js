document.addEventListener('DOMContentLoaded', function () {
	var optionsDiv = document.getElementById('options');
	var statusDiv = document.getElementById('status');
	var rangeText = document.getElementById('rangeText');
	var progressText = document.getElementById('progressText');
	var stopBtn = document.getElementById('stopBtn');
	var finalActionsDiv = document.getElementById('finalActions');
	var finalMsg = document.getElementById('finalMsg');
	var downloadZipBtn = document.getElementById('downloadZipBtn');
	var toast = document.getElementById('toast');
	var progressBarContainer = document.getElementById('progressBarContainer');
	var progressBar = document.getElementById('progressBar');
	var dateDepth = document.getElementById('dateDepth');
	
	var activeTabId = null;
	var pollingInterval = null;

	// Set version number
	var versionNumber = document.getElementById('versionNumber');
	if (versionNumber) {
		versionNumber.textContent = chrome.runtime.getManifest().version;
	}

	function showToast(text) {
		toast.textContent = text;
		toast.classList.add('show');
		setTimeout(function () { toast.classList.remove('show'); }, 2000);
	}

	function updateUI(data) {
		console.log('Updating UI with state:', data.status, data);
		if (data.status === 'idle') {
			optionsDiv.style.display = 'block';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'none';
		} else if (data.status === 'extracting') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			
			progressText.textContent = data.count + ' messages collected so far\u2026';
			if (data.oldestTS) {
				var oldest = new Date(data.oldestTS);
				dateDepth.style.display = 'block';
				dateDepth.textContent = 'Reached: ' + oldest.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
				
				if (data.days > 0 && data.startTime) {
					progressBarContainer.style.display = 'block';
					var totalRange = data.days * 24 * 60 * 60 * 1000;
					var elapsedRange = data.startTime - data.oldestTS;
					var percent = Math.min(100, Math.max(0, (elapsedRange / totalRange) * 100));
					progressBar.style.width = percent + '%';
					progressBar.classList.remove('indeterminate');
				} else if (data.days === 0) {
					progressBarContainer.style.display = 'block';
					progressBar.classList.add('indeterminate');
				} else {
					progressBarContainer.style.display = 'none';
				}
			}
		} else if (data.status === 'processing') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			
			rangeText.textContent = 'Processing chat data\u2026';
			progressBar.classList.remove('indeterminate');
			progressBarContainer.style.display = 'block';
			dateDepth.style.display = 'none';

			if (data.totalAssets > 0) {
				var percent = Math.min(100, Math.max(0, (data.processedAssets / data.totalAssets) * 100));
				progressBar.style.width = percent + '%';
				progressText.textContent = 'Converting images: ' + data.processedAssets + ' / ' + data.totalAssets;
			} else {
				progressText.textContent = 'Finalizing transcript\u2026';
				progressBar.style.width = '100%';
			}
		} else if (data.status === 'ready') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'block';
			finalMsg.textContent = 'Archive ready: ' + data.count + ' messages and ' + data.totalAssets + ' images.';
		} else if (data.status === 'error') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			progressText.innerHTML = '<span style="color:red;">' + data.error + '</span>';
			stopBtn.textContent = 'Restart';
		}
	}

	function pollStatus() {
		console.log('Popup polling status...');
		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, function(response) {
			if (response) {
				console.log('Popup received poll response:', response.status, response);
				updateUI(response);
			} else {
				console.warn('Popup received no response from poll.');
			}
		});
	}

	// Start polling
	pollingInterval = setInterval(pollStatus, 1000);
	pollStatus();

	// Handle time-range button clicks
	optionsDiv.addEventListener('click', async function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;

		var days = parseInt(btn.dataset.days, 10);
		var sort = document.querySelector('input[name="sort"]:checked').value;
		
		var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
		var tab = tabs[0];
		if (!tab) return;
		activeTabId = tab.id;

		try {
			console.log('Popup injecting payload.js into tab:', tab.id);
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['payload.js']
			});
			console.log('Popup sending extract signal to tab:', tab.id, { days, sort });
			await chrome.tabs.sendMessage(tab.id, { action: 'extract', days: days, sort: sort });
		} catch (err) {
			console.error('Extraction error:', err);
		}
	});

	// Handle download ZIP
	downloadZipBtn.addEventListener('click', function() {
		downloadZipBtn.disabled = true;
		downloadZipBtn.textContent = 'Generating ZIP...';
		
		console.log('Popup requesting ZIP download...');
		chrome.runtime.sendMessage({ action: 'DOWNLOAD_ZIP' }, function(response) {
			if (response && response.base64) {
				console.log('Popup received ZIP data (Base64), starting local download.');
				// Convert Base64 to Blob
				var binaryString = atob(response.base64);
				var bytes = new Uint8Array(binaryString.length);
				for (var i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				var blob = new Blob([bytes], { type: 'application/zip' });
				
				var url = URL.createObjectURL(blob);
				var a = document.createElement('a');
				a.href = url;
				a.download = response.filename;
				a.click();
				URL.revokeObjectURL(url);
				showToast('Downloaded!');
			} else if (response && response.error) {
				console.error('ZIP generation failed on background:', response.error);
				alert('ZIP generation failed: ' + response.error);
			} else {
				console.error('Popup ZIP download failed or returned no data.');
			}
			downloadZipBtn.disabled = false;
			downloadZipBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Archive (ZIP)';
		});
	});

	// Handle stop button
	stopBtn.addEventListener('click', async function() {
		console.log('Popup stop button clicked.');
		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, async function(data) {
			if (data && data.status === 'error') {
				console.log('Popup resetting after error.');
				window.location.reload();
				return;
			}
			console.log('Popup sending STOP_EXTRACTION to background.');
			chrome.runtime.sendMessage({ action: 'STOP_EXTRACTION' }, function(response) {
				console.log('Stop signal confirmed by background.');
			});
		});
	});
});
