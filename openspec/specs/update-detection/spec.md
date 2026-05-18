# update-detection Specification

## Purpose
TBD - created by archiving change detect-extension-updates. Update Purpose after archive.
## Requirements
### Requirement: Remote Version Fetching
The background script SHALL periodically fetch the `version.json` file from the remote GitHub repository.

#### Scenario: Background check finds new version
- **WHEN** the 24-hour alarm triggers and the fetched version is higher than the current extension version
- **THEN** the system SHALL store the new version number and the associated message in `chrome.storage.local`

### Requirement: Manual Update Check
The system SHALL allow the user to manually trigger a version check from the popup interface.

#### Scenario: User clicks manual check
- **WHEN** the user clicks the "Check for updates" button in the popup
- **THEN** the system SHALL immediately fetch the `version.json` and update the local storage with the results

### Requirement: Update Notification UI
The popup SHALL display a prominent notification when a new version is detected.

#### Scenario: Displaying update message
- **WHEN** the popup is opened and `chrome.storage.local` contains a `pendingUpdateVersion` greater than the current version
- **THEN** the system SHALL show an update banner with the `updateMessage` and a link to the `UPDATE.md` file

### Requirement: Version.json Structure
The remote `version.json` file SHALL follow a strict schema containing at least `version` (string) and `message` (string).

#### Scenario: Valid JSON parsing
- **WHEN** the background script fetches the JSON file
- **THEN** it SHALL be able to extract the `version` and `message` properties for comparison

