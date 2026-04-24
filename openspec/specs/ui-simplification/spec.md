## ADDED Requirements

### Requirement: Chronological Sorting Only
The system SHALL exclusively produce message exports in chronological order (Oldest First), ensuring the most recent message is at the end of the document.

#### Scenario: Chronological export
- **WHEN** an extraction is completed
- **THEN** the messages in the resulting ZIP archive SHALL be sorted from oldest to newest.

### Requirement: Unified Extraction Interface
The system SHALL remove the sort order selection from the user interface to provide a simpler and more consistent experience.

#### Scenario: Simplified popup UI
- **WHEN** the extension popup is opened
- **THEN** the user SHALL only see the time range selection options, without any sort order toggles.
