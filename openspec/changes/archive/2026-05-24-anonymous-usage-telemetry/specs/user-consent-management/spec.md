## ADDED Requirements

### Requirement: Success Nudge Banner
The side panel SHALL display a one-time invitation banner (Nudge) immediately after the first successful ZIP download of the extension's lifecycle.

#### Scenario: Display nudge after first download
- **WHEN** a successful ZIP download is recorded
- **AND** the user has not previously interacted with the nudge
- **THEN** a banner SHALL appear asking for permission to share anonymous usage stats.

### Requirement: Global Privacy Toggle
The side panel SHALL include a persistent toggle in a "Privacy & Stats" section to allow users to enable or disable telemetry sharing at any time.

#### Scenario: Enable sharing from settings
- **WHEN** the user switches the telemetry toggle to ON
- **THEN** the consent state SHALL be persisted in `chrome.storage.local`.
- **AND** a data synchronization event SHALL be triggered.

### Requirement: Data Minimization and Anonymity
The system SHALL NOT transmit any identifiable information (usernames, message text, actual Teams IDs). All IDs SHALL be hashed using SHA-256 before being stored or transmitted.

#### Scenario: Anonymize conversation ID
- **WHEN** an event is recorded
- **THEN** the `teamsId` SHALL be combined with the `instanceId` and hashed to produce the `conv_id_hash`.
