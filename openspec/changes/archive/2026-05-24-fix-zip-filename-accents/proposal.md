## Why

The current filename sanitization logic is too restrictive, replacing all non-alphanumeric characters (including European accentuated characters like 'é', 'à', 'ö', etc.) with underscores. This results in less readable filenames for users in non-English locales, where chat titles often contain accents.

## What Changes

- **Sanitization Regex Update**: Refactor `sanitizeFileName` in `background.js` to preserve accentuated characters and other common safe characters (like spaces, dashes, and dots) while still stripping characters that are illegal in filenames across major operating systems (Windows, macOS, Linux).
- **Space Handling**: Ensure spaces are either preserved or consistently handled (e.g., converted to underscores if preferred, but currently they are converted to underscores by the catch-all regex).

## Capabilities

### Modified Capabilities
- `smart-archive-naming`: The system SHALL preserve accentuated characters and other safe non-ASCII symbols in the generated ZIP filename while ensuring compatibility with common operating systems.

## Impact

- `background.js`: Modification of the `sanitizeFileName` utility function.
