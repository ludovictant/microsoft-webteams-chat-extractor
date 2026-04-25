## MODIFIED Requirements

### Requirement: Aggressive DOM Cleaning
The system SHALL perform more aggressive cleaning of Teams-specific UI artifacts during serialization to ensure a clean and lightweight export.

#### Scenario: Clean UI artifacts
- **WHEN** a message is serialized
- **THEN** redundant UI elements like canvas markers and their wrappers SHALL be purged.

## ADDED Requirements

### Requirement: Conditional Debug Attribute Filtering
The extraction pipeline SHALL conditionally preserve or remove attributes starting with `debug-` based on the current Debug Mode state.

#### Scenario: Preserve debug attributes
- **WHEN** Debug Mode is ON during extraction
- **THEN** attributes starting with `debug-` SHALL be kept in the final HTML nodes.

#### Scenario: Remove debug attributes
- **WHEN** Debug Mode is OFF during extraction
- **THEN** attributes starting with `debug-` SHALL be stripped from the final HTML nodes.

### Requirement: System Message Extraction
The system SHALL identify and extract system/control messages (e.g., membership updates, call notifications) that are not authored by a specific user but appear in the chat stream.

#### Scenario: Extract system message
- **WHEN** a `fui-ChatControlMessageItem` is encountered in the chat list
- **THEN** the system SHALL extract the text content and mark the message type as `system`.
