## Why

Users who install the extension manually from GitHub (via "Load Unpacked") do not receive automatic update notifications. They often remain on older versions with bugs or missing features. A remote-controlled update check allows the developer to notify users of new versions and provide context-specific messages about why an update is important. While automatic checks are convenient, providing a manual trigger gives users immediate control and reassurance.

## What Changes

- **Remote Configuration**: Create a `version.json` file to be hosted on the GitHub repository's main branch.
- **Background Logic**: 
    - Implement a periodic check (using `chrome.alarms`) that fetches the remote `version.json`.
    - Compare the remote `version` with the local `manifest.json` version.
    - If a newer version is detected, store the `version` and the `message` from the JSON in `chrome.storage.local`.
- **UI Integration**:
    - **Automatic Alert**: Add an "Update Available" banner or section in the popup when a new version is detected.
    - **Manual Check**: Add a "Check for Updates" button in the popup (likely in a settings or footer area).
    - **Custom Messaging**: Display the specific message associated with that version.
    - **Action**: Provide an "How to Update" button that opens `https://github.com/ludovictant/microsoft-webteams-chat-extractor/blob/main/UPDATE.md` in a new tab.
- **Reset Mechanism**: Ensure the notification disappears once the extension is updated (detected on next check or startup).

## Capabilities

### New Capabilities
- `remote-update-check`: Background service that fetches and compares version data from a remote JSON file.
- `update-notification-system`: Popup UI components to display version-specific messages and the update link.
- `manual-update-trigger`: A UI action to immediately initiate a version check.

### Modified Capabilities
- `extraction-lifecycle-management`: Ensure the background alarm or fetch doesn't trigger during high-cpu extraction tasks.

## Impact

- `background.js`: New alarm listener and fetch logic.
- `popup.html/js`: New UI logic for displaying the update state and the manual check button.
- `chrome.storage.local`: Already in manifest. Used for `pendingUpdateVersion`, `updateMessage`, and `lastCheckTimestamp`.
- Repository: A new `version.json` file at the root.
