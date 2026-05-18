# background-triggered-download Specification

## Purpose
TBD - created by archiving change fix-zip-size-limit. Update Purpose after archive.
## Requirements
### Requirement: Direct Background Download
The Service Worker (background script) SHALL have the capability to initiate a file download without passing the file data to the popup.

#### Scenario: Large file download
- **WHEN** the `DOWNLOAD_ZIP` message is received by the background script
- **AND** the ZIP generation is complete
- **THEN** the background script SHALL call `chrome.downloads.download` with the generated data URI.
- **AND** the background script SHALL NOT return the file data in the message response to the popup.

