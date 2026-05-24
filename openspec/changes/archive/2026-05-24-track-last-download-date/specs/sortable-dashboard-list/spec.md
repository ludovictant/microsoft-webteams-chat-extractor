## MODIFIED Requirements

### Requirement: Interactive Sortable Headers
The history table in the side panel SHALL feature clickable headers for the "Conversation", "Qty", "Last crawl", and "Last Download" columns.

#### Scenario: Header visual state
- **WHEN** a sortable header is hovered
- **THEN** it SHALL provide visual feedback (e.g., cursor change, color shift) to indicate it is interactive.

### Requirement: Column-Specific Sorting Logic
The system SHALL employ appropriate sorting logic for different data types:
- **Conversation**: Alphabetical (A-Z, Z-A).
- **Qty**: Numerical (High-Low, Low-High).
- **Last crawl**: Chronological (Newest-Oldest, Oldest-Newest).
- **Last Download**: Chronological (Newest-Oldest, Oldest-Newest).

#### Scenario: Chronological sort by download
- **WHEN** sorting by "Last Download" descending
- **THEN** the conversation with the most recent `lastDownloadTimestamp` SHALL appear at the top.
- **AND** records with null values SHALL appear at the bottom.
