## MODIFIED Requirements

### Requirement: Date Depth Visualization
The side panel SHALL display the date of the oldest message collected so far in a human-readable format, including the full year.

#### Scenario: Display date depth with year
- **WHEN** a `progress` message with an `oldestTS` is received
- **THEN** the `#dateDepth` element SHALL be updated to show the formatted date including the year (e.g., "Reached: Oct 12, 2023, 14:30")

### Requirement: Progress Bar for Time-Limited Extraction
For extraction requests with a specific time range (e.g., 7 days), the side panel SHALL display a progress bar representing the percentage of the time range covered. During the subsequent image processing phase, the bar SHALL switch to representing the percentage of images converted.

#### Scenario: Progress bar behavior transition
- **WHEN** the scrolling phase is active
- **THEN** the bar reflects temporal depth.
- **WHEN** the processing phase starts
- **THEN** the bar reflects image conversion progress (0-100%).
