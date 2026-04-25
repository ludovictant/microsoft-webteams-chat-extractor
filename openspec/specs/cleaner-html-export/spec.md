## ADDED Requirements

### Requirement: Canvas Removal
The system SHALL remove all `canvas` elements from the message body during serialization.

#### Scenario: Remove canvas
- **WHEN** a message containing a `canvas` element is processed
- **THEN** the `canvas` element SHALL be removed from the exported HTML.

### Requirement: Redundant Wrapper Removal
The system SHALL remove `div` elements that exclusively contain a `canvas` element to prevent empty structural tags in the output.

#### Scenario: Remove empty canvas wrapper
- **WHEN** a `div` element is found to contain only a `canvas` element (and potentially whitespace)
- **THEN** both the `div` and the `canvas` SHALL be removed.

### Requirement: AMSImage Wrapper Removal
The system SHALL unwrap `span` elements that use the AMSImage itemtype (`http://schema.skype.com/AMSImage`) to remove redundant metadata containers.

#### Scenario: Unwrap AMSImage span
- **WHEN** a message containing a `span` with `itemtype="http://schema.skype.com/AMSImage"` is processed
- **THEN** the `span` tag SHALL be removed but its child elements SHALL be preserved in the final HTML.

### Requirement: Microdata Attribute Removal
The system SHALL remove microdata attributes (`itemtype`, `itemprop`, `itemscope`) from all elements in the message body during serialization.

#### Scenario: Strip microdata attributes
- **WHEN** an element in a message contains `itemtype`, `itemprop`, or `itemscope`
- **THEN** these attributes SHALL be removed from the exported HTML.

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
