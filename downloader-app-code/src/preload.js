const { contextBridge, ipcRenderer } = require('electron');
const { buildVideosTable } = require('../UI/UIFactory.js');


contextBridge.exposeInMainWorld('api', {
  fetchVideoInfo: (url) => ipcRenderer.invoke('fetch-video-info', url),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  downloadVideo: (url, filter, quality, outputPath, type, fileName) => ipcRenderer.invoke('download-video', url, filter, quality, outputPath, type, fileName),
  onDownloadProgress: (callback) => ipcRenderer.on('video-download-progress', (event, data) => callback(data))
});

contextBridge.exposeInMainWorld('ui', {
  buildVideosTable: (info, outputElement) => buildVideosTable(info, outputElement)
});



