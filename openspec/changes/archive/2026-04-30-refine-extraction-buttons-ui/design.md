## Context

The current `popup.html` uses generic buttons in the `#options` panel. These buttons are currently styled with a dark background (`#2b2b3d`) and simple borders. Other "action" buttons in the extension use more vibrant colors (green for success/start, red for stop).

## Goals / Non-Goals

**Goals:**
- Update the labels of the four extraction trigger buttons.
- Harmonize the styling of these buttons with the "Start New Extraction" button (green theme).
- Clean up the options panel by removing redundant section headers.

**Non-Goals:**
- Changing the functionality of the buttons.
- Adding new settings.

## Decisions

- **CSS Updates**: Apply the same styling used for `#startNewExtractionBtn` to all buttons within `.btn-group`. This includes background color, hover states, and font weight.
- **HTML Refactoring**: Remove the `div.section-label` elements and update the text content of the buttons directly in the HTML.
- **Style Alignment**: Use `#43a047` for the background of the trigger buttons to match the "success" or "start" visual language of the extension.

## Risks / Trade-offs

- **Visual Density**: Removing labels might make the group of buttons feel slightly more anonymous, but the explicit "Download" prefix on each button mitigates this by providing clear context.
