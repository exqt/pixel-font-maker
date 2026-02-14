declare var VERSION: string;
declare var COMMITHASH: string;
declare var BRANCH: string;

interface ElectronAPI {
  openProject: () => Promise<{ filePath: string; data: string } | null>;
  saveFile: (defaultName: string, filters: { name: string; extensions: string[] }[]) => Promise<string | null>;
  openFont: () => Promise<{ filePath: string; buffer: ArrayBuffer } | null>;
  writeFile: (filePath: string, data: ArrayBuffer | string) => Promise<boolean>;
  readAsset: (assetPath: string) => Promise<ArrayBuffer>;

  onBeforeClose: (callback: () => void) => void;
  confirmClose: () => void;

  onMenuOpenProject: (callback: () => void) => void;
  onMenuSaveProject: (callback: () => void) => void;
  onMenuExport: (callback: () => void) => void;
  onMenuUndo: (callback: () => void) => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
