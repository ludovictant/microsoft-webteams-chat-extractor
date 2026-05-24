# Telemetry JSON Payload Documentation

This document defines the schema for the anonymous telemetry data sent by the extension to the remote server. This payload is transmitted via a `POST` request to the configured telemetry endpoint.

## Request Specification

- **HTTP Method**: `POST`
- **Content-Type**: `application/json`
- **Body Structure**: A JSON **Array** of Event Objects.

## Event Object Schema

| Field Name | Data Type | Description | Values / Format |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Local primary key from IndexedDB. | e.g., `42` |
| `timestamp` | Integer | Unix epoch time in milliseconds. | e.g., `1716550000000` |
| `event_type` | String | Category of the recorded action. | `"extraction"`, `"download"` |
| `instance_id_hash` | String | SHA-256 hash of the unique installation ID. | 64-char hex string |
| `conv_id_hash` | String \| Null | SHA-256 hash of (instanceId + teamsId). | 64-char hex string |
| `event_source` | String | UI origin of the action. | `"live_session"`, `"history_list"` |
| `extraction_scope` | String | Requested time range or mode. | `"7_days"`, `"30_days"`, `"90_days"`, `"all"`, `"incremental"` |
| `message_count` | Integer | Number of messages in the event. | e.g., `350` |
| `status` | String | Outcome of the event. | `"success"`, `"error"`, `"aborted"`, `"stopped"` |
| `is_synced` | Integer | Client-side sync flag (always 0 in payload). | `0` |

## Implementation Notes

### 1. Batching
The server must handle arrays containing multiple event objects. The extension bundles all unsynced local records into a single request to minimize network traffic.

### 2. Idempotency & Deduplication
To prevent duplicate records on the server (e.g., if a sync response is lost but the data was saved), the server should treat the combination of `(instance_id_hash, id)` as a unique identifier.

### 3. Response Handling
The extension marks local records as synced only upon receiving a successful `2xx` HTTP status code. Any error code will cause the extension to retry sending the same data in the next sync cycle.

## Example Payload

```json
[
  {
    "id": 14,
    "timestamp": 1716552104500,
    "event_type": "extraction",
    "instance_id_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "conv_id_hash": "b4a8e2...[64 chars]",
    "event_source": "live_session",
    "extraction_scope": "30_days",
    "message_count": 342,
    "status": "success",
    "is_synced": 0
  },
  {
    "id": 15,
    "timestamp": 1716552110200,
    "event_type": "download",
    "instance_id_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "conv_id_hash": "b4a8e2...[64 chars]",
    "event_source": "live_session",
    "extraction_scope": "30_days",
    "message_count": 342,
    "status": "success",
    "is_synced": 0
  }
]
```
