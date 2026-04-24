## ADDED Requirements

### Requirement: Manual Reset to Options
The system SHALL provide a mechanism for the user to return to the initial time-range selection screen after an extraction has finished or was stopped.

#### Scenario: Reset from final screen
- **WHEN** the user clicks the "Start New Extraction" button on the final screen
- **THEN** the popup SHALL return to the initial options panel.

### Requirement: Full State Purge
The background script SHALL completely purge all stored message data, assets, and mapping tables when a new extraction starts or a reset is triggered.

#### Scenario: Purge data on new extraction
- **WHEN** a `START_EXTRACTION` message is received
- **THEN** the background script SHALL clear all internal maps and arrays before initializing the new session.
