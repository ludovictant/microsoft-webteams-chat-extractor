## Why

With the introduction of persistent Local Storage and real-time message aggregation, users can now benefit from incremental extractions that only fetch new messages since their last crawl. However, there is currently no dedicated UI trigger for this specialized action. Adding a "Download recent messages" button makes this powerful feature discoverable and easy to use.

## What Changes

- **New Extraction Trigger**: Add a "Download recent messages" button to the extraction options panel, positioned below "Download all messages".
- **Dynamic Dependency**: The new button will be functionally tied to the "Local storage" feature. It will be enabled only when Local Storage is "On".
- **Informative Tooltip**: When the button is disabled (Local Storage is "Off"), a tooltip will appear on hover explaining the feature and how to enable it.
- **Incremental Logic Integration**: Clicking the button will trigger an extraction with a special "incremental" mode (represented by `days: -1` or similar logic) that tells the crawler to stop once it reaches messages already stored in the database.

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the `Unified Extraction Interface` to include the incremental extraction trigger and its conditional state/tooltip requirements.
- `extraction-lifecycle-management`: Define the behavior of the "Download recent messages" trigger and its interaction with the background script.

## Impact

- `sidepanel.html`: Addition of the new button and tooltip structure.
- `sidepanel.js`: Implementing the dynamic disabled state logic and click handler for the incremental trigger.
- `sidepanel.css`: Styling for the tooltip and disabled button state.
- `payload.js`: (Likely minimal) Ensuring the `extract` action correctly handles the signal for incremental crawling.
