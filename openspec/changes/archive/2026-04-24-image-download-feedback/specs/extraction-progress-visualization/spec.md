## MODIFIED Requirements

### Requirement: Progress Bar for Time-Limited Extraction
For extraction requests with a specific time range (e.g., 7 days), the popup SHALL display a progress bar representing the percentage of the time range covered. During the subsequent image processing phase, the bar SHALL switch to representing the percentage of images converted.

#### Scenario: Progress bar behavior transition
- **WHEN** the scrolling phase is active
- **THEN** the bar reflects temporal depth.
- **WHEN** the processing phase starts
- **THEN** the bar reflects image conversion progress (0-100%).
