## Context

Conversation titles in Microsoft Teams V2 are not always reliably captured by the current DOM selectors, especially for chats with external participants. When DOM selectors fail or return empty strings, the current fallback to `document.title` is also insufficient because it includes generic prefixes like "Conversation |" and doesn't gracefully handle empty DOM results.

## Goals / Non-Goals

**Goals:**
- Implement a multi-stage title extraction strategy.
- Improve `document.title` cleaning to remove generic Teams prefixes.
- Ensure fallback to `'teams-chat'` only occurs if all other methods fail.

**Non-Goals:**
- Automated renaming of existing archives.
- Changing the background processing of titles.

## Decisions

- **Multi-selector Strategy**: Use an array of potential CSS selectors for the chat header, checking each for non-empty text content.
- **Improved Regex for Title Cleaning**:
  - `replace(/^\(.*\)\s*/, '')`: Removes notification counts like `(1)`.
  - `replace(/^Conversation\s*\|\s*/i, '')`: Removes the generic "Conversation |" prefix found in many one-to-one chat windows.
  - `replace(/\s*\|\s*Microsoft Teams$/i, '')`: Removes the standard Teams suffix.
- **Short-circuiting logic**: Use a dedicated helper function `getChatTitle()` in `payload.js` to manage the priority and fallback logic cleanly.

## Risks / Trade-offs

- **DOM Volatility**: Microsoft frequently changes Teams V2 selectors. *Mitigation*: By providing multiple selectors and a robust fallback to the window title, we increase the likelihood of success.
