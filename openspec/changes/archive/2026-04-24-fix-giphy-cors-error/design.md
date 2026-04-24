## Context

The current `fetchAndSendAsset` function in `payload.js` unconditionally adds the Teams authentication token and uses `credentials: 'include'`. While necessary for Teams' own image servers, this violates CORS policies on external servers like Giphy that use `Access-Control-Allow-Origin: *`.

## Goals / Non-Goals

**Goals:**
- Fix CORS errors when fetching Giphy GIFs.
- Maintain successful authentication for Teams-hosted images.

**Non-Goals:**
- Adding a complex domain whitelist. A simple hostname check is sufficient.

## Decisions

### 1. Selective Authentication Logic
We will add a helper function `isInternalDomain(url)` in `payload.js`.
- **Criteria**: If the URL contains `teams.microsoft.com` or `microsoft.com`.
- **Effect**: If true, send token and `credentials: 'include'`. If false, send neither and use `credentials: 'omit'`.

### 2. Implementation in `payload.js`
The `fetchAndSendAsset` function will be updated to:
```javascript
var isInternal = url.indexOf('teams.microsoft.com') !== -1 || url.indexOf('microsoft.com') !== -1;
var fetchOptions = {
  credentials: isInternal ? 'include' : 'omit'
};
if (isInternal && token) {
  headers['Authorization'] = 'Bearer ' + token;
}
```

## Risks / Trade-offs

- **[Risk]** Some internal Microsoft assets might use a different domain not covered by the check.
- **[Mitigation]** The check covers the known problematic and required domains. We can expand the list if other `401` errors appear.
