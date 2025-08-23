import json
import os
import sys
import subprocess
import pathlib
from typing import Optional

PKG_NAME = "stim-pyper"

def _dist_info_dir() -> Optional[pathlib.Path]:
    # Locate site-packages/dist-info folder for the package
    import importlib.metadata as md
    try:
        dist = md.distribution(PKG_NAME)
    except md.PackageNotFoundError:
        return None
    # ._path is a private attr; safer to scan sibling dist-info
    dist_path = pathlib.Path(dist._path)  # type: ignore[attr-defined]
    for p in dist_path.parent.glob(f"{PKG_NAME.replace('-','_')}*-dist-info"):
        return p
    return None

def get_installed_commit() -> Optional[str]:
    """
    Read pip's direct_url.json to get the commit used for a VCS install.
    """
    info = _dist_info_dir()
    if not info:
        return None
    f = info / "direct_url.json"
    if not f.exists():
        return None
    try:
        data = json.loads(f.read_text())
        vcs = data.get("vcs_info") or {}
        return vcs.get("commit_id")
    except Exception:
        return None

def get_remote_head_commit(repo_url: str, ref: str = "refs/heads/main") -> Optional[str]:
    """
    Uses `git ls-remote` to fetch the latest commit hash for a branch.
    Requires `git` in PATH.
    """
    try:
        # Example: git ls-remote https://github.com/Calvinwhow/StimPyPer.git refs/heads/main
        res = subprocess.run(
            ["git", "ls-remote", repo_url, ref],
            capture_output=True, text=True, check=True
        )
        line = res.stdout.strip().splitlines()[0] if res.stdout else ""
        return line.split()[0] if line else None
    except Exception:
        return None

def pip_update(repo_url: str, ref: str = "main") -> bool:
    """
    Upgrade to the latest on the given branch. Returns True on success.
    """
    try:
        cmd = [
            sys.executable, "-m", "pip", "install",
            "--upgrade", "--no-cache-dir",
            f"git+{repo_url}@{ref}"
        ]
        res = subprocess.run(cmd, text=True)
        return res.returncode == 0
    except Exception:
        return False

def restart_process():
    """
    Re-exec the current Python process with same args/env to load the new code.
    """
    os.execv(sys.executable, [sys.executable] + sys.argv)

def ensure_latest(repo_url: str = "https://github.com/Calvinwhow/StimPyPer.git", branch: str = "main") -> dict:
    installed_commit = get_installed_commit()
    remote_commit = get_remote_head_commit(repo_url, f"refs/heads/{branch}")
    status = {
        "installed_commit": installed_commit,
        "remote_commit": remote_commit,
        "updated": False,
        "skipped": False,
        "error": None,
    }

    # If we can't resolve remote, skip silently (don’t block startup)
    if not remote_commit:
        status["skipped"] = True
        status["error"] = "Could not determine remote head"
        return status

    # If not installed (first run) or different commit → update
    if (installed_commit != remote_commit):
        ok = pip_update(repo_url, branch)
        status["updated"] = ok
        if ok:
            # Re-exec to load new package code
            restart_process()
        else:
            status["error"] = "pip upgrade failed"
    else:
        status["skipped"] = True  # already latest

    return status
