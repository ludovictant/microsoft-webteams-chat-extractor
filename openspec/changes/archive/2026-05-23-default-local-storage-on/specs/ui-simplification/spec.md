## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility. The interface SHALL also include a toggle for enabling local database storage and a dashboard showing local history with real-time statistics.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be labeled: "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL be positioned below the disclaimer and above the extraction trigger buttons.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

#### Scenario: Local storage toggle
- **WHEN** the side panel is opened for the FIRST time
- **THEN** the "Local storage" toggle SHALL be enabled by default.
- **AND** its state SHALL be persisted across sessions.

#### Scenario: Real-time history dashboard
- **WHEN** the "Local storage" section is expanded
- **THEN** the system SHALL fetch conversation metadata from the `conversations` store.
- **AND** for each conversation, it SHALL perform an aggregate query on the `messages` store to display the current message count and date range.
