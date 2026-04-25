## ADDED Requirements

### Requirement: Conditional Debug Attribute Filtering
The extraction pipeline SHALL conditionally preserve or remove attributes starting with `debug-` based on the current Debug Mode state.

#### Scenario: Preserve debug attributes
- **WHEN** Debug Mode is ON during extraction
- **THEN** attributes starting with `debug-` SHALL be kept in the final HTML nodes.

#### Scenario: Remove debug attributes
- **WHEN** Debug Mode is OFF during extraction
- **THEN** attributes starting with `debug-` SHALL be stripped from the final HTML nodes.
