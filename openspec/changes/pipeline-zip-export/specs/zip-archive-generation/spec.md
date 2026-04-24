## ADDED Requirements

### Requirement: ZIP Container Structure
The system SHALL generate a single ZIP archive containing HTML, Markdown, and CSV files, along with an `images/` directory.

#### Scenario: Generate ZIP archive
- **WHEN** the user triggers the download
- **THEN** the system SHALL create a ZIP file using `JSZip` containing all generated documents and fetched assets.

### Requirement: Deterministic Asset Naming
The system SHALL name assets within the ZIP using a deterministic and sanitized naming convention.

#### Scenario: Name author avatar
- **WHEN** an avatar is added to the ZIP
- **THEN** it SHALL be named `images/avatar_[SanitizedAuthorName].png`.

#### Scenario: Name message image
- **WHEN** a body image is added to the ZIP
- **THEN** it SHALL be named `images/msg_[YYYYmmDD.HHMMSS]_[MessageId]_[Index].png`.
