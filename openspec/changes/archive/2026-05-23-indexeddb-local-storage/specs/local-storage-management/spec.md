## ADDED Requirements

### Requirement: IndexedDB Database Implementation
The extension SHALL maintain a local database named `TeamsExtractorDB` with the following object stores:
- `conversations`: Primary Key `teamsId`.
- `messages`: Primary Key `id`, with index on `conversationId` and `timestamp`.
- `assets`: Primary Key `url`.

#### Scenario: Database initialization
- **WHEN** the background script starts
- **THEN** it SHALL initialize or open the `TeamsExtractorDB`.
- **AND** it SHALL ensure all required object stores exist.

### Requirement: Real-time Message Persistence
If Local Storage is enabled, the background script SHALL persist incoming message chunks to IndexedDB immediately upon receipt.

#### Scenario: Saving a message chunk
- **WHEN** a `CHUNK_READY` message is received
- **AND** Local Storage is enabled
- **THEN** the background script SHALL upsert the conversation metadata.
- **AND** it SHALL save each message to the `messages` store, classification it as 'true' or 'meta'.

### Requirement: Real-time Asset Persistence
If Local Storage is enabled, the background script SHALL save asset blobs to IndexedDB as they are successfully fetched.

#### Scenario: Saving an asset
- **WHEN** an `ASSET_READY` message is received
- **AND** Local Storage is enabled
- **THEN** the background script SHALL save the asset blob and its metadata to the `assets` store.
