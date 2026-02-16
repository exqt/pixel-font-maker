import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openProject: () => ipcRenderer.invoke('dialog:open-project'),
  saveFile: (defaultName: string, filters: { name: string; extensions: string[] }[]) =>
    ipcRenderer.invoke('dialog:save-file', defaultName, filters),
  openFont: () => ipcRenderer.invoke('dialog:open-font'),
  writeFile: (filePath: string, data: ArrayBuffer | string) =>
    ipcRenderer.invoke('fs:write-file', filePath, data),
  readAsset: (assetPath: string) => ipcRenderer.invoke('fs:read-asset', assetPath),

  onBeforeClose: (callback: () => void) => {
    ipcRenderer.on('before-close', () => callback());
  },
  confirmClose: () => ipcRenderer.send('close-confirmed'),

  onMenuOpenProject: (callback: () => void) => {
    ipcRenderer.on('menu-open-project', () => callback());
  },
  onMenuSaveProject: (callback: () => void) => {
    ipcRenderer.on('menu-save-project', () => callback());
  },
  onMenuExport: (callback: () => void) => {
    ipcRenderer.on('menu-export', () => callback());
  },
  onMenuUndo: (callback: () => void) => {
    ipcRenderer.on('menu-undo', () => callback());
  },
  onMenuRedo: (callback: () => void) => {
    ipcRenderer.on('menu-redo', () => callback());
  },
});
