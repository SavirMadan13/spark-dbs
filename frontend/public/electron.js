const path = require('path');
const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');

const isDev = !app.isPackaged;

let pyProc = null;
console.log('dirname: ', __dirname);
console.log('here');
console.log(app.isPackaged);
console.log('Starting Electron main process');

function startPythonServerDev() {
  const pythonPath = path.join(__dirname, '..', '..', '.venv', 'bin', 'python'); // your venv
  const scriptPath = path.join(__dirname, '..', '..', 'backend', 'main.py');

  pyProc = spawn(pythonPath, [scriptPath], {
    shell: true,
  });

  pyProc.stdout.on('data', (data) => {
    console.log(`[PYTHON STDOUT] ${data.toString()}`);
  });

  pyProc.stderr.on('data', (data) => {
    console.error(`[PYTHON STDERR] ${data.toString()}`);
  });

  pyProc.on('exit', (code) => {
    console.log(`[PYTHON EXITED] code=${code}`);
  });
}

function startPythonServerPackaged() {
  const pythonPath = '/Users/savirmadan/Development/spark-dbs/.venv/bin/python'; // your venv
  const scriptPath = '/Users/savirmadan/Development/spark-dbs/backend/main.py';

  pyProc = spawn(pythonPath, [scriptPath], {
    shell: true,
  });

  pyProc.stdout.on('data', (data) => {
    console.log(`[PYTHON STDOUT] ${data.toString()}`);
  });

  pyProc.stderr.on('data', (data) => {
    console.error(`[PYTHON STDERR] ${data.toString()}`);
  });

  pyProc.on('exit', (code) => {
    console.log(`[PYTHON EXITED] code=${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // In production, load the built index.html from the build directory
    win.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
  }

  win.webContents.openDevTools(); // Enable DevTools for debugging
}

app.whenReady().then(() => {
  if (isDev) startPythonServerDev();
  if (!isDev) startPythonServerPackaged();
  createWindow();
  console.log('Electron app is ready');
});

app.on('will-quit', () => {
  if (pyProc) pyProc.kill();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});