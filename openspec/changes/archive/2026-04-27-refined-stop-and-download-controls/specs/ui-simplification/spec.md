## ADDED Requirements

### Requirement: Completion Action Deactivation
The system SHALL deactivate the download button once a download has been successfully initiated to prevent redundant actions and clarify the completion state.

#### Scenario: Deactivate download button
- **WHEN** the user clicks the "Download Archive (ZIP)" button
- **AND** the download process is successfully initiated via the browser
- **THEN** the button SHALL be disabled.
- **AND** its text SHALL change to "Downloaded!".
