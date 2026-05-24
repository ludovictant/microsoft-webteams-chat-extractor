## ADDED Requirements

### Requirement: Telemetry Data Persistence
The system SHALL record usage metadata for every extraction and download event into a local IndexedDB store named `telemetry`.

#### Scenario: Record extraction event
- **WHEN** an extraction phase completes (success, abort, or error)
- **THEN** a record SHALL be added to the local `telemetry` store with `event_type: "extraction"`.

#### Scenario: Record download event
- **WHEN** a ZIP generation is initiated
- **THEN** a record SHALL be added to the local `telemetry` store with `event_type: "download"`.

### Requirement: Telemetry Data Schema
The recorded telemetry data SHALL include: `timestamp`, `event_type` (extraction|download), `instance_id_hash`, `conv_id_hash`, `event_source` (live_session|history_list), `extraction_scope` (7_days|30_days|90_days|all|incremental), `message_count`, and `status`.

#### Scenario: Formatted extraction scope
- **WHEN** recording an extraction event with a 30-day range
- **THEN** the `extraction_scope` field SHALL be set to the string `"30_days"`.

### Requirement: Remote Data Transmission
The background script SHALL transmit all unsynced local telemetry records to a remote server ONLY when user consent is active.

#### Scenario: Sync on opt-in
- **WHEN** the user enables the telemetry toggle
- **THEN** all records in the `telemetry` store marked as unsynced SHALL be sent to the remote server.
- **AND** upon successful server response, they SHALL be marked as synced.
