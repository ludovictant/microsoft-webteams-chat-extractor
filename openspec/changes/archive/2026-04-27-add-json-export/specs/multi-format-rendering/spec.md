## ADDED Requirements

### Requirement: JSON Export Support
The system SHALL generate a `transcript.json` file containing the full structured data of the extraction.

#### Scenario: Render JSON
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.json` SHALL be created containing the chat title, metadata, and an array of message objects.

### Requirement: Ready-to-Use Image References in JSON
The JSON export SHALL replace image placeholders in the message content with the local filenames used in the ZIP archive.

#### Scenario: Resolve image paths in JSON
- **WHEN** a message in the JSON export contains an image placeholder (e.g., `##img_...##`)
- **THEN** the placeholder SHALL be replaced with the relative path to the image file (e.g., `images/msg_...png`).
