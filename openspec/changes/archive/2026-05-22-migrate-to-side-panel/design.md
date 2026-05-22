## Context

The Microsoft Teams Chat Extractor currently utilizes a standard Chrome Action popup. While functional, the popup's transient nature (closing on any click outside its boundaries) hinders the user's ability to monitor long-running extractions while interacting with the Teams interface. Manifest V3's Side Panel API provides a solution by offering a persistent, sidebar-based UI.

## Goals / Non-Goals

**Goals:**
- Replace the popup UI with a persistent Chrome Side Panel.
- Ensure the Side Panel opens automatically when the extension icon is clicked.
- Maintain 100% feature parity with the existing extraction workflow.
- Optimize the UI layout for the vertical side panel format.

**Non-Goals:**
- Modifying the core scraping logic in `payload.js`.
- Implementing new export formats or features unrelated to the UI migration.

## Decisions

- **Decision: Manifest V3 Side Panel Integration**
  - **Rationale**: Leveraging the official `sidePanel` API ensures compatibility with current Chrome standards and provides the best user experience for persistent tools.
  - **Implementation**: Add `sidePanel` permission and define `side_panel.default_path` in `manifest.json`.

- **Decision: Automatic Opening on Action Click**
  - **Rationale**: Users expect the extension UI to appear when they click the toolbar icon. We will use `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` in the background script.
  - **Alternative**: Requiring users to open the side panel via the browser's side panel menu, which is less intuitive.

- **Decision: File Renaming and Refactoring**
  - **Rationale**: `popup.html` and `popup.js` will be renamed to `sidepanel.html` and `sidepanel.js` to accurately reflect their new context and avoid confusion.
  - **Refactoring**: The UI script will be updated to proactively request state from the background script upon initialization (since the panel might stay open longer than a popup).

- **Decision: Responsive Vertical Layout**
  - **Rationale**: Side panels are typically narrow (300px-400px). The UI will be adjusted to ensure all elements stack correctly and remain legible in a constrained horizontal space.

## Risks / Trade-offs

- **[Risk] Side Panel availability in older Chrome versions** → Mitigation: The extension already targets Manifest V3, and the Side Panel API is well-supported in current versions. No special mitigation needed as users are encouraged to keep browsers updated.
- **[Risk] State desync if panel stays open across multiple Teams tabs** → Mitigation: Implement logic to detect tab changes and update the side panel's "active extraction" context accordingly.
