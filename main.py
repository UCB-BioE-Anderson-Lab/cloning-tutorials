import os
import subprocess
import sys

# Define MkDocs commands
COMMANDS = {
    "serve": "mkdocs serve",
    "build": "mkdocs build",
    "deploy": "mkdocs gh-deploy",
}

def run_command(command):
    """Runs a shell command and checks for errors."""
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError:
        print(f"Error: Command failed -> {command}")
        sys.exit(1)

def check_mkdocs():
    """Checks if MkDocs is installed."""
    try:
        subprocess.run(["mkdocs", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except FileNotFoundError:
        print("Error: MkDocs is not installed. Please install it with `pip install mkdocs mkdocs-material`.")
        sys.exit(1)

def main():
    """Handles MkDocs workflow."""
    if len(sys.argv) < 2:
        print("Usage: python main.py [serve|build|deploy]")
        sys.exit(1)

    action = sys.argv[1].lower()

    if action in COMMANDS:
        check_mkdocs()
        print(f"Running: {COMMANDS[action]}")
        run_command(COMMANDS[action])
    else:
        print("Error: Invalid command. Use one of: serve, build, deploy.")
        sys.exit(1)

if __name__ == "__main__":
    main()
