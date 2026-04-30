## ADDED Requirements

### Requirement: Consistent Disabled Button Feedback
The system SHALL provide clear and consistent visual feedback for all disabled buttons to ensure users understand when an action is unavailable.

#### Scenario: Visual feedback for disabled buttons
- **WHEN** any button in the popup is in a disabled state
- **THEN** it SHALL be displayed with reduced opacity, a "not-allowed" cursor, and a distinct background color.

## MODIFIED Requirements

### Requirement: Completion Action Deactivation
The system SHALL deactivate the download button once a download has been successfully initiated to prevent redundant actions and clarify the completion state. Additionally, the system SHALL reset the download button to its original state when returning to the initial selection screen.

#### Scenario: Deactivate download button
- **WHEN** the user clicks the "Download Archive (ZIP)" button
- **AND** the download process is successfully initiated via the browser
- **THEN** the button SHALL be disabled.
- **AND** its text SHALL change to "Downloaded!".

#### Scenario: Reset download button on return
- **WHEN** the system returns to the initial selection screen (e.g., after clicking "Start New Extraction")
- **THEN** the download button SHALL be re-enabled.
- **AND** its text and icon SHALL be restored to their original state.
