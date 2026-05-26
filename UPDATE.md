# How to update

Since this extension is installed manually (as an "unpacked" extension), it does not update automatically through the Chrome Web Store. Follow these steps to get the latest version.

## Option 1: If you downloaded the ZIP

### 1a. If you remember where you extracted it last time
1. Download the latest source code ZIP from this GitHub repository. [microsoft-teams-chat-extractor.zip](https://github.com/ludovictant/microsoft-webteams-chat-extractor/blob/main/dist/microsoft-teams-chat-extractor.zip](https://github.com/ludovictant/microsoft-webteams-chat-extractor/raw/refs/heads/main/dist/microsoft-teams-chat-extractor.zip)
2. Extract the new files and **overwrite** the files in your existing folder.
3. Open Google Chrome and go to `chrome://extensions`.
4. Find the **Microsoft Teams Chat Extractor** card and click the **Reload** icon (circular arrow).

### 1b. If you DON'T remember where you extracted it last time
1. Open Google Chrome and go to `chrome://extensions`.
2. Find the **Microsoft Teams Chat Extractor** card.
3. Look for the **"Loaded from:"** path listed on the card. This is where your current version lives.
4. Download the latest source code ZIP from this GitHub repository. [microsoft-teams-chat-extractor.zip](https://github.com/ludovictant/microsoft-webteams-chat-extractor/blob/main/dist/microsoft-teams-chat-extractor.zip](https://github.com/ludovictant/microsoft-webteams-chat-extractor/raw/refs/heads/main/dist/microsoft-teams-chat-extractor.zip)
5. Extract the ZIP to a new location of your choice.
6. Go back to `chrome://extensions`.
7. Click **Remove** on the old extension card.
8. Click **Load unpacked** and select your new folder.

## Option 2: If you cloned the repository with Git
1. Open your terminal/command prompt.
2. Navigate to the extension folder.
3. Run `git pull` to fetch the latest changes.
4. Open Google Chrome and go to `chrome://extensions`.
5. Find the **Microsoft Teams Chat Extractor** card.
6. Click the **Reload** icon (the circular arrow) on the extension card.
7. The extension is now updated!

---
**Tip:** You can verify the update by opening the extension popup and checking the version number in the bottom right corner.
