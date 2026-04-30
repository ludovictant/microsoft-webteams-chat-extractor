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

### Requirement: Interactive Stuck State Handling
The system SHALL detect when programmatic scrolling fails to load new messages and transition to a "stuck" state that requires user intervention.

#### Scenario: Transition to stuck state
- **WHEN** the extraction loop fails to detect new messages after a set number of attempts (e.g., 3 retries for UI alert, indefinite polling thereafter)
- **THEN** the system SHALL transition to the `stuck` state and notify the background script.

### Requirement: Manual Scroll Prompt
The popup SHALL display a clear instruction to the user when the extraction enters the `stuck` state, explaining that stalling often occurs when the top of the history is reached. It SHALL direct them to manually scroll if history remains, or use the "Stop and Export" button if finished.

#### Scenario: Display nuanced manual scroll prompt
- **WHEN** the extension status is `stuck`
- **THEN** the popup SHALL show a prominent message: "Stalled: The top of the chat may have been reached. If you think that some history remains, manually scroll up in Teams then click 'Resume Manually'. Otherwise, click 'Stop and Export' to finish."
- **AND** it SHALL display the "Resume Manually" and "Stop and Export" buttons.

### Requirement: Automatic Resumption from Stuck State
The system SHALL continuously poll for new messages while in the `stuck` state and automatically resume normal operation once content changes are detected.

#### Scenario: Resume after manual scroll
- **WHEN** the system is in the `stuck` state
- **AND** a change in the oldest message timestamp is detected (due to manual scrolling)
- **THEN** the system SHALL automatically revert to the `extracting` state and continue the process.
- **AND** it SHALL display a green success notification in the popup for 10 seconds.

### Requirement: Force Stop and Export during Processing or Stall
The system SHALL allow users to manually terminate the image processing phase or a stalled scrolling phase and immediately trigger the export of all collected data and already-processed assets.

#### Scenario: Force stop during processing
- **WHEN** the extension is in the `processing` state
- **THEN** the "Stop Extraction" button SHALL change its label to "Force Stop and Export".
- **WHEN** the user clicks the "Force Stop and Export" button
- **THEN** the system SHALL immediately transition to the `ready` state.

#### Scenario: Force stop during stall
- **WHEN** the extension is in the `stuck` state
- **THEN** the "Stop Extraction" button SHALL change its label to "Stop and Export".
- **WHEN** the user clicks the "Stop and Export" button
- **THEN** the system SHALL signal the content script to stop.
- **AND** the system SHALL immediately transition to the `ready` state.
