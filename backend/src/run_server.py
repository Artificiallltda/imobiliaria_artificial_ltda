import subprocess
import sys
import os

# backend/src/run_server.py -> sobe 2 níveis para a raiz do projeto
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
backend_dir = os.path.join(project_root, "backend")
frontend_dir = os.path.join(project_root, "frontend")

backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--reload"],
    cwd=backend_dir,
)

frontend_proc = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=frontend_dir,
    shell=True,
)

print("Backend: http://127.0.0.1:8000")
print("Frontend: http://localhost:5173")
print("Pressione Ctrl+C para encerrar.\n")

try:
    backend_proc.wait()
    frontend_proc.wait()
except KeyboardInterrupt:
    backend_proc.terminate()
    frontend_proc.terminate()
    sys.exit(0)
