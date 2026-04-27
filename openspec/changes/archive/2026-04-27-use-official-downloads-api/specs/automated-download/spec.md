## MODIFIED Requirements

### Requirement: Trigger download upon completion
The system SHALL automatically initiate the ZIP download process using the official **Chrome Downloads API** as soon as the background script transitions to the 'ready' state.

#### Scenario: Auto-download when ready
- **WHEN** the background script status changes to 'ready'
- **AND** the popup is polling for status
- **THEN** the popup SHALL automatically trigger the `DOWNLOAD_ZIP` request.
- **AND** the system SHALL use `chrome.downloads.download` to save the file locally without automatically opening it.
- **NOTE**: Actual auto-opening behavior is subject to user-level Chrome settings and may not be entirely preventable via extension code.
