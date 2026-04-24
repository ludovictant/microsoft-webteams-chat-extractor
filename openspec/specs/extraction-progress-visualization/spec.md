## ADDED Requirements

### Requirement: Oldest Timestamp Reporting
The content script SHALL calculate and send the Unix timestamp of the oldest message collected so far in every `progress` message sent to the extension popup.

#### Scenario: Progress message contains timestamp
- **WHEN** the `scrollAndExtract` loop completes a collection cycle
- **THEN** it SHALL include `oldestTS` in the data sent to `chrome.runtime.sendMessage`

### Requirement: Date Depth Visualization
The popup SHALL display the date of the oldest message collected so far in a human-readable format.

#### Scenario: Display date depth
- **WHEN** a `progress` message with an `oldestTS` is received
- **THEN** the `#dateDepth` element SHALL be updated to show the formatted date (e.g., "Scanning back to: Oct 12, 2023")

### Requirement: Progress Bar for Time-Limited Extraction
For extraction requests with a specific time range (e.g., 7 days), the popup SHALL display a progress bar representing the percentage of the time range covered. During the subsequent image processing phase, the bar SHALL switch to representing the percentage of images converted.

#### Scenario: Progress bar behavior transition
- **WHEN** the scrolling phase is active
- **THEN** the bar reflects temporal depth.
- **WHEN** the processing phase starts
- **THEN** the bar reflects image conversion progress (0-100%).

### Requirement: Indeterminate Progress for Full History
For "All history" extraction requests, the progress bar SHALL operate in an indeterminate (scrolling/pulsing) mode since the final depth is unknown.

#### Scenario: Indeterminate bar for all history
- **WHEN** the user starts an "All history" extraction
- **THEN** the progress bar SHALL show a continuous animation instead of a fixed percentage
