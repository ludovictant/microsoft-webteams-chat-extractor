## MODIFIED Requirements

### Requirement: Dashboard Export Trigger
The side panel SHALL display a dedicated "Export" button for each conversation listed in the local storage history table. The entire side panel UI SHALL be locked (disabled) during the ZIP generation and download process to prevent concurrent operations.

#### Scenario: Export from history list
- **WHEN** the user clicks the "Export" button for a specific conversation in the history list
- **THEN** the system SHALL initiate a ZIP export.
- **AND** the system SHALL disable all extraction triggers, footer actions, settings toggles, and table sorting until the process completes.
- **AND** the system SHALL provide visual feedback (e.g., micro-spinner on the button, reduced opacity on other elements).

### Requirement: Interactive Sortable Headers
The history table in the side panel SHALL feature clickable headers for the "Conversation", "Qty", "Last crawl", and "Last Download" columns. Sorting SHALL be disabled while a historical export is in progress.

#### Scenario: Sorting disabled during export
- **WHEN** a historical export is in progress
- **AND** the user clicks a sortable header
- **THEN** the system SHALL ignore the click.
- **AND** the headers SHALL display a "not-allowed" cursor and reduced opacity.
