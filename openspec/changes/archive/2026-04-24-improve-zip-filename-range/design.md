## Context

The current ZIP filenames only include the sanitized chat title. For better organization and traceability, users need the temporal range of the extracted messages to be part of the filename.

## Goals / Non-Goals

**Goals:**
- Implement dynamic filename generation in `background.js`.
- Use the `YYYYmmDD.HHMMSS` format for start and end dates.
- Handle missing or invalid timestamps with a safe epoch fallback.

**Non-Goals:**
- Changing the internal data structure of the ZIP (files inside remains the same).

## Decisions

### 1. Calculation of Temporal Range
In the `DOWNLOAD_ZIP` case in `background.js`, we will determine the `min` and `max` timestamps from the `extractionData.messages` array before generating the ZIP.
- `startTS = Math.min(...timestamps)`
- `endTS = Math.max(...timestamps)`

### 2. Standardized Formatter
We will reuse and potentially export the `formatFileTS(ts)` helper (currently used for images) to ensure consistency across the entire extension.
- **Fallback**: If `ts` is 0 or invalid, `formatFileTS(0)` will return `19700101.000000`.

### 3. Filename Composition
The final filename will be constructed as:
`${sanitizedTitle}_${formatFileTS(startTS)}_${formatFileTS(endTS)}.zip`

## Risks / Trade-offs

- **[Risk]** Filenames might become very long if the title is long.
- **[Mitigation]** We already sanitize the title. We can truncate the title if it exceeds a certain length if browser filesystem limits become an issue, but standard Teams titles plus suffixes should be safe.
