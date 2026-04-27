## ADDED Requirements

### Requirement: Consistent Action Button Labeling
The system SHALL use the consistent label "Stop and Export" for the primary control button during all active extraction phases to ensure user clarity.

#### Scenario: Consistent label in all states
- **WHEN** the extraction is in the `extracting`, `stuck`, or `processing` states
- **THEN** the stop button SHALL display the text "Stop and Export".
