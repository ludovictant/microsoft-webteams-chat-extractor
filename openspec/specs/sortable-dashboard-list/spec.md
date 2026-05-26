## ADDED Requirements

### Requirement: Interactive Sortable Headers
The history table in the side panel SHALL feature clickable headers for the "Conversation", "Qty", "Last crawl", and "Last Download" columns. Sorting SHALL be disabled while a historical export is in progress.

#### Scenario: Header visual state
- **WHEN** a sortable header is hovered
- **THEN** it SHALL provide visual feedback (e.g., cursor change, color shift) to indicate it is interactive.

#### Scenario: Sorting disabled during export
- **WHEN** a historical export is in progress
- **AND** the user clicks a sortable header
- **THEN** the system SHALL ignore the click.
- **AND** the headers SHALL display a "not-allowed" cursor and reduced opacity.

### Requirement: Multi-Directional Sorting
The system SHALL support sorting each of the target columns in both ascending and descending order.

#### Scenario: Toggle sort direction
- **WHEN** a header is clicked
- **THEN** the system SHALL toggle the sort direction for that column.
- **AND** the table rows SHALL be re-ordered immediately.

### Requirement: Sort Indicators
The system SHALL display a visual indicator (e.g., arrow icon) next to the currently active sort column to show the sort direction.

#### Scenario: Active sort indicator
- **WHEN** the table is sorted by "Qty" in descending order
- **THEN** a descending arrow SHALL be visible in the "Qty" header.

### Requirement: Column-Specific Sorting Logic
The system SHALL employ appropriate sorting logic for different data types:
- **Conversation**: Alphabetical (A-Z, Z-A).
- **Qty**: Numerical (High-Low, Low-High).
- **Last crawl**: Chronological (Newest-Oldest, Oldest-Newest).
- **Last Download**: Chronological (Newest-Oldest, Oldest-Newest).

#### Scenario: Chronological sort
- **WHEN** sorting by "Last crawl" descending
- **THEN** the conversation with the most recent `lastCrawlTimestamp` SHALL appear at the top.

#### Scenario: Chronological sort by download
- **WHEN** sorting by "Last Download" descending
- **THEN** the conversation with the most recent `lastDownloadTimestamp` SHALL appear at the top.
- **AND** records with null values SHALL appear at the bottom.
