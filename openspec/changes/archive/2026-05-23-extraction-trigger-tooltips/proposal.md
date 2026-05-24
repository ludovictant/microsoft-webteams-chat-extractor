## Why

The extraction trigger buttons in the side panel current lack descriptive information. While their labels are clear, providing additional context via tooltips can help new users understand exactly what "last 7 days" or "all messages" implies in the context of Teams crawling. This enhances the overall professionalism and usability of the interface.

## What Changes

- **UI Enhancement**: Wrap each extraction trigger button (7 days, 30 days, 90 days, All) in a tooltip container.
- **Descriptive Text**: Add unique, helpful descriptions for each time range.
- **Consistent Feedback**: Ensure all trigger buttons share the same tooltip visual style as the already-implemented "Download recent messages" button.

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the `Unified Extraction Interface` and `Standardized Primary Button Styling` requirements to include informative tooltips for all trigger elements.

## Impact

- `sidepanel.html`: Restructuring the button group to include tooltip wrappers and text.
- `sidepanel.css`: Reusing and generalizing the `btn-tooltip-wrapper` and `btn-tooltip-text` classes.
