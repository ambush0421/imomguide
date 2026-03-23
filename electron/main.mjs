import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, BrowserWindow } from 'electron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const windowIconPath = path.join(__dirname, 'assets', 'app-icon.ico')

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1480,
    height: 980,
    minWidth: 1220,
    minHeight: 780,
    autoHideMenuBar: true,
    title: '마곡 코드찾기',
    icon: windowIconPath,
    backgroundColor: '#0B1020',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  const rendererUrl = process.env.ELECTRON_RENDERER_URL

  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
    return mainWindow
  }

  void mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  return mainWindow
}

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
