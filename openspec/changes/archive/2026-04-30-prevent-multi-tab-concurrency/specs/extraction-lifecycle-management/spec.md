## ADDED Requirements

### Requirement: Multi-Tab Concurrency Protection
The system SHALL prevent starting a new extraction if one is already active in a different tab or window.

#### Scenario: Block start from different tab
- **WHEN** the background status is not `idle`
- **AND** a `START_EXTRACTION` message is received from a tab that is NOT the current `activeTabId`
- **THEN** the background script SHALL reject the request.

#### Scenario: Inform user of multi-tab conflict
- **WHEN** the extension popup is opened in a tab
- **AND** an extraction is active in a DIFFERENT tab
- **THEN** the popup SHALL display a clear notification: "An extraction is already running in another tab. You can monitor its progress here, but you cannot start a new one until it finishes."
- **AND** all extraction trigger buttons SHALL be disabled.
