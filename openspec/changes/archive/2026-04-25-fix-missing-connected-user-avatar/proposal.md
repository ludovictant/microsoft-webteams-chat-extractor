## Why

The HTML export currently misses the avatar for the connected user because Teams doesn't display it next to their own messages in the web UI. This results in an empty avatar placeholder in the export for the user's own messages, making the transcript look incomplete.

## What Changes

- **Extraction Logic Enhancement**: Update the extraction script to capture the connected user's avatar from the global Teams header (the profile button) if it's not found within individual message nodes.
- **Author Mapping**: Ensure the captured profile image is correctly associated with the connected user's name so that all their messages in the export display their avatar.

## Capabilities

### Modified Capabilities
- `author-avatar-extraction`: Update requirements to include capturing the connected user's avatar from the global UI context (e.g., profile menu) when it is not available in the message stream.

## Impact

- `payload.js`: The serialization and asset fetching logic will need to be updated to detect and store the current user's profile picture.
- `author-avatar-extraction` spec: Requirements will be updated to include global UI as a fallback source for avatars.
