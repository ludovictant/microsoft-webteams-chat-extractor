## Context

Teams wraps mentions in complex structural elements. For example:
```html
<div class="..." data-lpc-hover-target-id="..." tabindex="0" role="button" aria-haspopup="dialog" aria-label="BORIS mentionné" data-is-focusable="true">
  <span dir="auto" class="..." itemtype="http://schema.skype.com/Mention">BORIS</span>
</div>
```
When serialized, if the outer `div` is preserved, it causes a line break because `div` is a block element. Furthermore, the `aria-haspopup` and other interactive attributes remain in the export, which is unnecessary for a static transcript.

## Goals / Non-Goals

**Goals:**
- Ensure mentions do not cause line breaks.
- Remove noisy attributes like `aria-haspopup`, `role`, and `tabindex` from the exported HTML.
- Simplify the structure of mentions.

**Non-Goals:**
- Changing the visual styling (colors/fonts) of mentions.
- Adding interactivity back to mentions.

## Decisions

- **Convert Mention Divs to Spans**: In `payload.js`, we will specifically target elements that contain mentions and convert them to inline `span` elements.
- **Enhanced Attribute Stripping**: We will expand the list of attributes to be removed during the cleaning phase to include `role`, `tabindex`, `aria-haspopup`, `aria-expanded`, etc.
- **Keep Mentions Identifiable**: We will ensure the `Mention` itemtype (or a class) is preserved if needed for styling, but strip the metadata attributes if they match the "Microdata Removal" requirement.

## Risks / Trade-offs

- [Risk] → Converting *all* `div`s to `span`s might break other structures.
- [Mitigation] → Targeted conversion based on classes, attributes, or context (e.g., elements wrapping an element with `itemtype*="Mention"`).
