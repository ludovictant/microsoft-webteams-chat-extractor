## Why

The current "Single Big HTML" export strategy causes significant memory issues and browser crashes when handling large chat histories (5,000+ messages). Storing full DOM nodes in memory and embedding large amounts of Base64 data leads to excessive RAM usage and exceeds message-passing limits in Chrome. A more robust, pipeline-oriented architecture is required to ensure reliability, reduce memory footprint, and provide high-quality archives for large datasets.

## What Changes

- **Background Pipeline Architecture**: Shift core logic (asset fetching, file generation) to a persistent Service Worker.
- **Batch Processing**: The content script will stream message data in small batches (e.g., 10 messages) to the background script, immediately freeing memory.
- **ZIP-Only Export**: **BREAKING** Transition from single HTML files to a comprehensive ZIP archive containing multiple formats.
- **Multi-Format Export**: Include HTML, Markdown, and CSV versions of the transcript in every ZIP.
- **Local Asset Linking**: Store images and avatars as separate binary files within the ZIP, referencing them locally in the HTML/Markdown files.
- **Sanitized Asset Naming**: Implement deterministic naming for avatars (`avatar_AuthorName.png`) and message images (`msg_YYYYmmDD.HHMMSS_ID_Index.png`).

## Capabilities

### New Capabilities
- `pipeline-extraction`: Asynchronous, batch-based data extraction from the Teams DOM.
- `background-coordinator`: Orchestration of data storage, asset fetching, and export generation in the Service Worker.
- `zip-archive-generation`: Packaging transcript data and binary assets into a structured ZIP file.
- `multi-format-rendering`: Generation of HTML, Markdown, and CSV versions of the chat data.

### Modified Capabilities
- `author-avatar-extraction`: Update to use the new naming convention and local file linking.
- `image-processing-feedback`: Adapt progress reporting to reflect the batch-based background processing.

## Impact

- `manifest.json`: Add `background` service worker declaration.
- `payload.js`: Significant refactor to focus on DOM-to-JSON batch extraction.
- `background.js`: New file implementing the core coordination logic and ZIP generation.
- `popup.js`: Refactor to serve as a status monitor for the background process.
- `jszip.min.js`: New library dependency.
