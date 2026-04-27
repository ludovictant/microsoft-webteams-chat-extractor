## Context

Multiple implementation cycles have introduced slightly different labels for the same logical action: terminating the automated process and initiating the download. This change consolidates these into a single "Stop and Export" label.

## Goals / Non-Goals

**Goals:**
- Unify all "Stop" button labels during active extraction.
- Ensure the disclaimer text in the HTML matches the button text exactly.

**Non-Goals:**
- Changing the underlying logic (the existing `FORCE_STOP_PROCESSING` and `STOP_EXTRACTION` messages will still be sent as appropriate).

## Decisions

- **Universal Label**: Use "Stop and Export" for `extracting`, `stuck`, and `processing` states.
- **Reference in Disclaimer**: Update the `#disclaimerBox` in `popup.html` to reference the button as "Stop and Export".

## Risks / Trade-offs

- [Risk] → Losing the "Force" nuance during the processing phase.
- [Mitigation] → "Stop and Export" is broad enough to imply that the process is being stopped early to get the data, which is accurate for all three states.
