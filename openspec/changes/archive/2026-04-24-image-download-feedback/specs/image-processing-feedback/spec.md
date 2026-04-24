## ADDED Requirements

### Requirement: Workload Quantification
The content script SHALL quantify the total number of items (avatars and body images) to be processed before starting the conversion phase.

#### Scenario: Count processing workload
- **WHEN** the extraction loop finishes and `buildTranscript` is called
- **THEN** the system SHALL iterate through the collected nodes to determine the count of unique author avatars and total body images requiring Base64 conversion.

### Requirement: Real-time Processing Feedback
The system SHALL provide real-time updates to the extension popup as images are converted.

#### Scenario: Update processing progress
- **WHEN** an image or avatar has been successfully converted or failed
- **THEN** the system SHALL send a `processing` message to the popup containing the current item index and the total workload count.

### Requirement: Processing Mode UI Transition
The extension popup SHALL transition to a "Processing" mode when the collection phase ends.

#### Scenario: Enter processing UI
- **WHEN** a `processing` message is received
- **THEN** the popup SHALL update the status text to "Processing images..." and ensure the progress bar is in deterministic (percentage) mode.
