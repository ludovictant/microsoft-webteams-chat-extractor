## MODIFIED Requirements

### Requirement: Stopping and Exporting during Extraction or Stall
The system SHALL allow users to manually terminate any active extraction or processing phase and immediately trigger the export of all collected data and already-processed assets. It SHALL also support a dedicated "Download recent messages" trigger for incremental sessions.

#### Scenario: Incremental extraction start
- **WHEN** the user clicks the "Download recent messages" button
- **THEN** the system SHALL initiate an extraction session with the special "incremental" time-range signal (e.g., `days: -1`).
- **AND** the content script SHALL terminate the extraction loop as soon as a message already present in the local database is encountered.

#### Scenario: Force stop during processing
- **WHEN** the extension is in the `processing` state
- **THEN** the "Stop Extraction" button SHALL display the label "Stop current extraction".
- **WHEN** the user clicks the "Stop current extraction" button
- **THEN** the system SHALL immediately transition to the `ready` state.

#### Scenario: Stop and export during extraction
- **WHEN** the extension is in the `extracting` or `stuck` states
- **THEN** the stop button SHALL display the label "Stop current extraction".
- **WHEN** the user clicks the "Stop current extraction" button
- **THEN** the system SHALL signal the content script to stop.
- **AND** the system SHALL transition to the completion flow (`processing` or `ready`) to allow the user to download the archive.
