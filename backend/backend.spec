# -*- mode: python ; coding: utf-8 -*-
import os
import sys

# Add the backend directory to path for imports
backend_dir = os.path.dirname(os.path.abspath(SPEC))
sys.path.insert(0, backend_dir)

a = Analysis(
    ['main.py'],
    pathex=[backend_dir],
    binaries=[],
    datas=[
        # Include all service modules
        ('services', 'services'),
        ('toolboxes', 'toolboxes'),
        # Include any data files your app needs
        ('*.py', '.'),
    ],
    hiddenimports=[
        # FastAPI and related
        'fastapi',
        'uvicorn',
        'uvicorn.workers',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.websockets',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'starlette',
        'starlette.applications',
        'starlette.middleware',
        'starlette.routing',
        'pydantic',
        'pydantic.dataclasses',
        'pydantic.json',
        # Scientific computing packages
        'numpy',
        'scipy',
        'pandas',
        'scikit-learn',
        'sklearn',
        'sklearn.utils._cython_blas',
        'sklearn.neighbors.typedefs',
        'sklearn.neighbors.quad_tree',
        'sklearn.tree._utils',
        'nibabel',
        'nilearn',
        'h5py',
        'h5py.defs',
        'h5py.utils',
        'h5py._proxy',
        # Your custom modules
        'services.auto_update',
        'toolboxes.run_stimpyper',
        'electrode',
        'helpers',
        # Multipart support
        'python_multipart',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'matplotlib',  # Exclude if not needed to reduce size
        'tkinter',
        'test',
        'unittest',
        'pdb',
        'doctest',
    ],
    noarchive=False,
    optimize=0,
)

# Filter out unnecessary files to reduce size
a.datas = [x for x in a.datas if not x[0].startswith('matplotlib')]
a.datas = [x for x in a.datas if not x[0].startswith('tkinter')]

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Set to False for production to hide console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
