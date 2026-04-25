## Context

In the Teams web application, avatars for the currently logged-in user are typically hidden within the chat stream but are visible in the top-right corner of the application header. The current extraction logic only searches for avatars within individual message nodes, leading to empty avatar placeholders for the connected user's messages in the HTML export.

## Goals / Non-Goals

**Goals:**
- Extract the connected user's name and avatar URL from the global Teams header.
- Correctly associate this avatar with the connected user's messages in the export.
- Ensure the extraction works even if the user is in a different language (as much as possible).

**Non-Goals:**
- Extracting profile information that is not visible on the screen.

## Decisions

### 1. Global Profile Extraction
Before the message extraction loop begins in `payload.js`, we will attempt to find the connected user's information from the profile button in the Teams header.
- **Selector**: `[data-tid="me-control-avatar"]`
- **Name Extraction**: Parse the `aria-label` attribute which contains the user's name (e.g., "Image de profil de TANT, LUDOVIC.").
- **Avatar Extraction**: Get the `src` attribute from the `img` tag within the avatar span.

### 2. Fallback Logic in `serializeMessage`
The `serializeMessage` function will be updated to use the globally extracted profile information as a fallback.
- If a message's local avatar extraction returns null, the system will check if the message `author` matches the extracted `connectedUserName`.
- If it matches, the `connectedUserAvatarUrl` will be used for that message.

### 3. Author Name Normalization
Since Teams often formats names as "LASTNAME, FIRSTNAME" in the profile label but might use "Firstname Lastname" elsewhere, we will implement a basic normalization or flexible matching if necessary. However, for now, we will start with exact matching based on what Teams provides in the chat nodes.

## Risks / Trade-offs

- **[Risk]** The format of the `aria-label` is likely localized (e.g., "Profile picture of...", "Image de profil de...").
- **[Mitigation]** We will use a regex that looks for the pattern after common prefixes or falls back to using the text content of the initials span (`#avatar-ris__initials`) if the name extraction fails.
- **[Risk]** The profile button might not be present or visible in all Teams views.
- **[Mitigation]** The system will gracefully continue without the connected user's avatar if the global profile extraction fails, maintaining current behavior.
