## Why

When exporting multiple chat transcripts, it can be difficult to distinguish between files if they only use the chat title. Including the actual date range of the extracted messages in the filename (e.g., `ChatTitle_20240424.100000_20240424.180000.zip`) provides immediate context about the contents of the archive without having to unzip and open it.

## What Changes

- **Filename Format Update**: The exported ZIP file will now include a suffix with the start and end datetimes of the messages in the extraction.
- **Datetime Formatting**: A standardized `YYYYmmDD.HHMMSS` format will be used for these timestamps.
- **Robust Fallbacks**: If a message timestamp is unknown, the system will use the Unix Epoch (`19700101.000000`) as a fallback to maintain valid filename structures.

## Capabilities

### New Capabilities
- `smart-archive-naming`: Dynamically generate archive filenames based on the temporal range of the extracted data.

### Modified Capabilities
- `zip-archive-generation`: Update the final filename generation logic to include the date range suffix.

## Impact

- `background.js`: Modify the `DOWNLOAD_ZIP` and status reporting logic to calculate the min/max timestamps and format them for the final filename.
