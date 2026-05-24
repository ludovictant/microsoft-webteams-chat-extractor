## MODIFIED Requirements

### Requirement: IndexedDB Database Implementation
The extension SHALL maintain a local database named `TeamsExtractorDB` with the following object stores:
- `conversations`: Primary Key `teamsId`.
- `messages`: Primary Key `id`, with index on `conversationId`, `timestamp`, and a compound index `[conversationId, timestamp]`.
- `assets`: Primary Key `url`.

#### Scenario: Database initialization
- **WHEN** the background script starts
- **THEN** it SHALL initialize or open the `TeamsExtractorDB`.
- **AND** it SHALL ensure all required object stores exist.
- **AND** it SHALL ensure the compound index `conv_ts_index` exists on the `messages` store.
