## ADDED Requirements

### Requirement: Side Panel State Initialization
When the side panel is opened, it SHALL immediately request the current extraction state from the background script to ensure the UI is up-to-date with any background processes.

#### Scenario: UI sync on open
- **WHEN** the side panel is opened
- **THEN** it SHALL send a `GET_STATE` message to the background script.
- **AND** it SHALL update the display based on the received state (e.g., showing progress if an extraction is active).

### Requirement: Real-time State Updates
The side panel SHALL listen for state change notifications from the background script to provide real-time feedback without relying solely on polling while the panel is open.

#### Scenario: Reactive UI updates
- **WHEN** the background script's extraction state changes
- **THEN** it SHALL broadcast a message to all active extension pages (including the side panel).
- **AND** the side panel SHALL update its UI immediately.

### Requirement: Tab Change Synchronization
When the user switches tabs, the side panel UI SHALL update to reflect whether the new tab is the "active" tab for the current extraction or if it's a different Teams instance.

#### Scenario: Context switch on tab change
- **WHEN** the user switches to a different browser tab
- **THEN** the side panel SHALL re-evaluate its state relative to the new active tab.
- **AND** it SHALL display the appropriate controls or "other tab busy" notifications.
