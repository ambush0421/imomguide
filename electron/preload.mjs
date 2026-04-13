import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('magokDesktop', {
  openDevTools: () => ipcRenderer.invoke('magok:open-devtools'),
})
