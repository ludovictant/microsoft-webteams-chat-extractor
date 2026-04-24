## ADDED Requirements

### Requirement: Internal Domain Detection
The system SHALL identify if an asset URL belongs to a Microsoft or Teams internal domain (e.g., `teams.microsoft.com`, `asyncgw.teams.microsoft.com`).

#### Scenario: Identify Teams domain
- **WHEN** an asset URL is processed
- **THEN** the system SHALL check if the hostname matches internal patterns.

### Requirement: Selective Credential Inclusion
The system SHALL only include authentication headers and set `credentials: 'include'` for assets belonging to internal domains.

#### Scenario: Fetch internal asset
- **WHEN** a Teams-hosted asset is fetched
- **THEN** the system SHALL include the `Authorization` header and set `credentials: 'include'`.

#### Scenario: Fetch external asset
- **WHEN** an external asset (e.g., Giphy) is fetched
- **THEN** the system SHALL NOT include the `Authorization` header and SHALL set `credentials: 'omit'`.
