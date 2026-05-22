## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility.

#### Scenario: Simplified extraction triggers
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be labeled: "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the disclaimer SHALL include a warning against using the tool simultaneously in different tabs or windows.
- **AND** the Debug Mode switch SHALL be positioned below the disclaimer and above the extraction trigger buttons.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

## ADDED Requirements

### Requirement: Side Panel Responsive Layout
The UI SHALL be optimized for the vertical orientation of the Chrome Side Panel, ensuring that all controls and progress indicators are fully visible without horizontal scrolling.

#### Scenario: Vertical alignment
- **WHEN** the side panel is rendered
- **THEN** all elements SHALL stack vertically.
- **AND** padding SHALL be adjusted to account for the narrow width of a typical side panel.
