## MODIFIED Requirements

### Requirement: Manual Multi-Conversation Export
The system SHALL allow users to manually initiate ZIP exports for one or more archived conversations from the dashboard.

#### Scenario: Exporting multiple chats
- **WHEN** the user selects multiple conversations in the dashboard
- **AND** clicks the "Export" button
- **THEN** the system SHALL generate a separate ZIP file for each selected conversation.
- **AND** the system SHALL trigger individual downloads for each ZIP using the `chrome.downloads` API.

### Requirement: Removal of Auto-Download
The system SHALL NOT automatically initiate a ZIP download upon completion of a crawl.

#### Scenario: Crawl completion
- **WHEN** an incremental or full crawl finishes successfully
- **THEN** the system SHALL update the local database and the dashboard stats.
- **AND** it SHALL NOT trigger a download dialog.
