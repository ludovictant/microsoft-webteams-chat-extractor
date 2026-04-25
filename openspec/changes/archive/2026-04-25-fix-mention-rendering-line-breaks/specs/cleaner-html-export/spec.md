## ADDED Requirements

### Requirement: Inline Mention Rendering
The system SHALL ensure that user mentions are rendered as inline elements (e.g., `span`) rather than block-level elements (e.g., `div`) to prevent unexpected line breaks.

#### Scenario: Convert mention div to span
- **WHEN** a mention is contained within a `div` element
- **THEN** the system SHALL convert the `div` to a `span` or otherwise ensure it displays inline.

### Requirement: Interactive Attribute Removal
The system SHALL remove interactive and accessibility attributes that are only relevant for the live Teams application (e.g., `aria-haspopup`, `role`, `tabindex`) from message content.

#### Scenario: Strip interactive attributes from mentions
- **WHEN** a mention element contains `aria-haspopup="dialog"`, `role="button"`, or `tabindex="0"`
- **THEN** these attributes SHALL be removed in the exported HTML.
