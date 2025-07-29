import { YtDlp } from 'ytdlp-nodejs';

const ytdlp = new YtDlp();

/**
 * Run this file if the video and audio files are downloaded separately
 */
async function downloadFFmpeg() {
    await ytdlp.downloadFFmpeg();
}

downloadFFmpeg();