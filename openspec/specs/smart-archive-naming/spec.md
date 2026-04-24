## ADDED Requirements

### Requirement: Temporal Filename Suffix
The system SHALL append a temporal suffix to the generated ZIP archive filename representing the range of messages extracted.

#### Scenario: Generate filename with date range
- **WHEN** an extraction is completed
- **THEN** the system SHALL identify the oldest and newest message timestamps in the set.
- **AND** it SHALL append `_[startDatetime]_[endDateTime]` to the chat title.

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
