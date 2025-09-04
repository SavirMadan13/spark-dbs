# Build Instructions for Standalone Electron App with Python Backend

This project packages a Python FastAPI backend with an Electron React frontend into a standalone application that includes Python runtime.

## Overview

The application consists of:
- **Frontend**: Electron React app in the `frontend/` directory
- **Backend**: Python FastAPI server in the `backend/` directory
- **Packaging**: Uses PyInstaller to bundle Python backend and electron-builder for final app packaging

## Prerequisites

### For Development
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### For Building
- All development prerequisites
- PyInstaller (installed automatically during build)

## Project Structure

```
├── frontend/                 # Electron React app
│   ├── src/                 # React source code
│   ├── public/              # Electron main process and static files
│   ├── package.json         # Node.js dependencies and build scripts
│   └── build/               # Built React app (generated)
├── backend/                 # Python FastAPI server
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── backend.spec        # PyInstaller configuration
│   ├── build_backend.py    # Build script for standalone executable
│   └── dist/               # Built Python executable (generated)
└── BUILD_INSTRUCTIONS.md   # This file
```

## Build Process

### 1. Install Dependencies

First, install Node.js dependencies:
```bash
cd frontend
npm install
```

### 2. Build the Application

You have several build options:

#### Build Everything (Recommended)
```bash
cd frontend
npm run package
```

This will:
1. Build the Python backend into a standalone executable
2. Build the React frontend
3. Package everything into a distributable Electron app

#### Platform-Specific Builds
```bash
# Windows
npm run package-win

# macOS
npm run package-mac

# Linux
npm run package-linux
```

#### Individual Components
```bash
# Build only the backend
npm run build-backend

# Build only the frontend
npm run build-frontend

# Build both (without packaging)
npm run build-all
```

### 3. Clean Build Artifacts
```bash
cd frontend
npm run clean
```

## How It Works

### Backend Packaging
1. **PyInstaller Configuration**: The `backend.spec` file defines how to package the Python application:
   - Includes all necessary dependencies (FastAPI, scientific libraries, etc.)
   - Bundles Python runtime
   - Creates a single executable file
   - Excludes unnecessary modules to reduce size

2. **Build Script**: `build_backend.py` automates the build process:
   - Installs PyInstaller and requirements
   - Cleans previous builds
   - Runs PyInstaller with the spec file
   - Validates the output

### Frontend Integration
1. **Electron Main Process**: `electron.js` is modified to:
   - Locate the bundled backend executable
   - Start the backend server automatically
   - Handle backend process lifecycle

2. **Resource Bundling**: electron-builder configuration:
   - Copies the backend executable to app resources
   - Packages everything into platform-specific installers

### Development vs Production
- **Development**: Uses the backend executable from `backend/dist/`
- **Production**: Uses the backend executable from app resources

## Output

After building, you'll find:

### Development Build Artifacts
- `backend/dist/backend` (or `backend.exe` on Windows) - Standalone Python executable
- `frontend/build/` - Built React application

### Final Distribution
- `frontend/dist/` - Platform-specific installers:
  - Windows: `.exe` installer
  - macOS: `.dmg` disk image
  - Linux: `.AppImage` file

## Troubleshooting

### Backend Build Issues
1. **Missing Dependencies**: Ensure all packages in `requirements.txt` are installable
2. **Import Errors**: Add missing modules to `hiddenimports` in `backend.spec`
3. **Large File Size**: Review `excludes` in `backend.spec` to remove unnecessary modules

### Frontend Build Issues
1. **Backend Not Found**: Ensure backend is built before packaging
2. **Permission Errors**: The app automatically sets executable permissions on Unix systems
3. **Port Conflicts**: Backend runs on port 8000 by default

### Runtime Issues
1. **Backend Won't Start**: Check console output for Python errors
2. **API Not Responding**: Verify backend is listening on http://127.0.0.1:8000
3. **Missing Files**: Ensure all data files are included in PyInstaller spec

## Development Workflow

1. **Start Development Server**:
   ```bash
   cd frontend
   npm start
   ```
   This runs both React dev server and Electron with backend

2. **Make Changes**: Edit React or Python code as needed

3. **Test Build**: Regularly test the full build process:
   ```bash
   npm run build-all
   npm start  # Test with built backend
   ```

4. **Package for Distribution**:
   ```bash
   npm run package
   ```

## Security Considerations

- The backend executable includes the Python runtime and all dependencies
- No external Python installation required on target machines
- Backend runs locally on 127.0.0.1 (localhost only)
- CORS is configured to allow frontend access only

## Performance Notes

- Backend startup time: 2-5 seconds (includes Python runtime initialization)
- Executable size: ~50-200MB (depending on scientific library requirements)
- Memory usage: ~100-300MB (Python + Electron)

## Customization

### Adding Python Dependencies
1. Add to `backend/requirements.txt`
2. Add to `hiddenimports` in `backend.spec` if needed
3. Rebuild backend

### Changing Backend Port
1. Update port in `backend/main.py`
2. Update CORS origins in `backend/main.py`
3. Update frontend API calls if needed

### App Metadata
Edit `frontend/package.json` build configuration:
- `appId`: Unique application identifier
- `productName`: Display name
- `directories.output`: Output directory for builds