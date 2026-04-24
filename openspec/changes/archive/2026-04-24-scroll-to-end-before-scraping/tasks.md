## 1. Implement Initial Scroll (payload.js)

- [x] 1.1 Locate the start of the `scrollAndExtract` function in `payload.js`.
- [x] 1.2 Add logic to scroll the `scrollContainer` to `scrollHeight` before the main loop.
- [x] 1.3 Insert an `await sleep(1000)` call after the initial scroll to allow messages to render.
- [x] 1.4 Ensure `collectAndSend()` is called immediately after the sleep to capture the bottom-most state.

## 2. Verification

- [x] 2.1 Start an extraction while manually scrolled to the middle of a chat.
- [x] 2.2 Verify that the browser automatically jumps to the bottom before it starts scrolling up.
- [x] 2.3 Inspect the final ZIP to ensure the most recent messages are included.
