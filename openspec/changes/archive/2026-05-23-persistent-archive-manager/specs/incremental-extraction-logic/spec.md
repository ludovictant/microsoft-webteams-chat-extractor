## ADDED Requirements

### Requirement: Incremental Stop Condition
The crawler SHALL stop scrolling back when it encounters a message that is already present in the local database and has not been modified.

#### Scenario: Stopping at parity
- **WHEN** the content script parses a message with an ID already present in the database
- **AND** the message timestamp matches the database record
- **THEN** it SHALL cease the "crawl-up" logic and signal completion.

### Requirement: Message Content and Reaction Sync
The system SHALL update existing database records (UPSERT) if new reactions or content changes are detected during the crawl.

#### Scenario: Updating reactions
- **WHEN** an existing message ID is encountered with a different reaction count
- **THEN** the system SHALL update the `reactions` field in the database while retaining the original message record.
