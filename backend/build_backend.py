#!/usr/bin/env python3
"""
Build script for creating a standalone backend executable with PyInstaller.
This script ensures all dependencies are properly bundled.
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and handle errors."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error running command: {' '.join(cmd)}")
        print(f"STDOUT: {result.stdout}")
        print(f"STDERR: {result.stderr}")
        return False
    
    print(f"Success: {result.stdout}")
    return True

def setup_venv():
    """Create and setup virtual environment."""
    venv_path = Path(".venv")
    
    if not venv_path.exists():
        print("Creating virtual environment...")
        if not run_command([sys.executable, "-m", "venv", ".venv"]):
            return None
    
    # Get the python executable path for the venv
    if sys.platform == "win32":
        python_exe = venv_path / "Scripts" / "python.exe"
    else:
        python_exe = venv_path / "bin" / "python"
    
    return str(python_exe)

def install_requirements(python_exe):
    """Install all requirements including PyInstaller."""
    print("Installing requirements...")
    
    # Upgrade pip first
    if not run_command([python_exe, "-m", "pip", "install", "--upgrade", "pip"]):
        return False
    
    # Install PyInstaller if not present
    if not run_command([python_exe, "-m", "pip", "install", "pyinstaller"]):
        return False
    
    # Install project requirements
    if not run_command([python_exe, "-m", "pip", "install", "-r", "requirements.txt"]):
        return False
    
    return python_exe

def clean_build():
    """Clean previous build artifacts."""
    print("Cleaning previous build artifacts...")
    
    dirs_to_clean = ["build", "dist", "__pycache__"]
    for dir_name in dirs_to_clean:
        if os.path.exists(dir_name):
            shutil.rmtree(dir_name)
            print(f"Removed {dir_name}")

def build_executable(python_exe):
    """Build the executable using PyInstaller."""
    print("Building executable with PyInstaller...")
    
    # Use the spec file for consistent builds
    cmd = [python_exe, "-m", "PyInstaller", "--clean", "backend.spec"]
    
    if not run_command(cmd):
        return False
    
    # Check if the executable was created
    exe_name = "backend.exe" if sys.platform == "win32" else "backend"
    exe_path = Path("dist") / exe_name
    
    if exe_path.exists():
        print(f"✅ Successfully built executable: {exe_path}")
        print(f"Executable size: {exe_path.stat().st_size / (1024*1024):.1f} MB")
        return True
    else:
        print("❌ Executable not found after build")
        return False

def main():
    """Main build process."""
    print("🚀 Starting backend build process...")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Setup virtual environment
    python_exe = setup_venv()
    if not python_exe:
        print("❌ Failed to setup virtual environment")
        return 1
    
    # Install requirements
    python_exe = install_requirements(python_exe)
    if not python_exe:
        print("❌ Failed to install requirements")
        return 1
    
    # Clean previous builds
    clean_build()
    
    # Build executable
    if not build_executable(python_exe):
        print("❌ Failed to build executable")
        return 1
    
    print("✅ Backend build completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main())