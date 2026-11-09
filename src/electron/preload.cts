import electron from "electron";

electron.contextBridge.exposeInMainWorld("electron", {
  fetchVideoInfo: (url: string) => ipcInvoke("fetchVideoInfo", url),
  selectFolder: () => ipcInvoke("selectFolder"),
  getDefaultDownloadPath: () => ipcInvoke("getDefaultDownloadPath"),
  downloadVideo: (options: DownloadVideoOptions) => ipcInvoke("downloadVideo", options),
  openFolder: (path: string) => ipcInvoke("openFolder", path),
  onDownloadProgress: (callback: (data: DownloadProgressEvent) => void) =>
    ipcOn("videoDownloadProgress", (data) => {
      callback(data);
    }),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventArgMapping>(
  key: Key,
  args?: EventArgMapping[Key],
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
