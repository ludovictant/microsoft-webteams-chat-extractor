## ADDED Requirements

### Requirement: Trigger download upon completion
The system SHALL automatically initiate the ZIP download process as soon as the background script transitions to the 'ready' state.

#### Scenario: Auto-download when ready
- **WHEN** the background script status changes to 'ready'
- **AND** the popup is polling for status
- **THEN** the popup SHALL automatically trigger the `DOWNLOAD_ZIP` request and initiate the file saving process.

### Requirement: Prevent multiple auto-downloads
The system SHALL ensure that an automatic download is only triggered once per extraction session.

#### Scenario: Single auto-download trigger
- **WHEN** an auto-download has been successfully initiated
- **THEN** the system SHALL mark the session as 'downloaded' to prevent redundant download triggers during subsequent status polls.
