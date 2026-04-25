## ADDED Requirements

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
