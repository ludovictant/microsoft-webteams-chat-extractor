document.addEventListener('DOMContentLoaded', function () {
	var optionsDiv = document.getElementById('options');
	var statusDiv = document.getElementById('status');
	var rangeText = document.getElementById('rangeText');
	var progressText = document.getElementById('progressText');
	var stopBtn = document.getElementById('stopBtn');
	var resumeBtn = document.getElementById('resumeBtn');
	var finalActionsDiv = document.getElementById('finalActions');
	var finalMsg = document.getElementById('finalMsg');
	var downloadZipBtn = document.getElementById('downloadZipBtn');
	var resetBtn = document.getElementById('resetBtn');
	var toast = document.getElementById('toast');
	var progressBarContainer = document.getElementById('progressBarContainer');
	var progressBar = document.getElementById('progressBar');
	var dateDepth = document.getElementById('dateDepth');
	var debugToggle = document.getElementById('debugToggle');
	var statusNudge = document.getElementById('statusNudge');
	
	var activeTabId = null;
	var pollingInterval = null;
	var autoDownloadTriggered = false;
	var currentDebugMode = false;
	var resumeMessageTimeout = null;

	function debugLog(...args) {
		if (currentDebugMode) console.log('[DEBUG]', ...args);
	}

	// Set version number
	var versionNumber = document.getElementById('versionNumber');
	if (versionNumber) {
		versionNumber.textContent = chrome.runtime.getManifest().version;
	}

	// Load debug mode state
	chrome.storage.session.get(['debugMode'], function(result) {
		currentDebugMode = !!result.debugMode;
		if (debugToggle) {
			// Use !! to explicitly cast to boolean (handles undefined as false)
			debugToggle.checked = currentDebugMode;
		}
	});

	// Handle debug toggle changes
	if (debugToggle) {
		debugToggle.addEventListener('change', function() {
			var isEnabled = debugToggle.checked;
			currentDebugMode = isEnabled;
			chrome.storage.session.set({ debugMode: isEnabled }, function() {
				debugLog('Debug mode set to:', isEnabled);
			});
		});
	}

	function showToast(text) {
		toast.textContent = text;
		toast.classList.add('show');
		setTimeout(function () { toast.classList.remove('show'); }, 2000);
	}

	function updateUI(data) {
		debugLog('Updating UI with state:', data.status, data);
		if (data.status === 'idle') {
			optionsDiv.style.display = 'block';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'none';
			autoDownloadTriggered = false; // Reset flag for next run
			if (statusNudge) statusNudge.innerHTML = '';
			if (resumeBtn) resumeBtn.style.display = 'none';
		} else if (data.status === 'extracting') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (resumeBtn) resumeBtn.style.display = 'none';
			if (stopBtn) stopBtn.textContent = 'Stop Extraction then Export';
			
			progressText.textContent = data.count + ' messages collected so far\u2026';
			
			// Clear stuck message if it was there, show resumed message
			if (statusNudge && statusNudge.dataset.status === 'stuck') {
				statusNudge.dataset.status = 'extracting';
				statusNudge.innerHTML = '<span style="color: #43a047; font-weight: bold;">Extraction resumed automatically!</span>';
				if (resumeMessageTimeout) clearTimeout(resumeMessageTimeout);
				resumeMessageTimeout = setTimeout(function() {
					statusNudge.innerHTML = '';
				}, 10000);
			}
			if (data.oldestTS) {
				var oldest = new Date(data.oldestTS);
				dateDepth.style.display = 'block';
				dateDepth.textContent = 'Reached: ' + oldest.toLocaleString([], { year: 'numeric', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
				
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
		} else if (data.status === 'stuck') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (resumeBtn) resumeBtn.style.display = 'block';
			if (stopBtn) stopBtn.textContent = 'Stop and Export';
			
			progressText.textContent = data.count + ' messages collected so far\u2026';
			if (statusNudge) {
				statusNudge.dataset.status = 'stuck';
				statusNudge.innerHTML = '<span style="color: #d83b01; font-weight: bold;">Stuck! Please manually scroll up in the Teams chat window to load more history.</span>';
			}
			
			dateDepth.style.display = 'block';
			progressBarContainer.style.display = 'block';
			progressBar.classList.add('indeterminate');
		} else if (data.status === 'processing') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (stopBtn) stopBtn.textContent = 'Force Stop and Export';
			
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
			
			// Auto-download logic
			if (!autoDownloadTriggered) {
				autoDownloadTriggered = true;
				debugLog('Popup: Auto-triggering ZIP download...');
				downloadZip();
			}
		} else if (data.status === 'error') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			progressText.innerHTML = '<span style="color:red;">' + data.error + '</span>';
			stopBtn.textContent = 'Restart';
		}
	}

	function pollStatus() {
		debugLog('Popup polling status...');
		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, function(response) {
			if (response) {
				debugLog('Popup received poll response:', response.status, response);
				updateUI(response);
			} else {
				console.warn('Popup received no response from poll.');
			}
		});
	}

	// Start polling
	pollingInterval = setInterval(pollStatus, 1000);
	pollStatus();

	function downloadZip() {
		downloadZipBtn.disabled = true;
		downloadZipBtn.textContent = 'Generating ZIP...';
		
		debugLog('Popup requesting ZIP download...');
		chrome.runtime.sendMessage({ action: 'DOWNLOAD_ZIP' }, function(response) {
			if (response && response.base64) {
				debugLog('Popup received ZIP data (Base64), starting local download.');
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
	}

	// Handle time-range button clicks
	optionsDiv.addEventListener('click', async function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;

		var days = parseInt(btn.dataset.days, 10);
		var sort = 'oldest';
		
		var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
		var tab = tabs[0];
		if (!tab) return;
		activeTabId = tab.id;

		try {
			autoDownloadTriggered = false; // Reset flag
			debugLog('Popup injecting payload.js into tab:', tab.id);
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['payload.js']
			});
			debugLog('Popup sending extract signal to tab:', tab.id, { days, sort });
			
			// Get current debug mode from storage to ensure it's up to date
			chrome.storage.session.get(['debugMode'], async function(result) {
				// Use !! to explicitly cast to boolean (handles undefined as false)
				var debugMode = !!result.debugMode;
				await chrome.tabs.sendMessage(tab.id, { 
					action: 'extract', 
					days: days, 
					sort: sort,
					debugMode: debugMode 
				});
			});
		} catch (err) {
			console.error('Extraction error:', err);
		}
	});

	// Handle manual resume button
	if (resumeBtn) {
		resumeBtn.addEventListener('click', function() {
			debugLog('Popup: Manual resume clicked.');
			chrome.runtime.sendMessage({ action: 'FORCE_RESUME' });
		});
	}

	// Handle download ZIP
	downloadZipBtn.addEventListener('click', function() {
		downloadZip();
	});

	// Handle reset button
	resetBtn.addEventListener('click', function() {
		debugLog('Popup reset button clicked.');
		chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
			pollStatus();
		});
	});

	// Handle stop button
	stopBtn.addEventListener('click', async function() {
		debugLog('Popup stop button clicked.');
		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, async function(data) {
			if (data && data.status === 'error') {
				debugLog('Popup resetting after error.');
				chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
					pollStatus();
				});
				return;
			}
			
			if (data && (data.status === 'processing' || data.status === 'stuck')) {
				debugLog('Popup sending FORCE_STOP_PROCESSING to background.');
				chrome.runtime.sendMessage({ action: 'FORCE_STOP_PROCESSING' }, function(response) {
					debugLog('Force stop processing signal confirmed by background.');
				});
			} else {
				debugLog('Popup sending STOP_EXTRACTION to background.');
				chrome.runtime.sendMessage({ action: 'STOP_EXTRACTION' }, function(response) {
					debugLog('Stop signal confirmed by background.');
				});
			}
		});
	});
});
