# stall-retry-visualization Specification

## Purpose
TBD - created by archiving change show-stalled-retry-status. Update Purpose after archive.
## Requirements
### Requirement: Stall Retry Visibility
The system SHALL provide the user with visible feedback when the extraction process is waiting for new content to load from Teams. This feedback MUST include the current retry attempt number and the total number of attempts allowed before a critical stall is declared.

#### Scenario: Display retry progress in side panel
- **WHEN** the extraction process detects that no new content has been loaded
- **AND** the retry count is between 1 and 14
- **THEN** the side panel SHALL display a message: "It seems we are at the oldest message. Retrying in [X]ms ([Y]/15 attempt)..." where [X] is the current wait interval and [Y] is the current retry number.

### Requirement: Wait Interval Reporting
The content script SHALL include the current `waitTime` (in milliseconds) and the `noChangeCount` (current retry number) in every `progress` update sent while the extraction is in a waiting state.

#### Scenario: Progress update contains stall metadata
- **WHEN** the extraction loop enters a waiting phase due to no new content
- **THEN** the `PROGRESS` message sent to the background script SHALL include `waitTime` and `noChangeCount` fields.

