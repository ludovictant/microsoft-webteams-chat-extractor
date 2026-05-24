## Context

To measure the impact and performance of the MS Teams Chat Extractor, we need to collect anonymous telemetry. The core design philosophy is "Local-First": all events are recorded to the user's local database immediately, but never leave the machine until explicit consent is granted via a Success Nudge or a Privacy Toggle.

## Goals / Non-Goals

**Goals:**
- Implement anonymous tracking of extraction and download events.
- Create a privacy-first consent flow (Nudge + Toggle).
- Ensure data anonymity via random installation IDs and SHA-256 hashing.
- Efficiently sync accumulated data when opt-in is active.

**Non-Goals:**
- Tracking specific message content, user names, or chat titles.
- Real-time streaming of telemetry (batching is preferred).
- Collecting server-side logs without extension-side consent.

## Decisions

### 1. Identity and Hashing
- **Decision**: Generate a random `instanceId` (UUID) stored in `chrome.storage.local` on installation.
- **Rationale**: Allows distinguishing different installations without linkability to personal accounts.
- **Hashing**: Use `SHA-256(instanceId + teamsId)` for conversation hashes to ensure that the same chat across different users produces different anonymous hashes.

### 2. Database Schema: `telemetry` Store
- **Decision**: Add a new store to `TeamsExtractorDB`.
- **Structure**:
  ```javascript
  {
    id: integer (autoIncrement),
    timestamp: timestamp,
    event_type: "extraction" | "download",
    instance_id_hash: string,
    conv_id_hash: string,
    event_source: "live_session" | "history_list",
    extraction_scope: "7_days" | "30_days" | "90_days" | "all" | "incremental",
    message_count: integer,
    status: "success" | "error" | "aborted",
    is_synced: boolean (default false)
  }
  ```

### 3. Opt-in Flow
- **Decision**: "Strategy A" (Nudge after first success) for high conversion, and "Strategy B" (Permanent Toggle) for total control.
- **Storage**: Store `telemetryOptIn` (boolean) and `hasInteractedWithNudge` (boolean) in `chrome.storage.local`.

### 4. Background Sync Engine
- **Decision**: A function `syncTelemetry()` that fetches all records where `is_synced === false`.
- **Trigger**:
  - When the Toggle is switched to ON.
  - Periodic alarm (once per 24h).
  - Immediately after a successful download if opt-in is already ON.
- **Endpoint**: Placeholder URL `https://api.teams-extractor.com/v1/telemetry` (to be updated with actual server).

## Risks / Trade-offs

- **[Risk] User Suspicion** → **Mitigation**: Clear, transparent messaging in the nudge and privacy section. Explain that no text is ever sent.
- **[Risk] Sync Failure** → **Mitigation**: `is_synced` flag ensures data is retryable.
- **[Risk] IndexedDB Overhead** → **Mitigation**: Telemetry records are tiny. We will purge records older than 90 days after successful sync.
