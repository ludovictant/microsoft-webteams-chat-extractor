## ADDED Requirements

### Requirement: Global Connected User Avatar Extraction
The system SHALL attempt to extract the connected user's name and avatar image from the global application header (profile menu) when the extraction process starts.

#### Scenario: Extract global avatar
- **WHEN** the extraction process starts
- **THEN** the system SHALL search for the profile button and extract the user's name and avatar URL to be used as a fallback for their messages.

### Requirement: Connected User Avatar Association
The system SHALL associate the globally extracted avatar with any messages authored by the connected user that lack a local avatar.

#### Scenario: Apply fallback avatar
- **WHEN** a message is processed that has no local avatar image
- **AND** the message author matches the extracted connected user's name
- **THEN** the system SHALL use the globally extracted avatar URL for that message.
