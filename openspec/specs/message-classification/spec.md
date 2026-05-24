## Purpose
Uniquely identify conversations and classify message types to enable structured storage and advanced filtering.

## Requirements

### Requirement: Unique Conversation Identity Extraction
The system SHALL extract a unique identifier for each conversation from the Teams interface to enable cross-session data consistency.

#### Scenario: ID extraction
- **WHEN** an extraction begins
- **THEN** the system SHALL extract the unique conversation ID from the URL or the DOM.
- **AND** this ID SHALL be used as the primary key in the `conversations` object store.

### Requirement: Message Type Classification
The system SHALL classify each message based on its content and structure (e.g., user message, system message, card, etc.).

#### Scenario: Type detection
- **WHEN** a message is extracted from the DOM
- **THEN** the system SHALL analyze its structure to determine its type.
- **AND** the detected type SHALL be stored alongside the message content in the database.
