## ADDED Requirements

### Requirement: Chronological Sorting Only
The system SHALL exclusively produce message exports in chronological order (Oldest First), ensuring the most recent message is at the end of the document.

#### Scenario: Chronological export
- **WHEN** an extraction is completed
- **THEN** the messages in the resulting ZIP archive SHALL be sorted from oldest to newest.

### Requirement: Unified Extraction Interface
The system SHALL remove the sort order selection from the user interface to provide a simpler and more consistent experience. Additionally, it SHALL remove the "Currently loaded messages" and "Last 24 hours" options from the time range selection.

#### Scenario: Removed short time ranges
- **WHEN** the extension popup is opened
- **THEN** the user SHALL NOT see "Currently loaded messages" or "Last 24 hours" in the time range options.

### Requirement: Extraction Process Disclaimer
The popup SHALL display a persistent disclaimer while an extraction is active to provide critical operational guidance to the user.

#### Scenario: Display disclaimer during extraction
- **WHEN** the extraction status is `extracting`, `stuck`, or `processing`
- **THEN** a disclaimer SHALL be visible with the following points:
  1. Do not change the conversation in the Teams window.
  2. If the process repeats the oldest message, use the Stop and Export button.

### Requirement: Consistent Action Button Labeling
The system SHALL use the consistent label "Stop and Export" for the primary control button during all active extraction phases to ensure user clarity.

#### Scenario: Consistent label in all states
- **WHEN** the extraction is in the `extracting`, `stuck`, or `processing` states
- **THEN** the stop button SHALL display the text "Stop and Export".

### Requirement: Standardized Primary Button Styling
The system SHALL ensure that all primary action buttons (including "Download", "Stop", and "Start New Extraction") share a consistent visual language to ensure they are easily identifiable as interactive elements.

#### Scenario: Reset button matches standard theme
- **WHEN** the "Start New Extraction" button is displayed
- **THEN** it SHALL have the same background color, border radius, and typography as other primary action buttons in the extension.

### Requirement: Standardized Status Nudge Formatting
The system SHALL use a consistent HTML structure and CSS styling for all temporary status alerts (e.g., stalled, resumed) to ensure visual coherence.

#### Scenario: Professional status alerts
- **WHEN** a status alert is displayed in the popup
- **THEN** it SHALL use standardized spacing, font-weight, and color coding (e.g., amber for stalls, green for success).

### Requirement: Completion Action Deactivation
The system SHALL deactivate the download button once a download has been successfully initiated to prevent redundant actions and clarify the completion state.

#### Scenario: Deactivate download button
- **WHEN** the user clicks the "Download Archive (ZIP)" button
- **AND** the download process is successfully initiated via the browser
- **THEN** the button SHALL be disabled.
- **AND** its text SHALL change to "Downloaded!".
