## 1. Extraction Logic Update (payload.js)

- [x] 1.1 Update the reaction extraction loop to prioritize `img[alt]` within the `emoticon-renderer` or similar wrapper.
- [x] 1.2 Refine count extraction to look for dedicated count elements (e.g., `.fui-StyledText` or siblings of the emoji) instead of the entire pill text.
- [x] 1.3 Implement a fallback for the count that correctly handles descriptive text (e.g., by matching the last numeric sequence in the text).
- [x] 1.4 Add debug logging to capture the raw text of the pill and the final extracted emoji/count for troubleshooting.

## 2. Rendering Verification (background.js)

- [x] 2.1 Review `background.js` (or related rendering utility) to ensure the `reactions` array in the MDO is correctly mapped to the HTML template.
- [x] 2.2 Verify that the `.reaction-pill` CSS (likely in `popup.html` or generated style block) correctly spaces the emoji and count.

## 3. Verification

- [x] 3.1 Use the provided DOM sample to verify that the extraction now yields "😆" and "3" instead of "3" and "3".
- [x] 3.2 Verify that multiple reactions on a single message are all correctly extracted and displayed.
