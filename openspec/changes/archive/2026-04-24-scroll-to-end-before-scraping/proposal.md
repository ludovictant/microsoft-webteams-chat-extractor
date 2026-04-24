## Why

Currently, the extraction process begins from the messages currently visible in the DOM. If a user has manually scrolled up to read older messages before starting an extraction, the process might miss the most recent messages. Ensuring the chat is scrolled to the absolute bottom before starting the collection phase guarantees that the extraction capture starts from the most up-to-date message.

## What Changes

- **Automatic Scroll to End**: The extraction routine will now perform an initial scroll to the bottom of the chat pane before beginning the scrolling and collection loop.
- **Synchronization**: The collection logic will wait for the scroll to complete and for any new messages to render before proceeding.

## Capabilities

### New Capabilities
- `pre-extraction-synchronization`: Ensure the chat view is at the most recent state before data collection begins.

### Modified Capabilities
- `pipeline-extraction`: Update the extraction start sequence to include the initial scroll.

## Impact

- `payload.js`: The `scrollAndExtract` function will be updated to include an initial scroll-to-bottom step.
