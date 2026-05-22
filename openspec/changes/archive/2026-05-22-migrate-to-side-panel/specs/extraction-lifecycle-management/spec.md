## MODIFIED Requirements

### Requirement: Manual Reset to Options
The system SHALL provide a mechanism for the user to return to the initial time-range selection screen after an extraction has finished or was stopped.

#### Scenario: Reset from final screen
- **WHEN** the user clicks the "Start New Extraction" button on the final screen
- **THEN** the side panel SHALL return to the initial options panel.

### Requirement: Manual Scroll Prompt
The side panel SHALL display a clear instruction to the user when the extraction enters the `stuck` state, explaining that stalling often occurs when the top of the history is reached. It SHALL direct them to manually scroll if history remains, or use the "Stop and Export" button if finished.

#### Scenario: Display nuanced manual scroll prompt
- **WHEN** the extension status is `stuck`
- **THEN** the side panel SHALL show a prominent message: "Stalled: The top of the chat may have been reached. If you think that some history remains, manually scroll up in Teams then click 'Resume Manually'. Otherwise, click 'Stop and Export' to finish."
- **AND** it SHALL display the "Resume Manually" and "Stop and Export" buttons.

#### Scenario: Resume after manual scroll
- **WHEN** the system is in the `stuck` state
- **AND** a change in the oldest message timestamp is detected (due to manual scrolling)
- **THEN** the system SHALL automatically revert to the `extracting` state and continue the process.
- **AND** it SHALL display a green success notification in the side panel for 10 seconds.

#### Scenario: Block concurrent start in side panel
- **WHEN** an extraction is already active or in the process of starting
- **AND** the user attempts to trigger another extraction (e.g., via double-click)
- **THEN** the system SHALL ignore the subsequent request.
- **AND** it SHALL log a message to the console: "[CONCURRENCY] Extraction already in progress. Ignoring concurrent request."

#### Scenario: Visual feedback during start
- **WHEN** a valid extraction request is initiated from the side panel
- **THEN** all extraction trigger buttons SHALL be immediately disabled until the system transitions into an active extraction state.

#### Scenario: Inform user of multi-tab conflict
- **WHEN** the extension side panel is opened in a tab
- **AND** an extraction is active in a DIFFERENT tab
- **THEN** the side panel SHALL display a clear notification: "An extraction is already running in another tab. You can monitor its progress here, but you cannot start a new one until it finishes."
- **AND** all extraction trigger buttons SHALL be disabled.

#### Scenario: Abort during extraction
- **WHEN** the extraction status is `extracting` or `stuck`
- **AND** the user clicks the "Abort Extraction" button
- **THEN** the background script SHALL signal the content script to stop.
- **AND** the background script SHALL reset the extraction state to `idle`.
- **AND** the side panel SHALL return to the initial options panel.
