## MODIFIED Requirements

### Requirement: Aggressive DOM Cleaning
The system SHALL perform more aggressive cleaning of Teams-specific UI artifacts during serialization to ensure a clean and lightweight export.

#### Scenario: Clean UI artifacts
- **WHEN** a message is serialized
- **THEN** redundant UI elements like canvas markers and their wrappers SHALL be purged.
