// import {contextBridge, ipcRenderer} from 'electron'
//
// contextBridge.exposeInMainWorld('myAPI', {
//     selectFolder: () => ipcRenderer.invoke('dialog:openDirectory')
// })

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
})
