const fs = require('fs');
const path = require('path');

async function setupBin() {
  const binDir = path.join(__dirname, '..', 'bin');
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const isWin = process.platform === 'win32';
  const ytdlpName = isWin ? 'yt-dlp.exe' : 'yt-dlp';
  const ffmpegName = isWin ? 'ffmpeg.exe' : 'ffmpeg';

  const ytdlpDest = path.join(binDir, ytdlpName);
  const ffmpegDest = path.join(binDir, ffmpegName);

  // 1. Ensure yt-dlp binary is in bin/
  if (!fs.existsSync(ytdlpDest)) {
    const ytdlpSource = path.join(__dirname, '..', 'node_modules', 'ytdlp-nodejs', 'bin', ytdlpName);
    if (fs.existsSync(ytdlpSource)) {
      console.log(`[setupBin] Copying ${ytdlpName} to bin/...`);
      fs.copyFileSync(ytdlpSource, ytdlpDest);
    } else {
      console.warn(`[setupBin] Warning: ${ytdlpName} not found in node_modules/ytdlp-nodejs/bin.`);
    }
  } else {
    console.log(`[setupBin] ${ytdlpName} already present in bin/.`);
  }

  // 2. Ensure ffmpeg binary is in bin/
  if (!fs.existsSync(ffmpegDest)) {
    console.log(`[setupBin] ${ffmpegName} not found in bin/. Downloading via ytdlp-nodejs...`);
    try {
      const { YtDlp } = require('ytdlp-nodejs');
      const ytdlp = new YtDlp();
      const downloadedPath = await ytdlp.downloadFFmpeg();
      if (downloadedPath && fs.existsSync(downloadedPath)) {
        console.log(`[setupBin] Copying ffmpeg from ${downloadedPath} to bin/...`);
        fs.copyFileSync(downloadedPath, ffmpegDest);
      }
    } catch (err) {
      console.warn(`[setupBin] Could not auto-download ffmpeg: ${err.message}`);
      console.warn(`[setupBin] Please manually place ${ffmpegName} inside the bin/ directory.`);
    }
  } else {
    console.log(`[setupBin] ${ffmpegName} already present in bin/.`);
  }

  console.log('[setupBin] Binaries ready for packaging.');
}

if (require.main === module) {
  setupBin().catch((err) => {
    console.error('[setupBin] Failed:', err);
    process.exit(1);
  });
}

module.exports = setupBin;
