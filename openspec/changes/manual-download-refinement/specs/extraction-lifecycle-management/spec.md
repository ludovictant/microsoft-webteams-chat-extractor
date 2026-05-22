## MODIFIED Requirements

### Requirement: Completion Action Deactivation
The system SHALL deactivate the download button once a download has been successfully initiated to prevent redundant actions and clarify the completion state. Additionally, the system SHALL reset the download button to its original state when returning to the initial selection screen.

#### Scenario: Deactivate download button
- **WHEN** the user clicks the "Download Archive (ZIP)" button
- **AND** the download process is successfully initiated via the browser
- **THEN** the button SHALL be permanently disabled for the current session.
- **AND** its text SHALL change to "Downloaded!".

#### Scenario: Reset download button on return
- **WHEN** the system returns to the initial selection screen (e.g., after clicking "Start New Extraction")
- **THEN** the download button SHALL be re-enabled.
- **AND** its text and icon SHALL be restored to their original state (including the SVG icon).
