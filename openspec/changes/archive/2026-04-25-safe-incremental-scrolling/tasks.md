## 1. Scrolling Logic Update (payload.js)

- [x] 1.1 Implement the `crawlUp` loop within the `scrollAndExtract` main extraction loop.
- [x] 1.2 Implement the reactive wait mechanism: use a Promise that resolves on `MutationObserver` trigger OR a 2000ms timeout.
- [x] 1.3 Replace the direct `scrollContainer.scrollTop = 0` assignment with the incremental scroll loop using 1500px steps.
- [x] 1.4 Ensure the `Home` key dispatch remains at the end of the crawl to trigger server-side loading.
- [x] 1.5 Add debug logging to monitor the crawl progress (current `scrollTop` and direction).

## 2. Verification

- [x] 2.1 Test with a chat that has hundreds of messages loaded in memory to verify that the "crawl" successfully reaches 0 without skipping.
- [x] 2.2 Verify that the extraction continues normally once the top is reached and more messages are fetched from the server.
