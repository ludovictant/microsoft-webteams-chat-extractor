## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface, including a toggle for enabling local database storage.

#### Scenario: Local storage toggle
- **WHEN** the side panel is opened
- **THEN** a "Local storage" toggle SHALL be displayed below the "Download all messages" button.
- **AND** the state of this toggle SHALL be persisted across sessions using `chrome.storage`.
