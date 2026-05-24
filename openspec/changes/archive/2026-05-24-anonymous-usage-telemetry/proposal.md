## Why

To improve the MS Teams Chat Extractor, it is essential to understand usage patterns (e.g., popular extraction scopes, success rates, frequency of historical exports). However, since users handle private chat data, this must be done with extreme care for privacy and explicit consent. This change implements a "Local-First, Opt-in Second" telemetry system that records anonymous usage metadata locally and only shares it with a server after the user explicitly agrees.

## What Changes

- **Anonymous Identity**: Generate a random `instanceId` upon extension installation to distinguish installs without identifying users.
- **Local Telemetry Store**: Add a `telemetry` object store in IndexedDB to record every extraction and download event.
- **Privacy Dashboard**: Add a new "Privacy & Stats" section in the Side Panel with a global opt-in toggle.
- **Success Nudge**: Implement a non-intrusive banner that appears after the first successful download to invite the user to opt-in.
- **Sync Mechanism**: Implement a background process to transmit accumulated local stats to a central server ONLY when the opt-in is active.
- **Data Anonymization**: Use SHA-256 hashing for conversation IDs before storage/transmission.

## Capabilities

### New Capabilities
- `anonymous-telemetry-tracking`: The system SHALL record anonymous usage metadata (event type, scope, message count, status) for every extraction and download action.
- `user-consent-management`: The system SHALL provide a clear opt-in mechanism (Nudge + Settings Toggle) and only transmit data to a remote server when consent is granted.

### Modified Capabilities
- (None)

## Impact

- `background.js`: Database schema update, event recording logic, hashing utility, and sync engine.
- `sidepanel.js`: Consent UI management (Nudge display, Toggle handling).
- `sidepanel.html`: New CSS/HTML for the "Privacy" section and the "Success Nudge" banner.
