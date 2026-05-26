## ADDED Requirements

### Requirement: Temporal Filename Suffix
The system SHALL append a temporal suffix to the generated ZIP archive filename representing the range of messages extracted.

#### Scenario: Generate filename with date range
- **WHEN** an extraction is completed
- **THEN** the system SHALL identify the oldest and newest message timestamps in the set.
- **AND** it SHALL append `_[startDatetime]_[endDateTime]` to the sanitized chat title.

### Requirement: Robust Chat Title Extraction
The system SHALL attempt to extract the chat title using multiple strategies in order of preference and sanitize it to remove illegal characters while preserving accents, dots, and dashes, and replacing spaces with underscores to ensure a robust and compatible filename is generated.

#### Scenario: Extract title from active header
- **WHEN** an extraction starts
- **THEN** the system SHALL first attempt to find the title in the UI header using specific data attributes (`data-tid="active-chat-title"`, `data-tid="channelTitle-text"`, or `[data-tid="chat-list-item"] [data-tid="chat-title"]`).
- **AND** it SHALL only accept the result if it is non-empty.

#### Scenario: Fallback to cleaned document title
- **WHEN** the UI header selectors fail to provide a non-empty title
- **THEN** the system SHALL use the `document.title` as a fallback.
- **AND** it SHALL strip the following patterns from the title:
  1. Leading notification counts (e.g., `(1) `).
  2. The generic `"Conversation | "` prefix.
  3. The `" | Microsoft Teams"` suffix.
- **AND** it SHALL trim any resulting whitespace.

#### Scenario: Default title fallback
- **WHEN** all extraction strategies result in an empty string
- **THEN** the system SHALL use `teams-chat` as the default title.

#### Scenario: Preserve accents in filename
- **WHEN** a chat title contains accented characters (e.g., `é`, `à`, `ç`)
- **THEN** the system SHALL preserve these characters in the sanitized filename.

#### Scenario: Replace spaces with underscores
- **WHEN** a chat title contains spaces
- **THEN** the system SHALL replace each space with an underscore (`_`).

#### Scenario: Strip illegal characters
- **WHEN** a chat title contains characters that are generally illegal in filenames (e.g., `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`)
- **THEN** the system SHALL remove these characters.
- **AND** it SHALL preserve dots (`.`) and dashes (`-`).

### Requirement: Standardized Datetime Format
The system SHALL use the format `YYYYmmDD.HHMMSS` for timestamps within the ZIP filename.

#### Scenario: Format timestamp for filename
- **WHEN** a timestamp is formatted for the filename
- **THEN** it SHALL be rendered as a 15-character string (e.g., `20240424.153000`).

### Requirement: Epoch Fallback for Unknown Dates
The system SHALL use the Unix Epoch (`19700101.000000`) as a fallback for any message timestamp that cannot be reliably determined.

#### Scenario: Fallback to epoch
- **WHEN** a message timestamp is unknown or invalid during filename generation
- **THEN** the system SHALL use `19700101.000000` in that position of the filename.
