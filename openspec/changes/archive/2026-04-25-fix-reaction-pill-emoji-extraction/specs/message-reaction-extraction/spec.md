## MODIFIED Requirements

### Requirement: Reaction Data Extraction
The content script SHALL identify and extract reaction summaries associated with each message node. This includes the emoji type (extracted from image alt text or Unicode characters) and the precise numeric count for each reaction, while ignoring auxiliary descriptive text.

#### Scenario: Extract reactions from message
- **WHEN** a message has reactions (e.g., 👍, ❤️)
- **THEN** the system SHALL extract an array of reaction objects, each containing the emoji and the total count, ensuring that descriptive text like "3 réactions Rigole" is filtered to just the numeric count "3".

#### Scenario: Extract emoji from image-based pill
- **WHEN** a reaction pill contains an image representing the emoji
- **THEN** the system SHALL use the `alt` attribute of the image as the emoji representation.
