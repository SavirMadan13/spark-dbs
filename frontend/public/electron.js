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

/** Pick a system Python command to create the venv (no venv yet, so cannot use .venv/python). */
function pickSystemPython() {
  // Windows users often have the launcher "py -3"
  if (process.platform === 'win32') {
    // Prefer the py launcher if present
    try {
      const out = spawnSync('py', ['-3', '--version'], { encoding: 'utf8' });
      if (out.status === 0) return { cmd: 'py', args: ['-3'] };
    } catch { /* ignore */ }
    // Fallback to python3 or python
    return { cmd: 'python', args: [] };
  } else {
    // macOS/Linux
    // Prefer python3, then python
    try {
      const out = spawnSync('python3', ['--version'], { encoding: 'utf8' });
      if (out.status === 0) return { cmd: 'python3', args: [] };
    } catch { /* ignore */ }
    return { cmd: 'python', args: [] };
  }
}

/** Return paths for venv and backend depending on dev vs packaged. */
function resolvePaths() {
  if (isDev) {
    const repoRoot = path.resolve(__dirname, '..', '..'); // adjust if your main.js lives elsewhere
    const venvDir = path.join(repoRoot, '.venv');
    const backendDir = path.join(repoRoot, 'backend');
    const requirementsPath = path.join(backendDir, 'requirements.txt');
    const pythonBin =
      process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
    const scriptPath = path.join(backendDir, 'main.py');
    return { venvDir, backendDir, requirementsPath, pythonBin, scriptPath };
  } else {
    // In production, app resources are read-only. Put venv in userData.
    const runtimeRoot = path.join(app.getPath('userData'), 'pyenv');
    const venvDir = path.join(runtimeRoot, 'venv');
    const pythonBin =
      process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');

    // Your packaged app files land under process.resourcesPath (app.asar).
    // If you bundle backend/requirements.txt and backend/main.py into resources,
    // reference them from there:
    const resourcesRoot = process.resourcesPath; // e.g., .../MyApp.app/Contents/Resources
    const backendDir = path.join(resourcesRoot, 'backend');
    const requirementsPath = path.join(backendDir, 'requirements.txt');
    const scriptPath = path.join(backendDir, 'main.py');

    return { venvDir, backendDir, requirementsPath, pythonBin, scriptPath };
  }
}

/** Create venv if missing. */
function ensureVenv(venvDir) {
  if (fs.existsSync(venvDir)) {
    log('Venv already present:', venvDir);
    return;
  }
  log('Creating venv at', venvDir);
  const sysPy = pickSystemPython();

  const mk = spawnSync(sysPy.cmd, [...sysPy.args, '-m', 'venv', venvDir], {
    stdio: 'inherit',
  });
  if (mk.status !== 0) {
    throw new Error(`Failed to create venv (exit ${mk.status}).`);
  }
}

/** Run `<venv>/python -m pip install -r requirements.txt` if requirements exist. */
function ensureRequirements(pythonBin, requirementsPath) {
  // Always ensure pip exists & is recent enough
  log('Upgrading pip/setuptools/wheel…');
  const up = spawnSync(pythonBin, ['-m', 'pip', 'install', '--upgrade', 'pip', 'setuptools', 'wheel'], {
    stdio: 'inherit',
  });
  if (up.status !== 0) {
    throw new Error(`Failed to upgrade pip (exit ${up.status}).`);
  }

  if (fs.existsSync(requirementsPath)) {
    log('Installing requirements from', requirementsPath);
    const inst = spawnSync(pythonBin, ['-m', 'pip', 'install', '-r', requirementsPath], {
      stdio: 'inherit',
    });
    if (inst.status !== 0) {
      throw new Error(`pip install failed (exit ${inst.status}).`);
    }
  } else {
    log('No requirements.txt found at', requirementsPath, '— skipping.');
  }
}

/** Start the FastAPI (or other) Python server. */
function startPythonServer(pythonBin, scriptPath) {
  log('Starting Python server:', pythonBin, scriptPath);
  pyProc = spawn(pythonBin, [scriptPath], {
    // No need for shell; direct spawn is cleaner/cross-platform
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  pyProc.stdout.on('data', (d) => process.stdout.write(`[PYTHON STDOUT] ${d}`));
  pyProc.stderr.on('data', (d) => process.stderr.write(`[PYTHON STDERR] ${d}`));

  pyProc.on('exit', (code) => log(`[PYTHON EXITED] code=${code}`));
}

/** One-shot bootstrap: venv -> requirements -> launch. */
function bootstrapPython() {
  const { venvDir, requirementsPath, pythonBin, scriptPath } = resolvePaths();
  ensureVenv(venvDir);
  ensureRequirements(pythonBin, requirementsPath);
  startPythonServer(pythonBin, scriptPath);
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
    win.loadFile(path.join(process.resourcesPath, 'frontend', 'index.html'));
  }
}

app.whenReady().then(() => {
  try {
    bootstrapPython();
  } catch (e) {
    logErr('Python bootstrap failed:', e);
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
