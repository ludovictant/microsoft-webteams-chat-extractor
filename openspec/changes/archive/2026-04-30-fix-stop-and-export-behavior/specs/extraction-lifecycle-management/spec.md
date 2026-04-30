## MODIFIED Requirements

### Requirement: Force Stop and Export during Processing or Stall
The system SHALL allow users to manually terminate any active extraction or processing phase and immediately trigger the export of all collected data and already-processed assets.

#### Scenario: Force stop during processing
- **WHEN** the extension is in the `processing` state
- **THEN** the "Stop Extraction" button SHALL display the label "Stop and Export".
- **WHEN** the user clicks the "Stop and Export" button
- **THEN** the system SHALL immediately transition to the `ready` state.

#### Scenario: Stop and export during extraction
- **WHEN** the extension is in the `extracting` or `stuck` states
- **THEN** the stop button SHALL display the label "Stop and Export".
- **WHEN** the user clicks the "Stop and Export" button
- **THEN** the system SHALL signal the content script to stop.
- **AND** the system SHALL transition to the completion flow (`processing` or `ready`) to allow the user to download the archive.
