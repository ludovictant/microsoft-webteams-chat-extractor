## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility. The interface SHALL also include a merged block for local database storage and history, where the history dashboard visibility is tied to the toggle state.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be labeled: "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL be positioned below the disclaimer and above the extraction trigger buttons.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

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
