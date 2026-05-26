## Purpose
Simplify the user interface for better usability.
## Requirements
### Requirement: Chronological Sorting Only
The system SHALL exclusively produce message exports in chronological order (Oldest First), ensuring the most recent message is at the end of the document.

#### Scenario: Chronological export
- **WHEN** an extraction is completed
- **THEN** the messages in the resulting ZIP archive SHALL be sorted from oldest to newest.

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility. The interface SHALL also include a merged block for local database storage and history, where the history dashboard visibility is tied to the toggle state.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be labeled: "Download recent messages", "Download last 30 days", and "Download all messages".
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL at the bottom, below the Conversation List
- **AND** the header title SHALL be "MS Teams Chat Extractor".

#### Scenario: Incremental extraction trigger availability
- **WHEN** the "Local storage" toggle is "Off"
- **THEN** the "Download recent messages" button SHALL be disabled.
- **AND** it SHALL display a tooltip explaining that local storage must be enabled for incremental extraction.

### Requirement: Clarified Telemetry Labeling
The system SHALL use clear and specific labeling for the telemetry opt-in to ensure users understand that only anonymous usage statistics are being shared.

#### Scenario: Rename privacy toggle
- **WHEN** the side panel footer is displayed
- **THEN** the toggle for anonymous usage statistics SHALL be labeled "Stats sharing".
- **AND** it SHALL include an information icon with a tooltip explaining that no personal data or message content is collected.

#### Scenario: Local storage toggle and history visibility
- **WHEN** the side panel is opened for the FIRST time
- **THEN** the "Local storage" toggle SHALL be enabled by default.
- **AND** the history dashboard SHALL be visible (expanded) because the toggle is "On".
- **AND** its state SHALL be persisted across sessions.

#### Scenario: Toggling local storage "Off"
- **WHEN** the user switches the "Local storage" toggle to "Off"
- **THEN** the history dashboard (conversation list) SHALL automatically collapse.

#### Scenario: Toggling local storage "On"
- **WHEN** the user switches the "Local storage" toggle to "On"
- **THEN** the history dashboard (conversation list) SHALL automatically expand.

#### Scenario: Real-time history dashboard
- **WHEN** the "Local storage" section is expanded
- **THEN** the system SHALL fetch conversation metadata from the `conversations` store.
- **AND** for each conversation, it SHALL perform an aggregate query on the `messages` store to display the current message count.
- **AND** it SHALL display the date and time range (YYYY-MM-DD hh:mm) of the stored messages.

### Requirement: Standardized Primary Button Styling
The system SHALL ensure that all primary action buttons (including extraction triggers, "Download ZIP", "Stop current extraction", and "Start New Extraction") share a consistent visual language to ensure they are easily identifiable as interactive elements.

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

### Requirement: Side Panel Responsive Layout
The UI SHALL be optimized for the vertical orientation of the Chrome Side Panel, ensuring that all controls and progress indicators are fully visible without horizontal scrolling. To prevent the side panel from overflowing the browser window height, long lists (such as the conversation history) SHALL be contained within a scrollable area.

#### Scenario: Vertical alignment
- **WHEN** the side panel is rendered
- **THEN** all elements SHALL stack vertically.
- **AND** padding SHALL be adjusted to account for the narrow width of a typical side panel.

#### Scenario: Scrollable conversation history
- **WHEN** the number of stored conversations causes the list to exceed the available vertical space (or a predefined maximum height)
- **THEN** the conversation history container SHALL provide a vertical scrollbar.
- **AND** the overall side panel height SHALL NOT exceed the browser window height.

