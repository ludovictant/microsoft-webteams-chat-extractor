## MODIFIED Requirements

### Requirement: HTML Rendering
The system SHALL generate an `index.html` file that references local assets and preserves the Teams visual style. The rendering engine SHALL accept a conversation data object as input, making it independent of the active extraction session state.

#### Scenario: Render rich HTML from data object
- **WHEN** the ZIP is being generated
- **THEN** an `index.html` SHALL be created with relative links to `images/...` using the provided message and asset data.

### Requirement: Markdown Conversion
The system SHALL generate a `transcript.md` file with appropriate Markdown syntax for structure and images. The conversion engine SHALL accept a conversation data object as input.

#### Scenario: Render Markdown from data object
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.md` SHALL be created containing the chat data in Markdown format using the provided data object.

### Requirement: CSV Export
The system SHALL generate a `transcript.csv` file containing raw chat data for spreadsheet processing. The export engine SHALL accept a conversation data object as input.

#### Scenario: Render CSV from data object
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.csv` SHALL be created with columns for Timestamp, Author, and Content using the provided data object.

### Requirement: JSON Export Support
The system SHALL generate a `transcript.json` file containing the full structured data of the extraction. The JSON generator SHALL accept a conversation data object as input.

#### Scenario: Render JSON from data object
- **WHEN** the ZIP is being generated
- **THEN** a `transcript.json` SHALL be created containing the chat title, metadata, and an array of message objects using the provided data object.

### Requirement: Ready-to-Use Image References in JSON
The JSON export SHALL replace image placeholders in the message content with the local filenames used in the ZIP archive.

#### Scenario: Resolve image paths in JSON
- **WHEN** a message in the JSON export contains an image placeholder (e.g., `##img_...##`)
- **THEN** the placeholder SHALL be replaced with the relative path to the image file (e.g., `images/msg_...png`).
