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
	var retryStatus = document.getElementById('retryStatus');
	var localStorageToggle = document.getElementById('localStorageToggle');
	var incrementalBtn = document.getElementById('incrementalBtn');
	var clearStorageBtn = document.getElementById('clearStorageBtn');
	var historyBody = document.getElementById('historyBody');
	
	// Initial refresh
	refreshHistoryList();
	
	var activeTabId = null;
	var pollingInterval = null;

	function updateActiveTab() {
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			if (tabs && tabs[0]) {
				activeTabId = tabs[0].id;
				debugLog('Side panel active tab updated to:', activeTabId);
				pollStatus(); // Refresh UI for new tab context
			}
		});
	}

	// Initial query
	updateActiveTab();

	// Listen for tab activation changes
	chrome.tabs.onActivated.addListener(updateActiveTab);
	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === 'complete' && tab.active) {
			updateActiveTab();
		}
	});

	// Listen for broadcasts from background
	chrome.runtime.onMessage.addListener((message) => {
		if (message.action === 'STATUS_UPDATE_BROADCAST') {
			debugLog('Side panel received broadcast:', message.data.status);
			updateUI(message.data);
		}
	});

	function formatDate(ts) {
		if (!ts) return 'N/A';
		var d = new Date(ts);
		var pad = (n) => n.toString().padStart(2, '0');
		return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
	}

	function formatDateTime(ts) {
		if (!ts) return 'N/A';
		var d = new Date(ts);
		var pad = (n) => n.toString().padStart(2, '0');
		return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
	}

	function refreshHistoryList() {
		if (!historyBody) return;
		chrome.runtime.sendMessage({ action: 'GET_LOCAL_CONVERSATIONS' }, function(response) {
			if (response && response.success) {
				var convs = response.conversations || [];
				if (convs.length === 0) {
					historyBody.innerHTML = '<tr><td colspan="4" style="padding: 10px 0; color: #8888a8; text-align: center;">No stored conversations.</td></tr>';
				} else {
					historyBody.innerHTML = '';
					convs.sort((a, b) => (b.lastCrawlTimestamp || 0) - (a.lastCrawlTimestamp || 0));
					convs.forEach(function(conv) {
						var tr = document.createElement('tr');
						
						var nameCell = document.createElement('td');
						nameCell.className = 'history-name-cell';
						nameCell.textContent = conv.name || 'Unknown Chat';
						nameCell.title = conv.name || 'Unknown Chat';
						tr.appendChild(nameCell);

						var countCell = document.createElement('td');
						countCell.style.textAlign = 'center';
						countCell.textContent = conv.messageCount || 0;
						tr.appendChild(countCell);

						var rangeCell = document.createElement('td');
						rangeCell.style.textAlign = 'center';
						rangeCell.style.fontSize = '9px';
						rangeCell.textContent = '[' + formatDate(conv.oldestMessageTimestamp) + ' - ' + formatDate(conv.newestMessageTimestamp) + ']';
						tr.appendChild(rangeCell);

						var dateCell = document.createElement('td');
						dateCell.className = 'history-meta-cell';
						dateCell.textContent = formatDateTime(conv.lastCrawlTimestamp);
						tr.appendChild(dateCell);

						historyBody.appendChild(tr);
					});
				}
				// Adjust height if visible to accommodate new content
				// (Removed dynamic maxHeight adjustment to allow CSS scrollbar to work properly)
			}
		});
	}

	// Handle clear storage button
	if (clearStorageBtn) {
		clearStorageBtn.addEventListener('click', function() {
			if (confirm('Are you sure you want to delete ALL local storage? This cannot be undone.')) {
				chrome.runtime.sendMessage({ action: 'CLEAR_LOCAL_STORAGE' }, function(response) {
					if (response && response.success) {
						showToast('Local storage deleted!');
						refreshHistoryList();
					} else {
						alert('Failed to delete storage: ' + (response ? response.error : 'Unknown error'));
					}
				});
			}
		});
	}

	var isProcessingRequest = false;
	var currentDebugMode = false;
	var currentStatus = 'unknown';
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

	var localStorageHeader = document.getElementById('localStorageHeader');
	var localStorageContent = document.getElementById('localStorageContent');

	function updateLocalStorageVisibility() {
		if (!localStorageToggle || !localStorageContent) return;
		var isEnabled = localStorageToggle.checked;

		// Update incremental button state
		if (incrementalBtn) {
			incrementalBtn.disabled = !isEnabled;
		}

		if (isEnabled) {
			localStorageContent.style.display = 'block';
			refreshHistoryList();
		} else {
			localStorageContent.style.display = 'none';
		}
	}

	// Initial load local storage preference
	chrome.storage.local.get({ localStorageEnabled: true }, function(result) {
		if (localStorageToggle) {
			localStorageToggle.checked = !!result.localStorageEnabled;
			updateLocalStorageVisibility();
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

	// Handle local storage toggle changes
	if (localStorageToggle) {
		localStorageToggle.addEventListener('change', function() {
			var isEnabled = localStorageToggle.checked;
			chrome.storage.local.set({ localStorageEnabled: isEnabled }, function() {
				debugLog('Local storage preference set to:', isEnabled);
				updateLocalStorageVisibility();
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

		// Multi-tab concurrency check
		var isAnotherTabBusy = data.status !== 'idle' && activeTabId !== null && data.activeTabId !== null && activeTabId !== data.activeTabId;

		if (data.status === 'idle') {
			if (retryStatus) retryStatus.style.display = 'none';
			optionsDiv.style.display = 'block';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'none';
			isProcessingRequest = false;   // Reset request lock
			
			currentStatus = 'idle';

			// Re-enable trigger buttons only if no other tab is busy
			optionsDiv.querySelectorAll('button').forEach(function(b) {
				if (b.id === 'incrementalBtn') {
					b.disabled = isAnotherTabBusy || (localStorageToggle ? !localStorageToggle.checked : true);
				} else {
					b.disabled = isAnotherTabBusy;
				}
			});
			if (statusNudge) {
				if (isAnotherTabBusy) {
					statusNudge.innerHTML = '<div style="margin-bottom: 16px;"><strong style="color: #d32f2f;">(!) Notice:</strong> <span style="color: #ffffff;">An extraction is already active in another tab. You can monitor its progress here, but you cannot start a new one until it finishes.</span></div>';
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
			currentStatus = 'extracting';
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (resumeExtractionBtn) resumeExtractionBtn.style.display = 'none';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop current extraction';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'block';
			
			if (activeChatName) activeChatName.textContent = data.title || 'Teams Chat';
			progressText.textContent = data.count + ' new messages collected so far\u2026';

			// Show retry status if waiting
			if (retryStatus) {
				if (data.noChangeCount > 0 && data.noChangeCount < 15) {
					retryStatus.innerHTML = '<strong>(!) Waiting:</strong> It seems we are at the oldest message.<br>Retrying in ' + data.waitTime + 'ms (' + data.noChangeCount + '/15 attempt)...';
					retryStatus.style.display = 'block';
				} else {
					retryStatus.style.display = 'none';
				}
			}
			
			// Clear stuck message if it was there, show resumed message
			if (statusNudge) {
				if (isAnotherTabBusy) {
					statusNudge.innerHTML = '<div style="margin-bottom: 16px;"><strong style="color: #d32f2f;">(!) Notice:</strong> <span style="color: #ffffff;">An extraction is active in another tab.</span></div>';
				} else if (statusNudge.dataset.status === 'stuck' && data.noChangeCount === 0) {
					statusNudge.dataset.status = 'extracting';
					statusNudge.innerHTML = '<div style="margin-bottom: 16px;"><strong style="color: #43a047;">(!) Success:</strong> Extraction resumed successfully!</div>';
					if (resumeMessageTimeout) clearTimeout(resumeMessageTimeout);
					resumeMessageTimeout = setTimeout(function() {
						statusNudge.innerHTML = '';
					}, 10000);
				} else if (data.noChangeCount === 0) {
					// Only clear if we aren't showing a success message or other important alert
					if (!statusNudge.innerHTML.includes('Success')) {
						statusNudge.innerHTML = '';
					}
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
			currentStatus = 'stuck';
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (resumeExtractionBtn) resumeExtractionBtn.style.display = 'block';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop current extraction';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'block';
			
			if (activeChatName) activeChatName.textContent = data.title || 'Teams Chat';
			progressText.textContent = data.count + ' new messages collected so far\u2026';

			if (retryStatus) {
				retryStatus.innerHTML = '<div style="margin-bottom: 4px;"><strong style="color: #f9a825;">(!) Stalled:</strong> The top of the chat may have been reached.</div>' +
										'<div>If you think that some history remains, manually scroll up in Teams then click <strong>Resume Manually</strong>.</div>' +
										'<div>Otherwise, click <strong>Stop current extraction</strong> to finish.</div>';
				retryStatus.style.display = 'block';
			}

			if (statusNudge) {
				statusNudge.dataset.status = 'stuck';
				statusNudge.innerHTML = '';
			}
			
			dateDepth.style.display = 'block';
			progressBarContainer.style.display = 'block';
			progressBar.classList.add('indeterminate');
		} else if (data.status === 'processing') {
			currentStatus = 'processing';
			if (retryStatus) retryStatus.style.display = 'none';
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			finalActionsDiv.style.display = 'none';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Stop current extraction';
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
			currentStatus = 'ready';
			if (retryStatus) retryStatus.style.display = 'none';
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'none';
			finalActionsDiv.style.display = 'block';
			finalMsg.textContent = 'Archive ready: ' + data.count + ' messages and ' + data.totalAssets + ' images.';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'none';
		} else if (data.status === 'error') {
			currentStatus = 'error';
			if (retryStatus) retryStatus.style.display = 'none';
			optionsDiv.style.display = 'none';
			statusDiv.style.display = 'block';
			progressText.innerHTML = '<span style="color:red;">' + data.error + '</span>';
			if (stopAndExportBtn) stopAndExportBtn.textContent = 'Restart';
			if (abortExtractionBtn) abortExtractionBtn.style.display = 'none';
		}
	}

	function pollStatus() {
		debugLog('Side panel polling status...');
		chrome.runtime.sendMessage({ action: 'GET_STATUS' }, function(response) {
			if (response) {
				debugLog('Side panel received poll response:', response.status, response);
				updateUI(response);
			} else {
				console.warn('Side panel received no response from poll.');
			}
		});
	}

	// Start polling
	pollingInterval = setInterval(pollStatus, 1000);
	pollStatus();

	function downloadZip() {
		downloadZipBtn.disabled = true;
		downloadZipBtn.textContent = 'Generating ZIP...';
		
		debugLog('Side panel requesting ZIP download...');
		chrome.runtime.sendMessage({ action: 'DOWNLOAD_ZIP' }, function(response) {
			if (response && response.success) {
				debugLog('Background confirmed download started.');
				showToast('Downloaded!');
				downloadZipBtn.disabled = true;
				downloadZipBtn.textContent = 'Downloaded!';
			} else if (response && response.error) {
				console.error('ZIP generation or download failed on background:', response.error);
				alert('Export failed: ' + response.error);
				// Re-enable on error so user can retry
				downloadZipBtn.disabled = false;
				downloadZipBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Archive (ZIP)';
			} else {
				console.error('Side panel ZIP download request failed or returned unknown response.');
				downloadZipBtn.disabled = false;
				downloadZipBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Archive (ZIP)';
			}
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
			allBtns.forEach(function(b) { 
				b.disabled = true; 
			});

			var days = parseInt(btn.dataset.days, 10);
			var sort = 'oldest';
			
			var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
			var tab = tabs[0];
			if (!tab) {
				isProcessingRequest = false;
				allBtns.forEach(function(b) { 
					b.disabled = false; 
				});
				return;
			}
			activeTabId = tab.id;

			try {
				debugLog('Side panel injecting payload.js into tab:', tab.id);
				await chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['payload.js']
				});
				debugLog('Side panel sending extract signal to tab:', tab.id, { days, sort });
				
				// Get current debug mode and local storage preference from storage
				chrome.storage.session.get(['debugMode'], function(sessionResult) {
					chrome.storage.local.get({ localStorageEnabled: true }, async function(localResult) {
						var debugMode = !!sessionResult.debugMode;
						var localStorageEnabled = !!localResult.localStorageEnabled;
						
						await chrome.tabs.sendMessage(tab.id, { 
							action: 'extract', 
							days: days, 
							sort: sort,
							debugMode: debugMode,
							localStorageEnabled: localStorageEnabled
						});
					});
				});
			} catch (err) {
				console.error('Extraction error:', err);
				isProcessingRequest = false;
				allBtns.forEach(function(b) { 
					b.disabled = false; 
				});
			}
		});
	});

	// Handle manual resume button
	if (resumeExtractionBtn) {
		resumeExtractionBtn.addEventListener('click', function() {
			debugLog('Side panel: Manual resume clicked.');
			chrome.runtime.sendMessage({ action: 'FORCE_RESUME' });
		});
	}

	// Handle abort button
	if (abortExtractionBtn) {
		abortExtractionBtn.addEventListener('click', function() {
			debugLog('Side panel abort button clicked.');
			chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
				refreshHistoryList();
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
			debugLog('Side panel reset button clicked.');
			chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
				refreshHistoryList();
				pollStatus();
			});
		});
	}

	var checkUpdatesLink = document.getElementById('checkUpdates');
	var updateBanner = document.getElementById('updateBanner');
	var newVersionTag = document.getElementById('newVersionTag');
	var updateMessage = document.getElementById('updateMessage');
	var closeUpdateBanner = document.getElementById('closeUpdateBanner');

	// Check for pending updates on load
	function refreshUpdateUI() {
		chrome.storage.local.get(['pendingUpdateVersion', 'updateMessage'], function(result) {
			if (result.pendingUpdateVersion) {
				updateBanner.style.display = 'block';
				if (newVersionTag) newVersionTag.textContent = '(' + result.pendingUpdateVersion + ')';
				if (updateMessage) updateMessage.textContent = result.updateMessage;
			} else {
				updateBanner.style.display = 'none';
			}
		});
	}
	refreshUpdateUI();

	if (closeUpdateBanner) {
		closeUpdateBanner.addEventListener('click', function() {
			updateBanner.style.display = 'none';
			// Optionally clear storage or just hide for this session
			// chrome.storage.local.remove(['pendingUpdateVersion', 'updateMessage']);
		});
	}

	if (checkUpdatesLink) {
		checkUpdatesLink.addEventListener('click', function() {
			if (checkUpdatesLink.textContent === 'Checking...') return;
			
			var originalText = checkUpdatesLink.textContent;
			checkUpdatesLink.textContent = 'Checking...';
			checkUpdatesLink.style.opacity = '0.5';

			chrome.runtime.sendMessage({ action: 'CHECK_FOR_UPDATES' }, function(response) {
				checkUpdatesLink.textContent = originalText;
				checkUpdatesLink.style.opacity = '1';

				if (response && response.success) {
					if (response.isNewer) {
						showToast('New version available!');
						refreshUpdateUI();
					} else {
						showToast('You are up to date!');
					}
				} else {
					showToast('Check failed.');
				}
			});
		});
	}

	// Handle stop button
	if (stopAndExportBtn) {
		stopAndExportBtn.addEventListener('click', async function() {
			debugLog('Side panel stop button clicked.');
			chrome.runtime.sendMessage({ action: 'GET_STATUS' }, async function(data) {
				if (data && data.status === 'error') {
					debugLog('Side panel resetting after error.');
					chrome.runtime.sendMessage({ action: 'RESET_STATUS' }, function() {
						pollStatus();
					});
					return;
				}
				
				if (data && (data.status === 'processing' || data.status === 'stuck')) {
					debugLog('Side panel sending FORCE_STOP_PROCESSING to background.');
					chrome.runtime.sendMessage({ action: 'FORCE_STOP_PROCESSING' }, function(response) {
						debugLog('Force stop processing signal confirmed by background.');
						refreshHistoryList();
					});
				} else {
					debugLog('Side panel sending STOP_EXTRACTION to background.');
					chrome.runtime.sendMessage({ action: 'STOP_EXTRACTION' }, function(response) {
						debugLog('Stop signal confirmed by background.');
						refreshHistoryList();
					});
				}
			});
		});
	}
});
