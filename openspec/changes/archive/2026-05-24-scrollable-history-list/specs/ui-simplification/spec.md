## MODIFIED Requirements

### Requirement: Side Panel Responsive Layout
The UI SHALL be optimized for the vertical orientation of the Chrome Side Panel, ensuring that all controls and progress indicators are fully visible without horizontal scrolling. To prevent the side panel from overflowing the browser window height, long lists (such as the conversation history) SHALL be contained within a scrollable area.

#### Scenario: Vertical alignment
- **WHEN** the side panel is rendered
- **THEN** all elements SHALL stack vertically.
- **AND** padding SHALL be adjusted to account for the narrow width of a typical side panel.

#### Scenario: Scrollable conversation history
- **WHEN** the number of stored conversations causes the list to exceed the available vertical space (or a predefined maximum height)
- **THEN** the conversation history container SHALL provide a vertical scrollbar.
- **AND** the overall side panel height SHALL NOT exceed the browser window height.
