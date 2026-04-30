## MODIFIED Requirements

### Requirement: Temporal Filename Suffix
The system SHALL append a temporal suffix to the generated ZIP archive filename representing the range of messages extracted.

#### Scenario: Generate filename with date range
- **WHEN** an extraction is completed
- **THEN** the system SHALL identify the oldest and newest message timestamps in the set.
- **AND** it SHALL append `_[startDatetime]_[endDateTime]` to the sanitized chat title.

## ADDED Requirements

### Requirement: Robust Chat Title Extraction
The system SHALL attempt to extract the chat title using multiple strategies in order of preference to ensure a meaningful filename is generated.

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
