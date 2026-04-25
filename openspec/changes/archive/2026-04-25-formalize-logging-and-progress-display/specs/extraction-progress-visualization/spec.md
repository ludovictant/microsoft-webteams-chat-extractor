## MODIFIED Requirements

### Requirement: Date Depth Visualization
The popup SHALL display the date of the oldest message collected so far in a human-readable format, including the full year.

#### Scenario: Display date depth with year
- **WHEN** a `progress` message with an `oldestTS` is received
- **THEN** the `#dateDepth` element SHALL be updated to show the formatted date including the year (e.g., "Reached: Oct 12, 2023, 14:30")

## ADDED Requirements

### Requirement: Persistent Backend Progress Logging
The background script SHALL persistently log the progress of the extraction to the console, specifically the timestamp of the oldest message parsed, regardless of whether Debug Mode is ON or OFF.

#### Scenario: Log oldest message timestamp
- **WHEN** extraction progress is updated
- **THEN** the background script SHALL emit a log entry in the format `[PROGRESS] Oldest message parsed: YYYYmmDD.HHMMSS`.
