## 1. Database and Identity Setup

- [x] 1.1 Generate and persist `instanceId` in `chrome.storage.local` on install/startup if it doesn't exist.
- [x] 1.2 Implement the `telemetry` object store in `TeamsExtractorDB` within `background.js`.
- [x] 1.3 Create a utility function in `background.js` to hash IDs using SHA-256 (for `instance_id_hash` and `conv_id_hash`).

## 2. Core Telemetry Logic

- [x] 2.1 Implement `recordTelemetryEvent(type, data)` in `background.js`.
- [x] 2.2 Map numerical `days` values to descriptive scope strings (`7_days`, `30_days`, etc.).
- [x] 2.3 Integrate event recording into the `CHUNK_READY` / `FINISH_EXTRACTION` flow (for `extraction` events).
- [x] 2.4 Integrate event recording into the `DOWNLOAD_ZIP` flow (for `download` events).

## 3. Consent and UI Implementation

- [x] 3.1 Create the "Success Nudge" HTML/CSS component in `sidepanel.html`.
- [x] 3.2 Implement the "Privacy & Stats" section in the Side Panel settings.
- [x] 3.3 Add logic in `sidepanel.js` to show the nudge only after the first successful download.
- [x] 3.4 Handle the "Opt-in" and "Opt-out" actions (updating `chrome.storage.local` and triggering sync).

## 4. Synchronization Engine

- [x] 4.1 Implement `syncTelemetry()` in `background.js` to fetch unsynced records and perform a POST request.
- [x] 4.2 Set up a periodic alarm to trigger `syncTelemetry()` daily if opt-in is active.
- [x] 4.3 Implement data purging for synced records older than 90 days.

## 5. Validation

- [x] 5.1 Verify that events are correctly recorded in IndexedDB even when opt-in is OFF.
- [x] 5.2 Verify that no data is sent until the nudge or toggle is accepted.
- [x] 5.3 Verify that once opt-in is ON, all backlogged records are sent.
