import { ipcMain, WebContents, WebFrameMain, IpcMainInvokeEvent } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
import dotenv from "dotenv";

dotenv.config();

// Checks if you are in development mode
export function isDev() {
  if (process.env.NODE_ENV === "development") {
    const PORT = process.env.PORT;
    if (!PORT) throw new Error("PORT env variable is not set");
    return { isDev: true, port: PORT };
  } else return { isDev: false, port: null };
}

// Making IPC Typesafe
export function ipcMainHandle<Key extends keyof EventArgMapping>(
  key: Key,
  handler: (
    event: IpcMainInvokeEvent,
    args: EventArgMapping[Key]
  ) => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key],
) {
  ipcMain.handle(key, (event, args) => {
    if (event.senderFrame) validateEventFrame(event.senderFrame);

    return handler(event, args);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key],
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev().isDev && new URL(frame.url).host === `localhost:${isDev().port}`)
    return;

  if (frame.url !== pathToFileURL(getUIPath()).toString())
    throw new Error("Malicious event");
}
