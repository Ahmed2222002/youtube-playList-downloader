import { app, BrowserWindow, dialog, shell } from "electron";
import path from "path";
import fs from "fs";
import { ipcMainHandle, ipcWebContentsSend, isDev } from "./util.js";
import { getPreloadPath, getUIPath, getIconPath } from "./pathResolver.js";
import {
  fetchVideoOrPlaylistInfo,
  downloadSingleVideo,
  type DownloadVideoOptions,
} from "./downloader.js";
import dotenv from "dotenv";

dotenv.config();

let mainWindow: BrowserWindow | null = null;

function getDefaultDownloadDir() {
  const defaultDir = path.join(app.getPath("downloads"), "YouTube Downloads");
  if (!fs.existsSync(defaultDir)) {
    try {
      fs.mkdirSync(defaultDir, { recursive: true });
    } catch {
      return app.getPath("downloads");
    }
  }
  return defaultDir;
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "YouTube Playlist Downloader",
    minWidth: 1000,
    minHeight: 700,
    width: 1240,
    height: 860,
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: getIconPath(),
  });

  if (isDev().isDev) {
    mainWindow.loadURL(`http://localhost:${isDev().port}`);
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // Handle fetching video/playlist info
  ipcMainHandle("fetchVideoInfo", async (_event, url: string) => {
    return await fetchVideoOrPlaylistInfo(url);
  });

  // Handle folder selection dialog
  ipcMainHandle("selectFolder", async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Select Download Destination Folder",
      defaultPath: getDefaultDownloadDir(),
      properties: ["openDirectory", "createDirectory"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // Handle get default download path
  ipcMainHandle("getDefaultDownloadPath", () => {
    return getDefaultDownloadDir();
  });

  // Handle opening directory in file manager
  ipcMainHandle("openFolder", async (_event, folderPath: string) => {
    const targetPath = folderPath || getDefaultDownloadDir();
    if (fs.existsSync(targetPath)) {
      await shell.openPath(targetPath);
      return true;
    }
    return false;
  });

  // Handle video download
  ipcMainHandle(
    "downloadVideo",
    async (_event, options: DownloadVideoOptions) => {
      if (!mainWindow) {
        return { success: false, error: "Window not available" };
      }

      try {
        await downloadSingleVideo(options, (progress) => {
          if (!mainWindow || mainWindow.isDestroyed()) return;

          ipcWebContentsSend("videoDownloadProgress", mainWindow.webContents, {
            url: options.url,
            percentage: progress.percentage,
            speed_str: progress.speed_str,
            eta_str: progress.eta_str,
            status: "downloading",
          });
        });

        if (mainWindow && !mainWindow.isDestroyed()) {
          ipcWebContentsSend("videoDownloadProgress", mainWindow.webContents, {
            url: options.url,
            percentage: 100,
            speed_str: "Done",
            eta_str: "0s",
            status: "completed",
          });
        }

        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error downloading ${options.url}:`, errorMessage);

        if (mainWindow && !mainWindow.isDestroyed()) {
          ipcWebContentsSend("videoDownloadProgress", mainWindow.webContents, {
            url: options.url,
            percentage: 0,
            status: "error",
            error: errorMessage,
          });
        }

        return { success: false, error: errorMessage };
      }
    },
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
