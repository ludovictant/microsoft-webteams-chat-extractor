## ADDED Requirements

### Requirement: Extraction Concurrency Prevention
The system SHALL prevent the initiation of multiple simultaneous extraction processes to ensure data integrity and system stability.

#### Scenario: Block concurrent start in popup
- **WHEN** an extraction is already active or in the process of starting
- **AND** the user attempts to trigger another extraction (e.g., via double-click)
- **THEN** the system SHALL ignore the subsequent request.
- **AND** it SHALL log a message to the console: "[CONCURRENCY] Extraction already in progress. Ignoring concurrent request."

#### Scenario: Visual feedback during start
- **WHEN** a valid extraction request is initiated from the popup
- **THEN** all extraction trigger buttons SHALL be immediately disabled until the system transitions into an active extraction state.
