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
