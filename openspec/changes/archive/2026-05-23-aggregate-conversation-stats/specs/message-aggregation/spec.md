## ADDED Requirements

### Requirement: Real-time Message Statistics Aggregation
The system SHALL provide a mechanism to calculate the total message count, oldest message timestamp, and newest message timestamp for a specific conversation in real-time.

#### Scenario: Aggregate statistics for a conversation
- **WHEN** a request for conversation statistics is made with a `teamsId`
- **THEN** the system SHALL return the count of all associated messages.
- **AND** it SHALL return the minimum and maximum timestamps among those messages.

### Requirement: High-Performance Database Indexing
The message storage system SHALL maintain a compound index on conversation identity and message timestamp to ensure aggregation operations are performant.

#### Scenario: Efficient range querying
- **WHEN** searching for the oldest or newest message in a conversation
- **THEN** the database SHALL use the `[conversationId, timestamp]` index to avoid a full table scan.
