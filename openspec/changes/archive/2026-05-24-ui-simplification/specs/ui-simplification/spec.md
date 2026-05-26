## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility. The interface SHALL also include a merged block for local database storage and history, where the history dashboard visibility is tied to the toggle state. The system SHALL also include a telemetry toggle with clear labeling.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be limited to: "Download recent messages", "Download last 30 days", and "Download all messages".
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL be positioned below the disclaimer and above the extraction trigger buttons.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

#### Scenario: Stats sharing toggle
- **WHEN** the side panel is opened
- **THEN** a toggle labeled "Stats sharing" SHALL be visible in the footer.
- **AND** it SHALL be accompanied by an information icon with a tooltip explaining that anonymous stats help improve the tool and that no personal data is collected.

#### Scenario: Local storage toggle and history visibility
- **WHEN** the side panel is opened for the FIRST time
- **THEN** the "Local storage" toggle SHALL be enabled by default (ON).
- **AND** the history dashboard SHALL be visible (expanded) because the toggle is "On".
- **AND** its state SHALL be persisted across sessions.
