import { YtDlp } from 'ytdlp-nodejs';
import { QualityOptions, VideoQuality } from 'ytdlp-nodejs/dist/index.d';

const ytdlp = new YtDlp();

async function downloadVideo(
  url: string,
  filter: keyof QualityOptions,
  quality: VideoQuality,
  outputPath: string,
  type?: "mp4" | "webm" | "aac" | "flac" | "mp3" | "m4a" | "opus" | "vorbis" | "wav" | "alac" | "mkv" | "ogg" | "flv" | undefined,
  fileName?: string,
  onProgress?: (progress: any) => void) {
  try {
    const output = await ytdlp.downloadAsync(
      url,
      {

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
        
      }
    );

    console.log('Download completed:', output);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function videoInfo(url: string) {
  const videoInfo = await ytdlp.getInfoAsync(url);

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
    }
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
}


export { videoInfo, downloadVideo }






