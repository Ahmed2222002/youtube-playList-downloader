import { app, BrowserWindow } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath, getUIPath, getIconPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./test.js";
import dotenv from "dotenv";

dotenv.config();

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    // Shouldn't add contextIsolate or nodeIntegration because of security vulnerabilities

    minWidth: 1200, // your minimum size
    minHeight: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
    },
    icon: getIconPath(),
  });

  if (isDev().isDev) mainWindow.loadURL(`http://localhost:${isDev().port}`);
  else mainWindow.loadFile(getUIPath());

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });
});
