## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface by removing redundant labels and standardizing trigger options. Additionally, the operational disclaimer SHALL be positioned at the top of the interface for maximum visibility. The interface SHALL also include a merged block for local database storage and history, where the history dashboard visibility is tied to the toggle state. It SHALL include dedicated triggers for various time ranges and incremental extractions, each accompanied by descriptive tooltips.

#### Scenario: Simplified extraction triggers with tooltips
- **WHEN** the extension side panel is opened
- **THEN** the extraction buttons SHALL be labeled: "Download recent messages", "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- **AND** each button SHALL display a descriptive tooltip on mouse hover explaining the scope of the extraction.
- **AND** the "Time range" and "Settings" section labels SHALL NOT be displayed.
- **AND** the "Important" disclaimer SHALL be visible at the top of the layout.
- **AND** the header title SHALL be "MS Teams Chat Extractor".

#### Scenario: Incremental extraction trigger availability
- **WHEN** the "Local storage" toggle is "Off"
- **THEN** the "Download recent messages" button SHALL be disabled.
- **AND** it SHALL display an informative tooltip: "Extract only new messages since the last crawl. Enable 'Local storage' below to use this feature."
- **WHEN** the "Local storage" toggle is "On"
- **THEN** the "Download recent messages" button SHALL be enabled.
- **AND** it SHALL display a descriptive tooltip: "Fetch only new messages added since the last crawl."
