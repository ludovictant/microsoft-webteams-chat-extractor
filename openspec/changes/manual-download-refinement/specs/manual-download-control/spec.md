## REMOVED Requirements

### Requirement: Automatic Download
**Reason**: Replaced by manual trigger to avoid unexpected downloads in persistent Side Panel context.
**Migration**: User must now click "Download Archive (ZIP)" on the completion screen.

## ADDED Requirements

### Requirement: Manual Download Trigger
The side panel SHALL NOT initiate the ZIP download automatically upon reaching the `ready` state. It SHALL wait for the user to click the "Download Archive (ZIP)" button.

#### Scenario: User initiates download
- **WHEN** the extraction state is `ready`
- **AND** the user clicks the "Download Archive (ZIP)" button
- **THEN** the system SHALL initiate the ZIP generation and download process.

### Requirement: Permanent Download Button Lock
Once a download has been successfully initiated from the side panel, the "Download Archive (ZIP)" button SHALL be permanently disabled for the duration of the current extraction session.

#### Scenario: Button remains disabled after click
- **WHEN** the user clicks the download button
- **AND** the background script confirms the download process has started
- **THEN** the button SHALL remain disabled.
- **AND** its text SHALL be set to "Downloaded!".
