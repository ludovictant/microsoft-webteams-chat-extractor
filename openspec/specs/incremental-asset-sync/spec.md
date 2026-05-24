## Purpose
Optimize extraction performance and reduce network traffic by checking for already downloaded assets in local storage before initiating new downloads.

## Requirements

### Requirement: Pre-Download Asset Existence Check
The content script SHALL verify if an asset (image or avatar) is already stored in the persistent local database before initiating a network download request.

#### Scenario: Skip download for existing asset
- **WHEN** an asset URL is encountered during extraction
- **AND** Local Storage is enabled
- **AND** the background script confirms the asset exists in IndexedDB
- **THEN** the content script SHALL NOT initiate a `fetch` request for that URL.
- **AND** the background script SHALL load the asset from IndexedDB into the current session's memory.

### Requirement: Asset Status Querying
The background script SHALL provide a mechanism to check the existence of multiple asset URLs in the `assets` object store and return their status.

#### Scenario: Batch asset existence check
- **WHEN** a `CHECK_ASSETS` message is received with a list of URLs
- **THEN** the background script SHALL query the `assets` store for each URL.
- **AND** it SHALL return a map or list indicating which assets are already stored.
