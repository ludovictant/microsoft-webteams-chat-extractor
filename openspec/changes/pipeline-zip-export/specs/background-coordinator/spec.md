## ADDED Requirements

### Requirement: Centralized Message Storage
The Service Worker SHALL act as the central repository for all message data during an extraction session.

#### Scenario: Aggregate message batches
- **WHEN** a `CHUNK_READY` message is received from the content script
- **THEN** the Service Worker SHALL append the batch to its internal message list.

### Requirement: Background Asset Fetching
The Service Worker SHALL fetch all images and avatars in the background using binary data types (Blob or ArrayBuffer).

#### Scenario: Fetch image binary
- **WHEN** a new image URL is identified in a message batch
- **THEN** the system SHALL fetch the image and store it as a binary asset for inclusion in the ZIP.
