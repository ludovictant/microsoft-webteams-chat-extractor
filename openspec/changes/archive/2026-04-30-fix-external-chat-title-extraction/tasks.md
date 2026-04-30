## 1. Core Logic (payload.js)

- [x] 1.1 Implement `getChatTitle` helper function with multi-selector support.
- [x] 1.2 Update regex to strip "Conversation |" prefix from document title.
- [x] 1.3 Refactor `scrollAndExtract` to use the new `getChatTitle` function.

## 2. Verification

- [x] 2.1 Verify title extraction on internal group chats.
- [x] 2.2 Verify title extraction on one-to-one chats with internal users.
- [x] 2.3 Verify title extraction on one-to-one chats with external users (specifically checking the "Conversation | " prefix removal).
- [x] 2.4 Verify fallback to `teams-chat` if both DOM and title extraction are somehow blocked.
