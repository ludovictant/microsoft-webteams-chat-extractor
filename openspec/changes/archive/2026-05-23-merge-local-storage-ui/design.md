## Context

Currently, the Local Storage toggle and the Conversation History list are separate UI blocks. The history list is inside a `collapsible` container that users must manually click to expand. We want to remove this manual step and link the expansion state directly to the Local Storage toggle.

## Goals / Non-Goals

**Goals:**
- Combine the Local Storage toggle and the history list into one logical component.
- Automatically expand the history list when Local Storage is "On".
- Automatically collapse the history list when Local Storage is "Off".
- Preserve the default "On" state for the toggle.

**Non-Goals:**
- Changing the database schema or data fetching logic (this change is purely UI/UX).

## Decisions

- **Decision: Remove manual collapsible click logic**
  - **Rationale**: The user shouldn't have to click twice (once for storage, once for history). Linking them reduces friction.
  - **Implementation**: In `sidepanel.js`, the event listener for `localStorageToggle` will now also trigger the expansion/collapse of the history content `div`.

- **Decision: Nest components in HTML**
  - **Rationale**: To visually and logically group them, they should be part of the same container.
  - **Implementation**: The history list `div` will be placed immediately following the toggle block, and its `max-height` will be controlled by the toggle state.

- **Decision: Reuse existing `active` class patterns**
  - **Rationale**: The CSS already supports transition animations for `max-height`.
  - **Implementation**: When the toggle is "On", we will add the `active` class to the header and set `max-height`. When "Off", we remove them.

## Risks / Trade-offs

- **[Risk] Confusion if user wants storage on but list hidden** → Mitigation: In the Side Panel context, the history list is the primary benefit of Local Storage. Users wanting it "On" almost always want to see their data.
- **[Risk] Initial expansion lag** → Mitigation: Since the toggle is "On" by default, we will ensure the list expands immediately upon the first data fetch during initialization.
