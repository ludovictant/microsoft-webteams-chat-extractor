## ADDED Requirements

### Requirement: Chrome Side Panel Configuration
The extension SHALL be configured to use a Side Panel instead of a browser action popup for its primary user interface. This MUST be specified in the `manifest.json`.

#### Scenario: Manifest side panel declaration
- **WHEN** the user checks the extension's manifest
- **THEN** it SHALL contain the `sidePanel` permission.
- **AND** it SHALL contain a `side_panel` object with a `default_path` pointing to the main UI HTML file (e.g., `popup.html` or `sidepanel.html`).

### Requirement: Open Side Panel on Icon Click
The extension SHALL open the side panel when the user clicks on the extension's action icon in the browser toolbar.

#### Scenario: Icon click behavior
- **WHEN** the user clicks the extension icon in the toolbar
- **THEN** the side panel SHALL be opened for the current tab.

### Requirement: Side Panel Global vs. Tab-specific Behavior
The side panel SHALL be configured to be available across all tabs, but the extraction logic SHALL remain tab-aware to ensure it interacts with the correct Microsoft Teams instance.

#### Scenario: Panel behavior configuration
- **WHEN** the extension starts
- **THEN** the background script SHALL use `chrome.sidePanel.setPanelBehavior` to ensure the panel opens on icon click.
