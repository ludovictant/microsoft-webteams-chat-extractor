# Microsoft Teams Chat Extractor

![Transcript Icon](./icons/chat-128.png)

A Chrome extension to extract chat transcripts from Microsoft Teams Web (v2).

Microsoft Teams does not support easily copying or exporting chat transcripts. This extension lets you pull them out with a couple of clicks, preserving images and formatting.

## Features

- **Standard & Channel Support**: Works with both private/group chats AND Teams Channels.
- **Flexible Time Ranges**: Extract currently loaded messages instantly, or auto-scroll back to load messages from the **last 24 hours, 7 days, 30 days, 3 months**, or **all history**.
- **Embedded Images**: Converts Teams-hosted images (including lazy-loaded and Giphy images) to **Base64 strings** so they display correctly in the exported HTML file even when offline.
- **Teams-like Export**: Exported HTML features a modern design mimicking the Microsoft Teams interface, with Segoe UI typography and rounded message blocks.
- **Interactive Control**: Includes a **Stop Extraction** button to halt long-running scrolls and export what has been collected so far.
- **Smart Filenames**: Automatically generates filenames using the chat title and the **datetime range** of the collected messages (`Chat_YYYYmmDD.HHMMSS_YYYYmmDD.HHMMSS.html`).
- **Data Integrity**: Uses accumulative collection to ensure no messages are lost due to Teams' virtualized list removal during scrolling.
- **Privacy First**: No data leaves your browser. All extraction happens locally.

## Installation

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the extension folder

## Usage

1. Log into Microsoft Teams on the web at [teams.microsoft.com](https://teams.microsoft.com)
2. Open the chat or channel conversation you want to extract
3. Click the purple chat icon in the Chrome toolbar
4. Choose a time range and sort order
5. Wait for the extension to scroll back and collect messages (the popup shows progress and the active range)
6. Use the **Copy**, **HTML**, or **Markdown** buttons in the toolbar to export the transcript

## How it works

The extension injects a content script into the active Teams tab that:

1. **Detection**: Dynamically identifies the conversation type (Private Chat or Channel) and locates the appropriate message container (`#chat-pane-list` or `[data-tid="channel-pane-runway"]`).
2. **Initial Sync**: Scrolls to the bottom of the chat first to ensure it captures the most recent messages.
3. **Accumulative Collection**: As it scrolls up (using simulated 'Home' key presses and `scrollTop` adjustments), it clones and saves every unique message into a memory map. This prevents data loss as Teams removes off-screen messages from the DOM.
4. **Data Extraction**:
   - Uses multi-strategy selectors for authors and timestamps across different Teams DOM versions.
   - Implements a retry mechanism for images, prioritizing high-resolution sources (`data-gallery-src`, `data-orig-src`) over temporary blobs.
   - Cleans exported HTML by stripping Teams-specific internal classes and attributes for a lightweight output.
5. **Finalization**: Sorts messages chronologically and calculates the final timestamp range for the filename.

## Permissions

- **activeTab** -- access the current tab only when you click the extension icon
- **scripting** -- inject the extraction script into the Teams page

No data leaves your browser. The extension has no background service worker, makes no network requests, and stores nothing.

## Authors

- Ingo Muschenetz
- Ludovic Tant

## License

[MIT](LICENSE)
