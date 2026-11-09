# YouTube Playlist Downloader

A clean, modern, and powerful desktop application built with Electron, React, TypeScript, Tailwind CSS, and `ytdlp-nodejs` to easily download entire YouTube playlists or individual videos.

## Features

- **Playlist & Single Video Support**: Paste any YouTube playlist or video link to automatically inspect and list all entries.
- **Video & Audio Modes**:
  - Download full HD, 2K, or 4K MP4 videos (with merged video & audio via FFmpeg).
  - Extract crisp MP3 audio tracks.
- **Flexible Quality Selection**: Choose from 4K, Full HD (1080p), HD (720p), SD, or best available quality.
- **Batch & Selective Downloads**: Select individual videos or download the entire playlist with a single click.
- **Real-Time Progress & Statistics**: View live download percentage, transfer speed, and estimated time remaining (ETA).
- **Customizable Output Directory**: Easily choose or change your download folder, with one-click access to open it in Explorer.
- **Multilingual & RTL Support**: Full English and Arabic interface with right-to-left layout support.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- `yt-dlp` and `ffmpeg` binaries (automatically managed in `bin/` or `node_modules/ytdlp-nodejs/bin`)

### Installation

```bash
npm install
```

### Development

Run both the Vite React server and Electron concurrently:

```bash
npm run dev
```

### Build

Compile TypeScript and build the React frontend:

```bash
npm run build
```

Package executable installers:

```bash
npm run dist:win
```
