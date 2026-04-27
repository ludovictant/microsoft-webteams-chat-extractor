## ADDED Requirements

### Requirement: Incremental Upward Scrolling
When traversing the chat history back in time, the system SHALL use an incremental "crawl" approach rather than large jumps to ensure all messages in the virtualized list are rendered and observed.

#### Scenario: Crawl up to the top
- **WHEN** the system needs to scroll to the top of the currently loaded list
- **THEN** it SHALL decrease the `scrollTop` value in discrete steps (e.g., 1500px).
- **AND** it SHALL wait for a DOM update signal (from `MutationObserver`) OR a safety timeout (2000ms) before proceeding to the next step.
- **AND** it SHALL continue this crawl until `scrollTop` reaches 0.
