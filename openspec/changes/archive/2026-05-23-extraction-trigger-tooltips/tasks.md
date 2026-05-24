## 1. UI Refactoring

- [x] 1.1 Wrap "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages" buttons in `.btn-tooltip-wrapper` containers in `sidepanel.html`.
- [x] 1.2 Add `.btn-tooltip-text` elements with appropriate descriptive text for each of these buttons.

## 2. Tooltip Logic Refinement

- [x] 2.1 Update `sidepanel.js` to manage the tooltip text for the "Download recent messages" button, switching between the "Disabled" message and the "Enabled" message based on the Local Storage toggle state.
- [x] 2.2 Ensure the standard time-range tooltips are always active on hover.

## 3. Verification

- [x] 3.1 Verify that all extraction buttons show a descriptive tooltip on mouse hover.
- [x] 3.2 Confirm that the "Download recent messages" tooltip correctly updates its message when the Local Storage toggle is switched.
