## Context

The current reaction extraction logic in `payload.js` is too aggressive with its fallback and text matching. When a pill contains both an image (with the emoji in `alt`) and text (with the count and a description), the logic sometimes captures the count twice or misses the emoji entirely.

Teams DOM for a reaction pill typically looks like this:
```html
<button data-tid="diverse-reaction-pill-button">
  <div class="___16nu87p">
    <span data-tid="emoticon-renderer"><img alt="😆" ...></span>
    <div aria-hidden="true">3 réactions Rigole.</div>
    <span class="fui-StyledText">3</span>
  </div>
</button>
```
The `pill.innerText` for the button is "3 réactions Rigole. 3". 
Our current logic:
1. Tries to find an `img[alt]`.
2. If not found, tries to match an emoji in the `innerText`.
3. Tries to find the first number in `innerText` for the count.

The issue is that if `img[alt]` is found, but the count extraction is messy (matching the "3" in "3 réactions"), we get "😆 3". If the emoji extraction fails but it finds a character, it might get weird results.

## Goals / Non-Goals

**Goals:**
- Robustly extract the emoji from either `img[alt]` or Unicode characters.
- Robustly extract the reaction count from the specific `span` or by parsing the `innerText` more carefully (taking the last number found, or filtering out descriptive words).
- Ensure the HTML export displays these two pieces of data clearly.

**Non-Goals:**
- Changing the visual style of the reaction pills.
- Extracting the names of people who reacted.

## Decisions

- **Selective Text Extraction**: Instead of using `pill.innerText` which concatenates all nested text, we will look for specific sub-elements for the count (like `.fui-StyledText`) or use a more precise regex.
- **Emoji Priority**: Always prioritize `img[alt]` from the `emoticon-renderer` span. If not found, look for a Unicode emoji in the text nodes, but exclude the count-related text.
- **Count Normalization**: Use `parseInt` on the text content of the dedicated count span if available, otherwise find the last sequence of digits in the pill's text (to avoid the "3" in "3 reactions" if it appears).

## Risks / Trade-offs

- [Risk] → Teams changing their internal class names (e.g., `___16nu87p`).
- [Mitigation] → Continue to use `data-tid` attributes where possible and provide fallback text-based extraction.
