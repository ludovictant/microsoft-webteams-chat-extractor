## MODIFIED Requirements

### Requirement: Oldest Timestamp Reporting
The content script SHALL calculate and send the Unix timestamp of the oldest message collected so far, along with any stall metadata (retry count and wait time), in every `progress` message sent to the extension.

#### Scenario: Progress message contains timestamp and stall data
- **WHEN** the `scrollAndExtract` loop completes a collection cycle
- **THEN** it SHALL include `oldestTS`, `noChangeCount`, and `waitTime` in the data sent to `chrome.runtime.sendMessage`
