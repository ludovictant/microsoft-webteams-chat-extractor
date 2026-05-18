## 1. Preparation

- [x] 1.1 Create the initial `version.json` file at the root of the project with current version and a placeholder message.
- [x] 1.2 Identify the raw GitHub URL for the `version.json` file (e.g., `https://raw.githubusercontent.com/ludovictant/microsoft-webteams-chat-extractor/main/version.json`).

## 2. Background Implementation

- [x] 2.1 Implement the `checkVersion()` function in `background.js` to fetch and compare versions.
- [x] 2.2 Add version comparison logic (handling semantic versioning).
- [x] 2.3 Set up `chrome.alarms` to trigger `checkVersion()` every 24 hours.
- [x] 2.4 Add a message listener in `background.js` to handle manual check requests from the popup.
- [x] 2.5 Ensure the update state is stored in `chrome.storage.local`.

## 3. Popup UI Implementation

- [x] 3.1 Create the HTML structure for the update notification banner in `popup.html`.
- [x] 3.2 Add a "Check for updates" button/link in the popup (e.g., in the footer).
- [x] 3.3 Implement the CSS for the update banner and the manual check button.
- [x] 3.4 Add logic in `popup.js` to check storage on load and display the banner if an update is available.
- [x] 3.5 Implement the click handler for the manual check button, including loading state feedback.
- [x] 3.6 Implement the "Update Now" link behavior to open `UPDATE.md` in a new tab.

## 4. Verification & Testing

- [x] 4.1 Test the background alarm by temporarily reducing the interval.
- [x] 4.2 Verify that a manual check correctly updates the UI when a fake higher version is set in the mocked fetch response.
- [x] 4.3 Confirm the "Update Now" link opens the correct URL.
- [x] 4.4 Verify that the notification disappears after the extension version is manually updated to match the remote version.
