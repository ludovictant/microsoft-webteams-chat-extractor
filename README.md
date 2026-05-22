# Microsoft Teams Chat Extractor

![Transcript Icon](./icons/chat-128.png)

A Chrome extension to extract chat transcripts from Microsoft Teams Web (v2).

Microsoft Teams does not support easily copying or exporting chat transcripts. This extension lets you pull them out with a couple of clicks, preserving images and formatting.

## Features

- **Standard & Channel Support**: Works with both private/group chats AND Teams Channels.
- **Robust Time Ranges**: Choose from **7 days, 30 days, 3 months**, or **all history**.
- **Multi-Format Archive**: Generates a comprehensive **ZIP archive** containing:
  - **HTML**: A rich, Teams-like view with local image links.
  - **Markdown**: A clean text version for documentation.
  - **CSV**: A data-ready format for spreadsheets.
  - **JSON**: A structured, machine-readable format with resolved image paths for deep analysis.
- **System Message Extraction**: Correctly identifies and renders membership changes (e.g., "User added User") with dedicated icons and styling.
- **Message Reactions**: Robustly extracts emoji types and counts for all reactions, including your own messages.
- **Local Assets**: All images and avatars (including the connected user's profile) are downloaded as binary files into an `images/` folder within the ZIP, ensuring perfect offline viewing.
- **Background Pipeline**: Uses a high-performance Service Worker architecture to handle massive chat histories (5,000+ messages) without crashing the tab.
- **Resilient Scrolling**:
  - **Incremental Crawling**: Prevents skipping messages in virtualized lists by crawling up pixel-by-pixel.
  - **Adaptive Throttling**: Automatically adjusts wait times to handle slow Teams servers during multi-year extractions.
  - **Manual Scroll Assist**: Detects if Teams is "stuck" and prompts the user to manually nudge the scroll to continue.
- **Real-time Progress**: Visual progress bar and detailed "date depth" indicator (including the year) show exactly how far back the scanner has reached.
- **Flexible Controls**:
  - **Force Stop & Export**: Immediately export all collected data even if the extraction is stalled or processing assets.
  - **Automated Workflow**: Triggers the download once complete and allows immediate "Reset" to start a new session.
- **Privacy First**: No data leaves your browser. All extraction and file generation happens locally.
- **Developer Tools**: Integrated **Debug Mode** for verbose logging and attribute preservation during troubleshooting.

## Installation

Please refer to the [INSTALL.md](./INSTALL.md) file for step-by-step instructions on how to install the extension in Google Chrome.

## Important Usage Notes

- **Do not switch conversations or minimize the Teams window** while the extraction is running. You may switch browser tabs, but the Teams window must remain visible and active.
- **Do not use the tool simultaneously** in different tabs or windows.
- **Virtual Desktop Solutions**: This extension is not compliant with VDI/Virtual Desktop environments.
- **Completion**: If the progress bar seems to "rebound" or get stuck at the oldest message, simply click **Stop current extraction** to finalize and download your archive.

## Usage

1. Log into Microsoft Teams on the web at [teams.microsoft.com](https://teams.microsoft.com)
2. Open the chat or channel conversation you want to extract
3. Click the purple chat icon in the Chrome toolbar
4. Choose a time range (e.g., "Last 7 days")
5. Wait for the extension to scroll back and collect messages. The side panel will show a progress bar and the date currently being reached.
6. Once image processing finishes, the ZIP archive will **automatically download** to your computer.
7. Click **Start New Extraction** to clear the memory and begin another session.

## How it works

The extension uses a high-performance **data pipeline** between the page and a background worker:

1. **Detection**: Dynamically identifies the conversation type and locates the message container.
2. **Initial Sync**: Automatically scrolls to the absolute bottom of the chat first to ensure the capture starts with the most recent messages.
3. **Safe Traversal**: Uses an incremental "crawl" logic to ensure Teams' virtualized list renders every single message, while a `MutationObserver` captures newly appeared nodes.
4. **Batched Extraction**: Extracts structured JSON data and streams it in batches to a persistent **Service Worker** to keep memory usage low.
5. **Background Asset Processing**:
   - The content script fetches images and avatars directly from the authenticated page context to bypass CORS/Auth restrictions.
   - Assets are sent as binary chunks to the Service Worker.
   - Uses deterministic, sanitized naming: `avatar_Author.png` and `msg_YYYYmmDD.HHMMSS_ID.png`.
6. **Finalization**: The Service Worker uses **JSZip** to package the HTML, Markdown, CSV, and JSON files along with the `images/` folder into a single archive.

## Permissions

- **activeTab** -- access the current tab only when you click the extension icon.
- **scripting** -- inject the extraction script into the Teams page.
- **downloads** -- trigger the browser's download dialog for the final archive.

No data leaves your browser. All extraction happens locally.

## Authors

- Ingo Muschenetz
- Ludovic Tant

## License

[MIT](LICENSE)
