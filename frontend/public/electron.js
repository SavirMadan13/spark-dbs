// main.js
const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');
const { app, BrowserWindow } = require('electron');

const isDev = !app.isPackaged;

let pyProc = null;

function log(...args) {
  console.log('[MAIN]', ...args);
}
function logErr(...args) {
  console.error('[MAIN]', ...args);
}

/** Get the path to the bundled backend executable. */
function getBackendExecutablePath() {
  if (isDev) {
    // In development, use the built executable from backend/dist
    const repoRoot = path.resolve(__dirname, '..', '..');
    const exeName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    return path.join(repoRoot, 'backend', 'dist', exeName);
  } else {
    // In production, the backend executable is bundled in resources
    const exeName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    return path.join(process.resourcesPath, 'backend', exeName);
  }
}

/** Start the backend server using the bundled executable. */
function startBackendServer() {
  const backendPath = getBackendExecutablePath();
  
  if (!fs.existsSync(backendPath)) {
    throw new Error(`Backend executable not found at: ${backendPath}`);
  }

  log('Starting backend server:', backendPath);
  
  // Make sure the executable has proper permissions on Unix systems
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(backendPath, '755');
    } catch (err) {
      logErr('Failed to set executable permissions:', err);
    }
  }

  pyProc = spawn(backendPath, [], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  pyProc.stdout.on('data', (d) => process.stdout.write(`[BACKEND STDOUT] ${d}`));
  pyProc.stderr.on('data', (d) => process.stderr.write(`[BACKEND STDERR] ${d}`));

  pyProc.on('exit', (code) => {
    log(`[BACKEND EXITED] code=${code}`);
    pyProc = null;
  });

  pyProc.on('error', (err) => {
    logErr('Backend process error:', err);
    pyProc = null;
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { contextIsolation: true },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    // win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // In production, load from the build directory that electron-builder packages
    // Since build/** is included in files, it should be relative to the app directory
    const indexPath = path.join(__dirname, '..', 'build', 'index.html');
    log('Loading frontend from:', indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  try {
    startBackendServer();
  } catch (e) {
    logErr('Backend server startup failed:', e);
  }
  createWindow();
  log('Electron app is ready');
});

app.on('will-quit', () => {
  if (pyProc) pyProc.kill();
});

app.on('window-all-closed', () => {
  log('All windows closed');
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
