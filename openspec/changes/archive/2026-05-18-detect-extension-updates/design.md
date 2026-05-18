## Context

The extension is primarily distributed as an "unpacked" extension on GitHub. This means Chrome's native update mechanism (via the Web Store) is not available. Currently, users must manually check the GitHub repository to see if a new version exists. We need a way to automate this discovery within the extension itself while keeping the data locally and respecting privacy.

## Goals / Non-Goals

**Goals:**
- Automate checking for a new version of the extension using a remote `version.json` file.
- Allow users to manually trigger a version check.
- Display a clear, version-specific message to the user when an update is available.
- Provide a direct link to the update instructions.
- Ensure the update check is non-intrusive and does not drain resources.

**Non-Goals:**
- Auto-updating the code (impossible for unpacked extensions).
- Tracking user installations or version distribution analytics.
- Notifying users about updates for *other* extensions.

## Decisions

### 1. Source of Truth: `version.json` over GitHub API
- **Decision**: Fetch a static `version.json` from the GitHub repository (`raw.githubusercontent.com`).
- **Rationale**: The GitHub API has rate limits (60 requests/hour for unauthenticated users). Fetching a raw file from GitHub's CDN is faster, has virtually no rate limits for this scale, and avoids the complexity of API authentication or response parsing of large JSON objects.
- **Alternatives**: Using the GitHub Releases API (discarded due to rate limits and complexity).

### 2. Frequency: 24-hour Alarm
- **Decision**: Use `chrome.alarms` to trigger a check once every 24 hours.
- **Rationale**: Version updates are infrequent. A daily check is sufficient and minimizes network traffic and battery impact.
- **Alternatives**: Checking on every popup open (discarded as too frequent/intrusive).

### 3. Messaging: Version-specific Strings
- **Decision**: The `version.json` will contain a `message` field.
- **Rationale**: Some updates are critical (security fixes), while others are optional (new features). Allowing a dynamic message lets the developer communicate the importance of the specific update.

### 4. Persistence: `chrome.storage.local`
- **Decision**: Store the `latestVersion` and `updateMessage` in local storage.
- **Rationale**: Allows the popup to display the notification immediately without waiting for a network fetch.

## Risks / Trade-offs

- **[Risk]** Rate limiting if many users check at once. → **Mitigation**: Staggering the alarm or using a static CDN-backed file (GitHub raw) which handles high traffic well.
- **[Risk]** The `version.json` becomes out of sync with `manifest.json`. → **Mitigation**: Add a step to the release process (or a GitHub Action) to ensure both are updated together.
- **[Risk]** Network failure preventing checks. → **Mitigation**: Silently fail and retry on the next alarm or manual trigger.
