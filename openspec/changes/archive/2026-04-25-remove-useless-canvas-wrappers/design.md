## Context

Microsoft Teams Web (v2) uses `canvas` elements for various UI effects (e.g., loading states, visual markers). These are typically wrapped in structural `div` tags. When extracting messages, these elements are preserved in the DOM clone and end up in the exported HTML, where they serve no purpose and can disrupt the layout.

## Goals / Non-Goals

**Goals:**
- Identify and remove all `canvas` elements within the message body clone.
- Remove parent `div` containers if they become empty or only contained the removed `canvas`.

**Non-Goals:**
- Removing any actual user content (text, images, files).

## Decisions

### 1. Specific Target Removal
In the `serializeMessage` function in `payload.js`, we will add a dedicated cleaning step before the attribute stripping.

```javascript
clone.querySelectorAll('canvas').forEach(function(canvas) {
    var parent = canvas.parentNode;
    if (parent && parent.tagName === 'DIV' && parent.children.length === 1) {
        parent.parentNode.removeChild(parent);
    } else if (parent) {
        parent.removeChild(canvas);
    }
});
```

### 2. Positioning in Pipeline
The removal will happen early in the `serializeMessage` process, right after cloning, to ensure we are working with the full DOM structure before IDs and classes are stripped.

## Risks / Trade-offs

- **[Risk]** Accidental removal of a `div` that contains text nodes along with the `canvas`.
- **[Mitigation]** The logic will strictly check `parent.children.length === 1`. If there are text nodes, `children.length` will still be 1 (as text nodes aren't "children" in that sense), so a more robust check using `textContent` or checking all child nodes might be necessary.
- **[Revised Mitigation]** We will check if `parent.innerText.trim() === ""` to ensure no text is lost.
