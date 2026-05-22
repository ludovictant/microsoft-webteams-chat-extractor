## 1. Manifest and Configuration

- [x] 1.1 Add `sidePanel` permission to `manifest.json`
- [x] 1.2 Remove `default_popup` from `action` in `manifest.json`
- [x] 1.3 Add `side_panel` object with `default_path: "sidepanel.html"` to `manifest.json`

## 2. File Preparation and Renaming

- [x] 2.1 Rename `popup.html` to `sidepanel.html`
- [x] 2.2 Rename `popup.js` to `sidepanel.js`
- [x] 2.3 Update script reference in `sidepanel.html` to point to `sidepanel.js`

## 3. Background Script Updates

- [x] 3.1 Implement `chrome.sidePanel.setPanelBehavior` in `background.js` to enable opening on icon click
- [x] 3.2 Ensure `background.js` broadcasts state changes to all extension views for real-time updates

## 4. Side Panel UI and Logic Refinement

- [x] 4.1 Update `sidepanel.js` to proactively request current state from background on initialization
- [x] 4.2 Adjust `sidepanel.html` CSS for narrow vertical orientation (stacking elements, flexible widths)
- [x] 4.3 Implement tab change listener in `sidepanel.js` to ensure UI context matches the active Teams tab

## 5. Verification and Cleanup

- [x] 5.1 Verify that clicking the extension icon opens the side panel instead of a popup
- [x] 5.2 Test full extraction lifecycle (Start -> Progress -> Stop -> Download) within the side panel
- [x] 5.3 Confirm UI persistence: closing/opening panel and switching tabs during active extraction
