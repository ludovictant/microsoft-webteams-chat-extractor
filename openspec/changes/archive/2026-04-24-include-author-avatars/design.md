## Context

The Microsoft Teams Chat Extractor currently collects message text, timestamps, and body images. However, it lacks author avatars, which are a key visual element of the Teams interface. Including them will enhance the "Teams-like" look and feel of the exported HTML.

## Goals / Non-Goals

**Goals:**
- Extract the author's avatar image from the Teams DOM.
- Convert avatar images to Base64 to ensure the export is portable.
- Integrate the avatar into the existing message grouping logic in `buildTranscript`.
- Style the avatars using CSS to match the Teams UI (circular, consistent size).

**Non-Goals:**
- Changing how messages are grouped (avatars will only appear when the author's name appears).
- Supporting avatars in Markdown export (Markdown support for embedded images is limited and usually depends on external hosting).

## Decisions

### 1. Extraction Logic in `payload.js`
In the `buildTranscript` function, when a new `message-header` is created (either because the author changed or a new day started), we will look for the avatar image.
- **Selector**: The user suggested `.fui-Avatar__image`. We will also look for fallback selectors if necessary.
- **Timing**: The avatar will be fetched and converted to Base64 asynchronously.
- **Optimization**: To prevent massive file bloat from repeating Base64 strings, we will maintain a `Map` of unique author names to their Base64 avatar strings.

### 2. Base64 Conversion
We will reuse the existing `fetchAsBase64(url)` helper function in `payload.js` to handle the conversion. This ensures consistency with how other images (emojis, message attachments) are handled.

### 3. Dynamic Stylesheet Generation
Instead of embedding the Base64 string directly into an `<img>` tag for every message, we will generate a `<style>` block containing CSS classes for each unique author.
```css
<style id="dynamic-avatars">
  .avatar-author-name-hash { background-image: url('data:image/png;base64,...'); }
</style>
```
*Note: A hash or sanitized version of the author's name will be used for the class name to ensure it's a valid CSS selector.*

### 4. HTML Structure Update
The `message-header` currently looks like this:
```html
<div class="message-header">
  <span class="author">Author Name</span>
  <span class="timestamp">01/01/2024 12:00</span>
</div>
```
It will be updated to use a `<div>` with the dynamic CSS class:
```html
<div class="message-header">
  <div class="avatar avatar-author-name-hash"></div>
  <span class="author">Author Name</span>
  <span class="timestamp">01/01/2024 12:00</span>
</div>
```

### 5. Styling in `popup.js`
The `exportHTML` function in `popup.js` contains a large CSS string. We will add styles for the `.avatar` base class:
- `width`: 32px (or similar to match Teams Comfy/Compact density).
- `height`: 32px.
- `border-radius`: 50%.
- `margin-right`: 8px.
- `vertical-align`: middle.
- `background-size`: cover.
- `display`: inline-block.

## Risks / Trade-offs

- **[Risk]**: Avatar image URLs might be protected or transient.
- **[Mitigation]**: Converting to Base64 immediately during extraction ensures they are preserved in the final output. If `fetch` fails, we will gracefully omit the avatar for that message group (e.g., fallback to an initial or a default grey circle).
