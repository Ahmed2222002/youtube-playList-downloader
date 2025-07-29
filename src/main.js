const { app, BrowserWindow,Menu } = require('electron/main')
const { ipcMain, dialog } = require('electron')
const { videoInfo , downloadVideo } = require('./downloader.js')
const { buildMenuBar } = require('../UI/UIFactory.js')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'Free Playlist Downloader',
    minWidth: 400,
    minHeight: 200,
    width: 800,
    height: 600,
    icon: path.join(__dirname,'..','assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    show: false
  })

  win.loadFile(path.join(__dirname,'..','UI', 'index.html'))

  Menu.setApplicationMenu(buildMenuBar());

  win.on('ready-to-show', () => {
    win.show()
  })
}

ipcMain.handle('fetch-video-info', async (event, url) => {
  try {
  
    const info = await videoInfo(url);
    return info;
  
    } catch (error) {
      console.error('Error:', error.message);
    }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });


  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  } else {
    return null;
  }
});

ipcMain.handle('download-video', async (event, url, filter, quality, outputPath, type, fileName) => {
  try {
    await downloadVideo(url, filter, quality, outputPath, type, fileName, (progress) => {
      event.sender.send('video-download-progress', {
        url,
        progress
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
});


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})