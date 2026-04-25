## Context

Teams chat stream contains "control" messages (membership changes, etc.) identified by classes like `fui-ChatControlMessageItem`. Currently, the extractor primarily targets standard user messages. Extracting these as simple text and rendering them uniquely will improve the readability and completeness of the export.

## Goals / Non-Goals

**Goals:**
- Differentiate between standard user messages and system-generated control messages.
- Provide a clear, minimal visual representation for system messages in the HTML export.
- Support "added/removed" notifications.

**Non-Goals:**
- Extracting avatars for system messages (they don't have them).
- Extracting reactions for system messages (unlikely to exist/be useful).

## Decisions

- **New Message Type**: Add a `type` field to the MDO (`message` or `system`).
- **Selector Update**: Update the extraction selectors in `payload.js` to include control message elements.
- **Specific Icon**: Use the regular `person-add` SVG icon provided by the user for these notifications.
- **CSS Styling**: Add a `.system-message` class to the HTML export with grey color and appropriate alignment.

## Risks / Trade-offs

- [Risk] → Different types of control messages might require different icons.
- [Mitigation] → Start with a generic icon (provided) for all control messages.
