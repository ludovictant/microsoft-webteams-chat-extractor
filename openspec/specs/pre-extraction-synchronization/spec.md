## ADDED Requirements

### Requirement: Initial Scroll to Bottom
The system SHALL ensure the chat view is scrolled to the absolute bottom before starting the message collection process.

#### Scenario: Scroll to end on start
- **WHEN** the extraction process is initiated
- **THEN** the system SHALL simulate a scroll to the bottom of the chat container.

### Requirement: Wait for Rendering
The system SHALL wait for a sufficient duration after the initial scroll to allow the Teams UI to render any newly loaded recent messages.

#### Scenario: Wait for post-scroll rendering
- **WHEN** the initial scroll to bottom is performed
- **THEN** the system SHALL wait (e.g., 1000ms) before starting the first DOM collection.
