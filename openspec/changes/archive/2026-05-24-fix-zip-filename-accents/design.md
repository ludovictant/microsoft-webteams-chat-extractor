## Context

The `sanitizeFileName` function currently uses a very restrictive regex `/[^a-z0-9]/gi` which replaces everything except ASCII letters and numbers with underscores. This is safe but poor for user experience in multilingual environments.

## Goals / Non-Goals

**Goals:**
- Preserve accentuated characters in filenames.
- Preserve spaces, dots, and dashes.
- Strip characters that are definitely illegal on Windows/macOS/Linux.

**Non-Goals:**
- Full Unicode support for extremely rare symbols (focus on common European accents).
- Complex character normalization (NFC/NFD).

## Decisions

### 1. New Sanitization Logic
- **Decision**: Switch from "allow-list only" to "deny-list" or a more inclusive "allow-list".
- **Selected regex**: `/[<>:"\/\\|?*\x00-\x1F]/g` to remove illegal Windows characters and control characters.
- **Refinement**: To keep the filenames clean and consistent with previous behavior while allowing accents, we will use a regex that preserves "word" characters including Unicode ones, and specifically allow spaces/dots/dashes.
- **Proposed regex**: `/[^\p{L}\p{N} \.\-_]/gu`
  - `\p{L}`: Any letter (Unicode-aware).
  - `\p{N}`: Any number (Unicode-aware).
  - ` \.\-_`: Literal space, dot, dash, and underscore.
  - `u` flag: Enable Unicode support in regex.

### 2. Space Handling
- **Decision**: Replace spaces with underscores (`_`).
- **Rationale**: While modern OSes handle spaces, underscores are often preferred for filenames in automated pipelines and provide better cross-platform compatibility without quoting issues.

## Risks / Trade-offs

- **[Risk] Long filenames** → **Mitigation**: Teams titles are usually reasonable, but we will add a secondary trim if the resulting string is extremely long (standard 255 char limit usually applies to the whole path). *Update: For now, we just fix the characters.*
- **[Risk] Browser compatibility** → **Mitigation**: The `u` flag and `\p{L}` property are supported in all modern browsers (Chrome 64+).
