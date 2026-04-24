## ADDED Requirements

### Requirement: DOM-to-JSON Mapping
The content script SHALL extract data from Teams message nodes into lightweight JSON objects instead of storing full DOM nodes.

#### Scenario: Extract message data
- **WHEN** a message node is scanned
- **THEN** the system SHALL extract author, timestamp, body HTML, and asset URLs into a plain JavaScript object.

### Requirement: Batched Transmission
The content script SHALL send extracted messages to the Service Worker in batches of 10 to minimize message-passing overhead and local memory usage.

#### Scenario: Send message batch
- **WHEN** 10 new messages have been collected
- **THEN** the system SHALL send a `CHUNK_READY` message to the Service Worker and clear the local message buffer.
