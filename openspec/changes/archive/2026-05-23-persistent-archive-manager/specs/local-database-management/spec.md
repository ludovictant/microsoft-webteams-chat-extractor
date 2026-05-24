## ADD Requirements

### Requirement: IndexedDB Schema
The system SHALL implement a persistent IndexedDB database with three primary object stores: `Conversations`, `Messages`, and `Assets`.

#### Scenario: Database initialization
- **WHEN** the background script starts
- **THEN** it SHALL ensure the database is created with the required stores and indices (`conversationId` and `timestamp` on Messages).

### Requirement: Transactional Message Persistence
The system SHALL use transactions to batch save messages and assets to ensure data integrity.

#### Scenario: Saving a message batch
- **WHEN** a chunk of messages is received from the content script
- **THEN** the system SHALL open a single transaction to save all messages and their associated image blobs in the batch.
