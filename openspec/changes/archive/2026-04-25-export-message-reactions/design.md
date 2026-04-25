## Context

Microsoft Teams allows users to react to messages with emojis. These reactions are displayed in a summary pill below the message. To provide a complete archive, these reactions should be extracted and rendered in the exported formats.

## Goals / Non-Goals

**Goals:**
- Extract reaction emoji and count from the Teams DOM.
- Render reactions in HTML export with a "pill" style similar to Teams.
- Include a text summary of reactions in Markdown and CSV exports.

**Non-Goals:**
- Extracting who specifically reacted (Teams often only shows counts in the summary, and hovering/clicking to see individuals would be too complex/fragile).
- Exporting animated versions of reactions.

## Decisions

### 1. Extraction Strategy in `payload.js`
In the `serializeMessage` function, we will look for the reaction summary container.
- **Selector**: `[data-tid="channel-message-reaction-summary"]` or similar.
- **Data Structure**:
  ```javascript
  reactions: [
    { emoji: "👍", count: 3 },
    { emoji: "❤️", count: 1 }
  ]
  ```

### 2. HTML Rendering in `background.js`
We will add a `.reactions` container below the `.body` in the HTML template.
```css
.reactions { display: flex; gap: 4px; margin-top: 4px; }
.reaction-pill { background: #f0f0f0; border-radius: 12px; padding: 2px 8px; font-size: 13px; display: flex; align-items: center; gap: 4px; }
```

### 3. Markdown and CSV Integration
- **Markdown**: Append `(Reactions: 👍 3, ❤️ 1)` to the end of the message text.
- **CSV**: Add a new column `Reactions` with the same string format.

## Risks / Trade-offs

- **[Risk]** The reaction selectors might change frequently.
- **[Mitigation]** Use robust data-tid attributes where possible and provide fallback logic if the primary container isn't found.
