## ADDED Requirements

### Requirement: Bulk Deletion
The system SHALL allow the user to delete one or more conversations and all their associated messages in a single action.

#### Scenario: Bulk deletion with "Select All"
- **WHEN** the user selects multiple conversations via checkboxes (or "Select All")
- **AND** clicks "Delete Selected"
- **THEN** all associated records in the `Conversations` and `Messages` stores SHALL be removed.

### Requirement: Asset Garbage Collection
The system SHALL automatically remove image blobs from the `Assets` store if they are no longer referenced by any message.

#### Scenario: Removing orphaned assets
- **WHEN** a conversation is deleted
- **THEN** the system SHALL check all associated asset URLs and delete them from the `Assets` store if no other conversation in the database references them.
