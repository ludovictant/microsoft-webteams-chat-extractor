## Why

The Teams HTML export currently includes unnecessary `<span>` wrappers with the attribute `itemtype="http://schema.skype.com/AMSImage"`. These are internal Microsoft metadata elements that provide no value to the final export and add unnecessary nesting to the HTML structure.

## What Changes

- **Extraction**: In `payload.js`, identify all `span` elements with the `AMSImage` `itemtype` and unwrap them. Additionally, strip the `itemtype` attribute from any remaining elements.

## Capabilities

### Modified Capabilities
- `cleaner-html-export`: Update the HTML cleaning logic to target and remove AMSImage wrappers.

## Impact

- `payload.js`: Specifically the DOM cleaning logic inside `serializeMessage`.
