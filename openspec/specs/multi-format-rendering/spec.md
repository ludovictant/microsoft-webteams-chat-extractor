## ADDED Requirements

### Requirement: HTML Rendering
The system SHALL generate an `index.html` file that references local assets and preserves the Teams visual style.

#### Scenario: Render rich HTML
- **WHEN** the ZIP is being generated
- **THEN** an `index.html` SHALL be created with relative links to `images/...`.

### Requirement: Markdown Conversion
The system SHALL generate a `transcript.md` file with appropriate Markdown syntax for structure and images.

#### Scenario: Render Markdown
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.md` SHALL be created containing the chat data in Markdown format.

### Requirement: CSV Export
The system SHALL generate a `transcript.csv` file containing raw chat data for spreadsheet processing.

#### Scenario: Render CSV
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.csv` SHALL be created with columns for Timestamp, Author, and Content.

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
