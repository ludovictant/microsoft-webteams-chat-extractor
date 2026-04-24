## MODIFIED Requirements

### Requirement: Batched Transmission
The content script SHALL send extracted messages to the Service Worker in batches of 10 to minimize message-passing overhead and local memory usage. Before starting the collection, the system SHALL ensure the view is scrolled to the end to ensure the batching starts with the most recent messages.

#### Scenario: Send message batch starting from end
- **WHEN** extraction starts
- **THEN** system SHALL scroll to bottom
- **AND WHEN** 10 new messages have been collected
- **THEN** the system SHALL send a `CHUNK_READY` message to the Service Worker and clear the local message buffer.
