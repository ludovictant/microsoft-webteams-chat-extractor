## ADDED Requirements

### Requirement: Reaction Data Extraction
The content script SHALL identify and extract reaction summaries associated with each message node. This includes the emoji type and the count for each reaction.

#### Scenario: Extract reactions from message
- **WHEN** a message has reactions (e.g., 👍, ❤️)
- **THEN** the system SHALL extract an array of reaction objects, each containing the emoji and the total count.

### Requirement: HTML Reaction Rendering
The exported HTML SHALL display extracted reactions below the message body in a visually distinct "pill" format, similar to the Teams interface.

#### Scenario: Display reactions in HTML
- **WHEN** a message in the export has reactions
- **THEN** a container SHALL appear below the message content showing each reaction emoji followed by its count.

### Requirement: Markdown Reaction Summary
The Markdown export SHALL include a parenthesized summary of reactions at the end of each message.

#### Scenario: Include reactions in Markdown
- **WHEN** a message is converted to Markdown
- **THEN** if it has reactions, a string like `(Reactions: 👍 3, ❤️ 1)` SHALL be appended to the message content.

### Requirement: CSV Reaction Column
The CSV export SHALL include a new column "Reactions" containing a comma-separated list of reaction summaries.

#### Scenario: Include reactions in CSV
- **WHEN** the chat data is exported to CSV
- **THEN** a "Reactions" column SHALL contain formatted text like "👍: 3, ❤️: 1".
