## MODIFIED Requirements

### Requirement: Robust Chat Title Extraction
The system SHALL attempt to extract the chat title using multiple strategies in order of preference to ensure a meaningful filename is generated. The extracted title SHALL be sanitized to remove only characters that are illegal or problematic for file systems, while preserving accentuated characters (e.g., é, à, ö), dots, and dashes. Spaces SHALL be replaced with underscores.

#### Scenario: Preserve accents in filename
- **WHEN** a chat title contains accentuated characters (e.g., "Préparation")
- **THEN** the sanitized filename SHALL retain those characters (e.g., "Préparation...").

#### Scenario: Replace spaces with underscores
- **WHEN** a chat title contains spaces (e.g., "Chat Title")
- **THEN** the sanitized filename SHALL replace them with underscores (e.g., "Chat_Title...").

#### Scenario: Strip illegal characters
- **WHEN** a chat title contains illegal characters (e.g., `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`)
- **THEN** those specific characters SHALL be replaced with underscores.
