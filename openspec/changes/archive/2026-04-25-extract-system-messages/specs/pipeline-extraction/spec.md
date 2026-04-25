## ADDED Requirements

### Requirement: System Message Extraction
The system SHALL identify and extract system/control messages (e.g., membership updates, call notifications) that are not authored by a specific user but appear in the chat stream.

#### Scenario: Extract system message
- **WHEN** a `fui-ChatControlMessageItem` is encountered in the chat list
- **THEN** the system SHALL extract the text content and mark the message type as `system`.
