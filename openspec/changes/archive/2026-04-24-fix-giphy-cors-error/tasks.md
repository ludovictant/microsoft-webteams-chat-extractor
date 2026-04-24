## 1. Logic Implementation (payload.js)

- [x] 1.1 Update `fetchAndSendAsset` to detect if the URL belongs to a Teams/Microsoft domain.
- [x] 1.2 Modify the `headers` and `credentials` parameters in the `fetch` call to only include authentication for internal domains.
- [x] 1.3 Add a debug log to confirm if an anonymous or authenticated fetch is being performed for a given URL.

## 2. Verification

- [x] 2.1 Perform an extraction of a chat containing at least one Giphy GIF.
- [x] 2.2 Verify in the console that the GIF is fetched anonymously and without CORS errors.
- [x] 2.3 Inspect the final ZIP archive to ensure the GIF binary is included and not empty.
- [x] 2.4 Verify that Teams-hosted avatars and images are still correctly fetched using authentication.
