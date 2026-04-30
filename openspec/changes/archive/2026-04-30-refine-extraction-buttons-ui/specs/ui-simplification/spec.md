## MODIFIED Requirements

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
