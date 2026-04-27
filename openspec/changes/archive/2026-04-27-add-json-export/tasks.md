## 1. Implementation (background.js)

- [x] 1.1 Implement the `renderJSON()` function in `background.js`.
- [x] 1.2 In `renderJSON()`, implement the replacement logic to swap `##img_...##` placeholders for `images/...` filenames in the `content` field.
- [x] 1.3 Update `generateZip()` to include `transcript.json`.

## 2. Verification

- [x] 2.1 Verify that the exported ZIP contains `transcript.json`.
- [x] 2.2 Open the JSON and confirm that authors with quotes (e.g., `L'Auteur \"Alias\"`) are correctly escaped.
- [x] 2.3 Confirm that image placeholders in the JSON `content` are correctly replaced by local file paths.
