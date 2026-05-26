## ADDED Requirements

### Requirement: Dashboard Export Trigger
The side panel SHALL display a dedicated "Export" button for each conversation listed in the local storage history table. The entire side panel UI SHALL be locked (disabled) during the ZIP generation and download process to prevent concurrent operations.

#### Scenario: Export from history list
- **WHEN** the user clicks the "Export" button for a specific conversation in the history list
- **THEN** the system SHALL initiate a ZIP export containing all messages and binary assets (images, avatars) stored for that conversation in the local database.
- **AND** the system SHALL disable all extraction triggers, footer actions, settings toggles, and table sorting until the process completes.
- **AND** the system SHALL provide visual feedback (e.g., micro-spinner on the button, reduced opacity on other elements).

### Requirement: Background Historical Data Retrieval
The background script SHALL provide a mechanism to fetch all messages and associated binary assets (images, avatars) for a given `teamsId` from the local database for the purpose of export.

#### Scenario: Fetch conversation for export
- **WHEN** a historical export is requested for a `teamsId`
- **THEN** the system SHALL query the `messages` store for all messages associated with that `teamsId`.
- **AND** it SHALL query the `assets` store for all binary blobs referenced by those messages (including author avatars).
- **AND** it SHALL pass this retrieved dataset to the ZIP generation pipeline.
