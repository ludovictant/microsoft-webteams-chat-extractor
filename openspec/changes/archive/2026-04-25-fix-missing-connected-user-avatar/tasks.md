## 1. Global Profile Extraction (payload.js)

- [x] 1.1 Implement logic to find the profile button (`[data-tid="me-control-avatar"]`) and extract the connected user's name from its `aria-label`.
- [x] 1.2 Extract the connected user's avatar URL from the profile image within the header.
- [x] 1.3 Store the extracted name and avatar URL in a scope accessible to the serialization logic.

## 2. Fallback Logic Integration (payload.js)

- [x] 2.1 Update `serializeMessage` to detect when a message author matches the globally extracted connected user's name.
- [x] 2.2 Integrate the fallback logic to use the global avatar URL when the local message node does not contain an avatar image.

## 3. Verification

- [x] 3.1 Verify that the connected user's messages in the HTML export now display their avatar.
- [x] 3.2 Confirm that avatars for other participants continue to be extracted correctly from the message stream.
