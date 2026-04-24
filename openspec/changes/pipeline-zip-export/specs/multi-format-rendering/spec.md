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
