## ADDED Requirements

### Requirement: Extraction Process Disclaimer
The popup SHALL display a persistent disclaimer while an extraction is active to provide critical operational guidance to the user.

#### Scenario: Display disclaimer during extraction
- **WHEN** the extraction status is `extracting`, `stuck`, or `processing`
- **THEN** a disclaimer SHALL be visible with the following points:
  1. Do not change the conversation in the Teams window.
  2. If the process repeats the oldest message, use the Stop and Export button.
