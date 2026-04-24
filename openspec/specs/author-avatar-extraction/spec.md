## ADDED Requirements

### Requirement: Author Avatar Identification
The system SHALL identify the author's avatar image within the Teams message element using appropriate selectors for both private chats and channel conversations.

#### Scenario: Identify avatar in message
- **WHEN** a message node is being processed
- **THEN** the system SHALL search for an `img` tag with the class `fui-Avatar__image` or a similar identifier within the author information area

### Requirement: Avatar Base64 Optimization
The system SHALL convert identified avatar images into Base64 data strings ONCE per unique author to minimize the size of the exported HTML file.

#### Scenario: Convert avatar image uniquely
- **WHEN** an avatar image is found for a specific author
- **THEN** the system SHALL check if the avatar has already been processed for this author. If not, it SHALL fetch and convert the image to Base64 and store it associated with the author's identity.

### Requirement: Dynamic CSS Generation for Avatars
The system SHALL generate dynamic CSS classes containing the Base64 background images for each unique author.

#### Scenario: Generate CSS for extracted avatars
- **WHEN** all messages have been processed
- **THEN** the system SHALL create a `<style>` block containing `.avatar-[author-hash] { background-image: url('...'); }` rules for each unique author with an avatar.

### Requirement: Avatar Inclusion in HTML Export
The system SHALL include a `<div>` element with the corresponding author's dynamic avatar CSS class in the `message-header` section of each message group.

#### Scenario: Display avatar using CSS class
- **WHEN** the HTML export is generated
- **THEN** a `<div class="avatar avatar-[author-hash]"></div>` element SHALL be placed before the author's name in the header of each message group where an avatar is available.

### Requirement: Avatar Styling
The system SHALL apply appropriate CSS styling to the included avatars to ensure they are displayed as small, circular images consistent with the Teams UI.

#### Scenario: Style avatar as circular
- **WHEN** the HTML export is viewed
- **THEN** the avatar images SHALL have a fixed size (e.g., 24x24px or 32x32px) and a circular border-radius (50%)
