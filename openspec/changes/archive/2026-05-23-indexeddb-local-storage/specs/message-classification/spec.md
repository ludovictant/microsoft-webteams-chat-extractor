## ADDED Requirements

### Requirement: Unique Conversation Identity Extraction
The content script SHALL extract a stable, unique identifier for the current conversation thread to be used as a database key.

#### Scenario: ID extraction from header
- **WHEN** an element with an ID starting with `chat-header-` exists in the DOM
- **THEN** the content script SHALL extract the ID string following the prefix (e.g., `19:meeting_...@thread.v2`).

#### Scenario: ID extraction from URL fallback
- **WHEN** no header ID is found
- **AND** the URL contains `/chat/[id]`
- **THEN** the content script SHALL extract that ID from the URL.

### Requirement: Message Type Classification
The content script SHALL classify each extracted message as either a 'true' user message or a 'meta' system message.

#### Scenario: System message classification
- **WHEN** a message is identified as a membership change, meeting status, or other system event
- **THEN** it SHALL be tagged with `type: "meta"` in the MDO.
- **OTHERWISE** it SHALL be tagged with `type: "true"`.
