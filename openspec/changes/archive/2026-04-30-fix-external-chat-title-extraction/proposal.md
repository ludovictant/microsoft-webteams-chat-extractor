## Why

Conversation titles are not consistently extracted for one-to-one chats with external participants in Microsoft Teams V2. This results in generic filenames (e.g., `teams-chat.zip`) which makes organizing and finding specific transcripts difficult for the user.

## What Changes

- **Improved Title Extraction**: Add additional DOM selectors to `payload.js` to specifically target the header elements used in New Teams (V2) for both internal and external chats.
- **Enhanced Fallback**: Improve the fallback logic to try multiple sources (including `aria-label` from header components) before falling back to `document.title`.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `smart-archive-naming`: Extend to ensure the "chat title" used for naming is reliably extracted from the Teams interface.

## Impact

- `payload.js`: Update `scrollAndExtract` title extraction logic with more robust selectors.
