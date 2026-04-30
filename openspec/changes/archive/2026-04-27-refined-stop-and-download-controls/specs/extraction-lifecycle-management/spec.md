## ADDED Requirements

### Requirement: Immediate Extraction Abort
The system SHALL provide an "Abort Extraction" action that immediately terminates the extraction loop and resets the extension state to `idle` without triggering an export or finalization.

#### Scenario: Abort during extraction
- **WHEN** the extraction status is `extracting` or `stuck`
- **AND** the user clicks the "Abort Extraction" button
- **THEN** the background script SHALL signal the content script to stop.
- **AND** the background script SHALL reset the extraction state to `idle`.
- **AND** the popup SHALL return to the initial options panel.
