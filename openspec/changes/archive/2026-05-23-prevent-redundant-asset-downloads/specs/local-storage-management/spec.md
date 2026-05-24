## ADDED Requirements

### Requirement: Asset Availability Reporting
The background script SHALL expose a method to determine if a specific asset URL is already present in the `assets` object store.

#### Scenario: Check asset existence
- **WHEN** the `isAssetStored(url)` method is called
- **THEN** it SHALL return `true` if the URL exists in the `assets` store, and `false` otherwise.

### Requirement: Automated Asset Session Injection
When an asset is identified as already stored during an extraction session, the background script SHALL automatically load its content into the transient session cache.

#### Scenario: Inject stored asset into session
- **WHEN** an asset URL is processed by the background script
- **AND** it is found in the IndexedDB `assets` store
- **THEN** its content SHALL be added to the `urlToBlob` map for the current extraction.
- **AND** the `processedAssets` and `totalAssets` counters SHALL be incremented accordingly.
