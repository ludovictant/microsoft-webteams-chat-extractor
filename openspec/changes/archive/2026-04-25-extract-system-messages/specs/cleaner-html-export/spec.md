## ADDED Requirements

### Requirement: System Message Rendering
The system SHALL render system messages with a specific icon and simplified, grey, left-aligned styling to distinguish them from user-authored messages.

#### Scenario: Render system message in HTML
- **WHEN** a message of type `system` is rendered in the HTML export
- **THEN** it SHALL be displayed with a dedicated SVG icon and grey text, and it SHALL NOT include an author header or avatar.
