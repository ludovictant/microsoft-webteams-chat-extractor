## Why

Currently, exported chat transcripts only show the author's name and the message timestamp. Including the author's avatar would make the export look even more like the real Microsoft Teams interface and help visually distinguish between different participants, improving readability and aesthetic fidelity.

## What Changes

- **Avatar Extraction**: Update the extraction logic to locate the author's avatar image in the Teams DOM.
- **Base64 Embedding**: Convert extracted avatar images to Base64 strings to ensure the exported HTML is fully self-contained and works offline.
- **HTML Structure Update**: Modify the generated HTML to include the avatar image within each message group header.
- **Styling**: Add CSS rules to the exported HTML to properly size and shape (circular) the avatars, mimicking the Teams UI.

## Capabilities

### New Capabilities
- `author-avatar-extraction`: Extract and embed author avatars in the HTML export.

### Modified Capabilities
- (none)

## Impact

- `payload.js`: The `buildTranscript` function needs to be updated to extract the avatar and include it in the DOM.
- `popup.js`: The CSS styles for the exported HTML need to be updated to accommodate the new avatar elements.
