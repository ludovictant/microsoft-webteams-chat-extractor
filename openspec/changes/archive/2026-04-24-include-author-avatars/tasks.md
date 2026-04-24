## 1. Research and Preparation

- [x] 1.1 Confirm DOM selectors for author avatars in both Chat and Channel contexts.
- [x] 1.2 Verify `fetchAsBase64` works correctly with Teams avatar image URLs.

## 2. Update Extraction Logic (payload.js)

- [x] 2.1 Modify `buildTranscript` to locate the avatar image element when processing a new author group.
- [x] 2.2 Implement a Map to track unique authors and their fetched Base64 avatar strings to avoid redundant processing and reduce file size.
- [x] 2.3 Create a helper function to generate a sanitized CSS class name from an author's name.
- [x] 2.4 Update the HTML generation in `buildTranscript` to include the `<div class="avatar avatar-[class-name]"></div>` in the `message-header`.
- [x] 2.5 Generate a `<style id="dynamic-avatars">` block containing the CSS rules for each unique author and prepend it to the final `results` array.

## 3. Update Styles (popup.js)

- [x] 3.1 Add base CSS rules for the `.avatar` class (size, border-radius, `background-size: cover`, `display: inline-block`) to the `exportHTML` function's embedded stylesheet.
- [x] 3.2 Refine `.message-header` and `.author` styles for optimal vertical alignment and spacing with the avatar.

## 4. Verification

- [x] 4.1 Extract a chat transcript and confirm avatars are correctly displayed in the HTML output.
- [x] 4.2 Verify that avatars are fully embedded as Base64 by testing the HTML file offline.
- [x] 4.3 Ensure graceful fallback (no broken image icons) if an avatar fails to load or is missing.
