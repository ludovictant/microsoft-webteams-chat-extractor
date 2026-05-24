# side-panel-integration Specification

## Purpose
Provide a persistent interface for managing archived conversations, monitoring extraction progress, and configuring extraction parameters within the Chrome Side Panel.

## Requirements

### Requirement: Persistent Side Panel
The system SHALL provide a persistent Side Panel to manage archived conversations, accessible via the extension icon.

#### Scenario: Opening the side panel
- **WHEN** the user clicks the extension icon in the toolbar
- **THEN** the system SHALL open the `sidepanel.html` in the Chrome Side Panel.

### Requirement: Conversation List View
The side panel SHALL display a list of all archived conversations optimized for a sidebar width (~400px).

#### Scenario: Displaying conversation stats
- **WHEN** the side panel is opened
- **THEN** it SHALL list each conversation's name, message count, and last crawl date.

### Requirement: Add Conversation Modal
The system SHALL provide a modal to manually add new Teams URLs to the management list.

#### Scenario: Manual URL addition
- **WHEN** the user clicks "Add Teams conversation URL"
- **THEN** a modal SHALL open with a URL input field, an "Add" button, and a "Cancel" button.

### Requirement: Dashboard Extraction Lock
The dashboard SHALL disable management actions during an active extraction to prevent data collisions.

#### Scenario: Locked state during extraction
- **WHEN** an extraction is in progress
- **THEN** the conversation list checkboxes and management buttons SHALL be disabled.
- **AND** a prominent "Stop Current Extraction" button SHALL be visible.

### Requirement: Chrome Side Panel Configuration
The extension SHALL be configured to use a Side Panel instead of a browser action popup for its primary user interface. This MUST be specified in the `manifest.json`.

#### Scenario: Manifest side panel declaration
- **WHEN** the user checks the extension's manifest
- **THEN** it SHALL contain the `sidePanel` permission.
- **AND** it SHALL contain a `side_panel` object with a `default_path` pointing to the main UI HTML file (e.g., `sidepanel.html`).

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

