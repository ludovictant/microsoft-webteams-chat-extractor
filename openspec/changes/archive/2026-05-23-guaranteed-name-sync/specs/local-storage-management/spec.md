## MODIFIED Requirements

### Requirement: Real-time Message Persistence
The system SHALL persist messages and conversation metadata to the local database in real-time. Conversation metadata, specifically the title, SHALL be updated at the very start of an extraction session to ensure synchronization even if zero new messages are collected.

#### Scenario: Immediate metadata synchronization
- **WHEN** a `START_EXTRACTION` message is received
- **AND** Local Storage is enabled
- **THEN** the system SHALL immediately update the `conversations` object store with the latest `teamsId` and `name`.

#### Scenario: Message saving
- **WHEN** a message is successfully extracted from the DOM
- **THEN** it SHALL be immediately stored or updated in the `messages` object store.
- **AND** it SHALL be associated with its corresponding conversation ID.
