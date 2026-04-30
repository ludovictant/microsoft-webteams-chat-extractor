## MODIFIED Requirements

### Requirement: Manual Scroll Prompt
The popup SHALL display a clear instruction to the user when the extraction enters the `stuck` state, explaining that stalling often occurs when the top of the history is reached. It SHALL direct them to manually scroll if history remains, or use the "Stop and Export" button if finished.

#### Scenario: Display nuanced manual scroll prompt
- **WHEN** the extension status is `stuck`
- **THEN** the popup SHALL show a prominent message: "Stalled: The top of the chat may have been reached. If you think that some history remains, manually scroll up in Teams then click 'Resume Manually'. Otherwise, click 'Stop and Export' to finish."
- **AND** it SHALL display the "Resume Manually" and "Stop and Export" buttons.
