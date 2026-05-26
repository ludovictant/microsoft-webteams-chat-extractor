## Context

The extension's side panel has grown organically, leading to a densification of options and slightly ambiguous labels. We are consolidating the extraction triggers to focus on the most relevant time ranges and clarifying the purpose of the telemetry toggle. We also want to ensure that local storage, a core performance and safety feature, is enabled by default.

## Goals / Non-Goals

**Goals:**
- Reduce the number of extraction buttons from 5 to 3 (Recent, 30 days, All).
- Clarify that the "Privacy" toggle is specifically for anonymous stats sharing.
- Ensure "Local storage" is the standard operational mode.

**Non-Goals:**
- Redesigning the entire side panel layout or color scheme.
- Changing the underlying extraction logic (beyond consolidating triggers).

## Decisions

### 1. Labeling Update
- **Decision**: Change "Privacy" text to "Stats sharing" in the footer.
- **Rationale**: "Privacy" is too broad and can be interpreted as general privacy settings. "Stats sharing" accurately describes the opt-in for telemetry.

### 2. Trigger Consolidation
- **Decision**: Remove buttons for 7 days and 90 days (3 months).
- **Rationale**: Most users either want the very latest messages (Recent), a standard monthly window (30 days), or the full history (All). Consolidating triggers reduces clutter.

### 3. Local Storage Defaults
- **Decision**: Set the default state of `localStorageEnabled` to `true` in both the UI and the persistence logic.
- **Rationale**: Local storage provides significant benefits for data safety and extraction speed.

## Risks / Trade-offs

- **[Risk] User confusion for missing options** → **Mitigation**: The "All" and "30 days" options cover the majority of use cases. Users who specifically needed 7 or 90 days can still use "All" or "30 days" as a workaround.
- **[Risk] Local Storage overhead** → **Mitigation**: IndexedDB is designed for larger datasets, and the current implementation handles storage efficiently.
