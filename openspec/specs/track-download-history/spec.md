## ADDED Requirements

### Requirement: Record Last Download Timestamp
The system SHALL record the current timestamp as the `lastDownloadTimestamp` for a conversation in the local database ONLY whenever a historical ZIP archive (from local storage) is successfully initiated for download.

#### Scenario: Update download date on historical success
- **WHEN** a `DOWNLOAD_ZIP` message with a `teamsId` is processed successfully
- **THEN** the system SHALL update the corresponding conversation record in IndexedDB with the current time.

#### Scenario: No update on session export
- **WHEN** a `DOWNLOAD_ZIP` message WITHOUT a `teamsId` (session export) is processed
- **THEN** the system SHALL NOT update the `lastDownloadTimestamp` in the database.

### Requirement: Display Last Download Date
The side panel SHALL display the formatted date and time of the last download for each conversation in the history table.

#### Scenario: Show download date in list
- **WHEN** the history list is rendered
- **THEN** a column labeled "Last Download" SHALL display the value of `lastDownloadTimestamp` or "Never" if null.
