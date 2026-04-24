## Why

Currently, the extension attempts to include authentication credentials (Bearer token and cookies) for every image fetch request to avoid `401 Unauthorized` errors on Microsoft Teams servers. however, this causes a CORS policy conflict with external providers like Giphy. Giphy's servers use the wildcard `Access-Control-Allow-Origin: *`, which browsers reject when `credentials` is set to `include`. This prevents GIFs and other external images from being correctly downloaded into the ZIP archive.

## What Changes

- **Selective Authentication**: The fetch logic will be updated to only include authentication headers and credentials for internal Microsoft/Teams domains.
- **Anonymous Fetch for External Assets**: Requests to external domains (e.g., `media.giphy.com`) will be performed without the `Authorization` header and with `credentials: 'omit'`.

## Capabilities

### New Capabilities
- `selective-asset-authentication`: Distinguish between internal (Teams) and external assets to apply appropriate security policies during fetching.

### Modified Capabilities
- (none)

## Impact

- `payload.js`: Modify `fetchAndSendAsset` to implement domain-based credential handling.
