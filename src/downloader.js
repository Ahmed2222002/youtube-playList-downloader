"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoInfo = videoInfo;
exports.downloadVideo = downloadVideo;
const path = require("path");
const fs = require("fs");
const ytdlp_nodejs_1 = require("ytdlp-nodejs");

function getBinaryPaths() {
    let isPackaged = false;
    try {
        const { app } = require("electron");
        if (app && app.isPackaged) {
            isPackaged = true;
        }
    } catch (e) {
        // Not running in electron main
    }

    const possibleBinDirs = [];
    if (isPackaged && process.resourcesPath) {
        possibleBinDirs.push(path.join(process.resourcesPath, "bin"));
    }
    possibleBinDirs.push(path.join(__dirname, "..", "bin"));
    possibleBinDirs.push(path.join(process.cwd(), "bin"));
    possibleBinDirs.push(path.join(__dirname, "..", "node_modules", "ytdlp-nodejs", "bin"));

    let binaryPath;
    let ffmpegPath;

    for (const dir of possibleBinDirs) {
        const ytdlpCandidate = path.join(dir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
        if (!binaryPath && fs.existsSync(ytdlpCandidate)) {
            binaryPath = ytdlpCandidate;
        }
        const ffmpegCandidate = path.join(dir, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
        if (!ffmpegPath && fs.existsSync(ffmpegCandidate)) {
            ffmpegPath = ffmpegCandidate;
        }
    }

    return { binaryPath, ffmpegPath };
}

const { binaryPath, ffmpegPath } = getBinaryPaths();
const ytdlp = new ytdlp_nodejs_1.YtDlp({
    binaryPath,
    ffmpegPath
});
function downloadVideo(url, filter, quality, outputPath, type, fileName, onProgress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const output = yield ytdlp.downloadAsync(url, {
                format: {
                    filter: filter,
                    quality: quality,
                    type: type
                },
                onProgress: (progress) => {
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                paths: outputPath,
                abortOnError: true,
                output: fileName,
            });
            console.log('Download completed:', output);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
function videoInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const videoInfo = yield ytdlp.getInfoAsync(url);
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (videoInfo._type === 'video') {
            const i = Math.floor(Math.log(videoInfo.filesize_approx) / Math.log(1024));
            const filesize_approx = (videoInfo.filesize_approx / Math.pow(1024, i)).toFixed(2);
            return {
                title: videoInfo.fulltitle,
                thumbnail: videoInfo.thumbnail,
                duration: videoInfo.duration_string,
                size: `${filesize_approx} ${sizes[i]}`,
                url: videoInfo.original_url
            };
        }
        else if (videoInfo._type === 'playlist') {
            const playlistVideos = videoInfo.entries;
            const videos = playlistVideos.map((video) => {
                const duration = video.duration;
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const seconds = duration % 60;
                return {
                    title: video.title,
                    thumbnail: video.thumbnails[video.thumbnails.length - 1].url,
                    duration: `${hours} : ${minutes} : ${seconds}`,
                    url: video.url
                };
            });
            return videos;
        }
    });
}
