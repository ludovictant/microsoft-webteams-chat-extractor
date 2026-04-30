document.addEventListener('DOMContentLoaded', function () {
	var optionsDiv = document.getElementById('options');
	var statusDiv = document.getElementById('status');
	var activeChatName = document.getElementById('activeChatName');
	var rangeText = document.getElementById('rangeText');
	var progressText = document.getElementById('progressText');
	var stopAndExportBtn = document.getElementById('stopAndExportBtn');
	var resumeExtractionBtn = document.getElementById('resumeExtractionBtn');
	var abortExtractionBtn = document.getElementById('abortExtractionBtn');
	var finalActionsDiv = document.getElementById('finalActions');
	var finalMsg = document.getElementById('finalMsg');
	var downloadZipBtn = document.getElementById('downloadZipBtn');
	var startNewExtractionBtn = document.getElementById('startNewExtractionBtn');
	var toast = document.getElementById('toast');
	var progressBarContainer = document.getElementById('progressBarContainer');
	var progressBar = document.getElementById('progressBar');
	var dateDepth = document.getElementById('dateDepth');
	var debugToggle = document.getElementById('debugToggle');
	var statusNudge = document.getElementById('statusNudge');
	var disclaimerBox = document.getElementById('disclaimerBox');
	
	var activeTabId = null;
	var pollingInterval = null;

	// Query current tab ID on startup
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		if (tabs && tabs[0]) activeTabId = tabs[0].id;
	});

	var autoDownloadTriggered = false;
	var isProcessingRequest = false;
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

		// Multi-tab concurrency check: is the active extraction in a DIFFERENT tab?
		// 1. data.status !== 'idle': Something is happening in the background
		// 2. activeTabId !== null: This popup successfully identified its current tab
		// 3. data.activeTabId !== null: The background has a recorded tab for the current task
		// 4. activeTabId !== data.activeTabId: The IDs don't match -> current tab is NOT the owner
		var isAnotherTabBusy = data.status !== 'idle' && activeTabId !== null && data.activeTabId !== null && activeTabId !== data.activeTabId;

		if (data.status === 'idle') {
			optionsDiv.style.display = 'block';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'none';
			autoDownloadTriggered = false; // Reset flag for next run
			isProcessingRequest = false;   // Reset request lock
			
			// Re-enable trigger buttons only if no other tab is busy
			optionsDiv.querySelectorAll('button').forEach(function(b) { 
				b.disabled = isAnotherTabBusy; 
			});

			if (statusNudge) {
				if (isAnotherTabBusy) {
					statusNudge.innerHTML = '<div><strong style="color: #d32f2f;">(!) Notice:</strong> <span style="color: #ffffff;">An extraction is already active in another tab. You can monitor its progress here, but you cannot start a new one until it finishes.</span></div>';
				} else {
					statusNudge.innerHTML = '';
				}
			}
			if (resumeExtractionBtn) resumeExtractionBtn.style.display = 'none';
			
			// Reset download button
			if (downloadZipBtn) {
				downloadZipBtn.disabled = false;
				downloadZipBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Archive (ZIP)';
			}
		} else if (data.status === 'extracting') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (resumeExtractionBtn) resumeExtractionBtn.style.display = 'none';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop and Export';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'block';
			
			if (activeChatName) activeChatName.textContent = data.title || 'Teams Chat';
			progressText.textContent = data.count + ' messages collected so far\u2026';
			
			// Clear stuck message if it was there, show resumed message
			if (statusNudge) {
				if (isAnotherTabBusy) {
					statusNudge.innerHTML = '<div><strong style="color: #d32f2f;">(!) Notice:</strong> <span style="color: #ffffff;">An extraction is active in another tab.</span></div>';
				} else if (statusNudge.dataset.status === 'stuck') {
					statusNudge.dataset.status = 'extracting';
					statusNudge.innerHTML = '<div><strong style="color: #43a047;">(!) Success:</strong> Extraction resumed successfully!</div>';
					if (resumeMessageTimeout) clearTimeout(resumeMessageTimeout);
					resumeMessageTimeout = setTimeout(function() {
						statusNudge.innerHTML = '';
					}, 10000);
				}
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
			if (resumeExtractionBtn) resumeExtractionBtn.style.display = 'block';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop and Export';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'block';
			
			if (activeChatName) activeChatName.textContent = data.title || 'Teams Chat';
			progressText.textContent = data.count + ' messages collected so far\u2026';
			if (statusNudge) {
				statusNudge.dataset.status = 'stuck';
				statusNudge.innerHTML = '<div style="margin-bottom: 4px;"><strong style="color: #f9a825;">(!) Stalled:</strong> The top of the chat may have been reached.</div>' +
										'<div>If you think that some history remains, manually scroll up in Teams then click <strong>Resume Manually</strong>.</div>' +
										'<div>Otherwise, click <strong>Stop and Export</strong> to finish.</div>';
			}
			
			dateDepth.style.display = 'block';
			progressBarContainer.style.display = 'block';
			progressBar.classList.add('indeterminate');
		} else if (data.status === 'processing') {
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop and Export';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'block';
			
			if (activeChatName) activeChatName.textContent = data.title || 'Teams Chat';
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
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'none';
			
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
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Restart';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'none';
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
				
				// Use the Chrome Downloads API instead of anchor click to prevent auto-opening
				chrome.downloads.download({
					url: 'data:application/zip;base64,' + response.base64,
					filename: response.filename,
					conflictAction: 'uniquify',
					saveAs: false // False to prevent opening a Save As dialog
				}, function(downloadId) {
					if (chrome.runtime.lastError) {
						console.error('Download failed:', chrome.runtime.lastError);
					} else {
						debugLog('Download started with ID:', downloadId);
						showToast('Downloaded!');
						downloadZipBtn.disabled = true;
						downloadZipBtn.textContent = 'Downloaded!';
					}
				});
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

		// Prevent concurrent requests
		if (isProcessingRequest) {
			console.log('[CONCURRENCY] Extraction already in progress. Ignoring concurrent request.');
			return;
		}

		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, async function(data) {
			if (data && data.status !== 'idle') {
				console.log('[CONCURRENCY] System status is ' + data.status + '. Ignoring start request.');
				return;
			}

			isProcessingRequest = true;
			
			// Disable all trigger buttons immediately
			var allBtns = optionsDiv.querySelectorAll('button');
			allBtns.forEach(function(b) { b.disabled = true; });

			var days = parseInt(btn.dataset.days, 10);
			var sort = 'oldest';
			
			var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
			var tab = tabs[0];
			if (!tab) {
				isProcessingRequest = false;
				allBtns.forEach(function(b) { b.disabled = false; });
				return;
			}
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
				isProcessingRequest = false;
				allBtns.forEach(function(b) { b.disabled = false; });
			}
		});
	});

	// Handle manual resume button
	if (resumeExtractionBtn) {
		resumeExtractionBtn.addEventListener('click', function() {
			debugLog('Popup: Manual resume clicked.');
			chrome.runtime.sendMessage({ action: 'FORCE_RESUME' });
		});
	}

	// Handle abort button
	if (abortExtractionBtn) {
		abortExtractionBtn.addEventListener('click', function() {
			debugLog('Popup abort button clicked.');
			chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
				pollStatus();
			});
		});
	}

	// Handle download ZIP
	downloadZipBtn.addEventListener('click', function() {
		downloadZip();
	});

	// Handle reset button
	if (startNewExtractionBtn) {
		startNewExtractionBtn.addEventListener('click', function() {
			debugLog('Popup reset button clicked.');
			chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
				pollStatus();
			});
		});
	}

	// Handle stop button
	if (stopAndExportBtn) {
		stopAndExportBtn.addEventListener('click', async function() {
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
	}
});
