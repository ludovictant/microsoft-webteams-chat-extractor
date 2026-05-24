## ADDED Requirements

### Requirement: Persistent Side Panel
The system SHALL provide a persistent Side Panel to manage archived conversations, accessible via the extension icon.

#### Scenario: Opening the side panel
- **WHEN** the user clicks the extension icon in the toolbar
- **THEN** the system SHALL open the `dashboard.html` in the Chrome Side Panel.

### Requirement: Conversation List View
The side panel SHALL display a list of all archived conversations optimized for a sidebar width (~400px).

#### Scenario: Displaying conversation stats
- **WHEN** the side panel is opened
- **THEN** it SHALL list each conversation's name, message count, and last crawl date.
