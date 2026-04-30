## ADDED Requirements

### Requirement: Chronological Sorting Only
The system SHALL exclusively produce message exports in chronological order (Oldest First), ensuring the most recent message is at the end of the document.

#### Scenario: Chronological export
- **WHEN** an extraction is completed
- **THEN** the messages in the resulting ZIP archive SHALL be sorted from oldest to newest.

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension popup is opened
- **THEN** the extraction buttons SHALL be labeled: "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL be positioned below the disclaimer and above the extraction trigger buttons.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

### Requirement: Standardized Primary Button Styling
The system SHALL ensure that all primary action buttons (including extraction triggers, "Download ZIP", "Stop and Export", and "Start New Extraction") share a consistent visual language to ensure they are easily identifiable as interactive elements.

#### Scenario: Extraction triggers match standard theme
- **WHEN** the extraction trigger buttons are displayed in the options panel
- **THEN** they SHALL have the same background color, border radius, and typography as other primary action buttons (e.g., green theme).

### Requirement: Standardized Status Nudge Formatting
The system SHALL use a consistent HTML structure and CSS styling for all temporary status alerts (e.g., stalled, resumed) to ensure visual coherence.

#### Scenario: Professional status alerts
- **WHEN** a status alert is displayed in the popup
- **THEN** it SHALL use standardized spacing, font-weight, and color coding (e.g., amber for stalls, green for success).

### Requirement: Consistent Disabled Button Feedback
The system SHALL provide clear and consistent visual feedback for all disabled buttons to ensure users understand when an action is unavailable.

#### Scenario: Visual feedback for disabled buttons
- **WHEN** any button in the popup is in a disabled state
- **THEN** it SHALL be displayed with reduced opacity, a "not-allowed" cursor, and a distinct background color.

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
