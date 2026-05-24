## MODIFIED Requirements

### Requirement: Unified Extraction Interface
The system SHALL provide a simplified extraction interface, including a toggle for enabling local database storage and a dashboard showing local history with real-time statistics.

#### Scenario: Real-time history dashboard
- **WHEN** the "Local storage" section is expanded
- **THEN** the system SHALL fetch conversation metadata from the `conversations` store.
- **AND** for each conversation, it SHALL perform an aggregate query on the `messages` store to display the current message count and date range.
