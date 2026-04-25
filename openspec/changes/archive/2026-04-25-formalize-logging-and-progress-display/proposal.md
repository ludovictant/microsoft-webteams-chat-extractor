## Why

The current logging and progress reporting behaviors have been refined during implementation but are not yet reflected in the formal specifications. This change ensures that unified logging, persistent progress monitoring, and enhanced UI date formatting are officially documented as requirements.

## What Changes

- Update `debug-mode-management` spec to require unified logging across all extension components (popup, background, payload).
- Update `extraction-progress-visualization` spec to include a requirement for persistent backend logging of the oldest message parsed.
- Update `extraction-progress-visualization` spec to require the inclusion of the year in the UI date depth display.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `debug-mode-management`: Add unified logging requirement.
- `extraction-progress-visualization`: Add backend logging and enhanced date display requirements.

## Impact

- Project specifications: Updated to reflect current implementation standards.
- Documentation: Improved clarity for future maintenance.
