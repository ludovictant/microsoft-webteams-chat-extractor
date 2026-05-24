## Purpose
Manage local data persistence using IndexedDB to store conversations, messages, and assets for offline access and incremental updates.

## Requirements

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

### Requirement: Real-time Message Persistence
The system SHALL persist messages to the local database in real-time as they are extracted from the Teams interface.

#### Scenario: Message saving
- **WHEN** a message is successfully extracted from the DOM
- **THEN** it SHALL be immediately stored or updated in the `messages` object store.
- **AND** it SHALL be associated with its corresponding conversation ID.

### Requirement: Real-time Asset Persistence
The system SHALL persist downloaded assets (images, etc.) to the local database to ensure they are available for future exports without re-downloading.

#### Scenario: Asset saving
- **WHEN** an asset is downloaded and processed
- **THEN** the binary data (Blob/ArrayBuffer) SHALL be stored in the `assets` object store.
- **AND** it SHALL be indexed by its source URL or unique identifier.

### Requirement: Asset Availability Reporting
The background script SHALL expose a method to determine if a specific asset URL is already present in the `assets` object store.

#### Scenario: Check asset existence
- **WHEN** the `isAssetStored(url)` method is called
- **THEN** it SHALL return `true` if the URL exists in the `assets` store, and `false` otherwise.

### Requirement: Automated Asset Session Injection
When an asset is identified as already stored during an extraction session, the background script SHALL automatically load its content into the transient session cache.

#### Scenario: Inject stored asset into session
- **WHEN** an asset URL is processed by the background script
- **AND** it is found in the IndexedDB `assets` store
- **THEN** its content SHALL be added to the `urlToBlob` map for the current extraction.
- **AND** the `processedAssets` and `totalAssets` counters SHALL be incremented accordingly.
