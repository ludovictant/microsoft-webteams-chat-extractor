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
  - **CSV**: A data-ready format for spreadsheets (Date, Author, Content).
- **Local Assets**: All images and avatars are downloaded as binary files into an `images/` folder within the ZIP, ensuring perfect offline viewing without Base64 bloat.
- **Background Pipeline**: Uses a robust Service Worker architecture to handle large chat histories (5,000+ messages) without crashing the tab or losing data.
- **Real-time Progress**: Visual progress bar and "date depth" indicator show exactly how far back the scanner has reached.
- **Automated Workflow**: Automatically triggers the download once processing is complete and allows immediate "Reset" to start a new extraction.
- **Privacy First**: No data leaves your browser. All extraction and file generation happens locally.

## Installation

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the extension folder

## Usage

1. Log into Microsoft Teams on the web at [teams.microsoft.com](https://teams.microsoft.com)
2. Open the chat or channel conversation you want to extract
3. Click the purple chat icon in the Chrome toolbar
4. Choose a time range (e.g., "Last 7 days")
5. Wait for the extension to scroll back and collect messages. The popup will show a progress bar and the date currently being reached.
6. Once image processing finishes, the ZIP archive will **automatically download** to your computer.
7. Click **Start New Extraction** to clear the memory and begin another session.

## How it works

The extension uses a high-performance **data pipeline** between the page and a background worker:

1. **Detection**: Dynamically identifies the conversation type and locates the message container.
2. **Initial Sync**: Automatically scrolls to the absolute bottom of the chat first to ensure the capture starts with the most recent messages.
3. **Batched Extraction**: As it scrolls up, the content script extracts lightweight JSON data and streams it in batches of 10 to a persistent **Service Worker**. This keeps memory usage low even for massive chats.
4. **Background Asset Processing**:
   - The content script fetches images and avatars directly from the authenticated page context to bypass CORS/Auth restrictions.
   - Assets are sent as binary chunks to the Service Worker.
   - Uses deterministic, sanitized naming: `avatar_Author.png` and `msg_YYYYmmDD.HHMMSS_ID.png`.
5. **Finalization**: The Service Worker uses **JSZip** to package the HTML, Markdown, and CSV files along with the `images/` folder into a single archive.

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
