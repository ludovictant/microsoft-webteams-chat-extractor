## ADDED Requirements

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
