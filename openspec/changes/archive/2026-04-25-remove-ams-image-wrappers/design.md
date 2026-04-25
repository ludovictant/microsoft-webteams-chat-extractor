## Context

The extension clones message nodes and cleans them before export. Currently, we remove many attributes but some redundant container elements remain.

## Goals / Non-Goals

**Goals:**
- Identify `span` elements using the `AMSImage` schema.
- Remove the `span` tags while preserving their internal content (unwrapping).

**Non-Goals:**
- Removing all `span` tags (only those with the specific `itemtype`).

## Decisions

### 1. Targeted Unwrapping in `payload.js`
We will use a selector to find the target spans and then replace them with their children.
- **Implementation**:
  ```javascript
  clone.querySelectorAll('span[itemtype*="AMSImage"]').forEach(function(span) {
    while (span.firstChild) {
      span.parentNode.insertBefore(span.firstChild, span);
    }
    span.remove();
  });
  ```

### 2. Microdata Attribute Cleanup
We will extend the existing attribute removal loop to strip common microdata attributes.
- **Implementation**: Add `el.removeAttribute('itemtype')`, `el.removeAttribute('itemprop')`, and `el.removeAttribute('itemscope')` to the cleaning loop.
- **Rationale**: These attributes are internal Teams metadata and serve no purpose in the export.

## Risks / Trade-offs

- **[Risk]** Unwrapping might affect CSS if the span was used for specific layout.
- **[Mitigation]** The current export uses very minimal CSS and these spans are largely metadata wrappers from Teams, so impact should be negligible.
