#!/usr/bin/env python3
import subprocess
import sys
import os
import signal

# Configurar caminhos
project_root = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(project_root, "backend")
frontend_dir = os.path.join(project_root, "frontend")

print("🚀 Iniciando backend e frontend...")
print(f"📁 Backend: {backend_dir}")
print(f"📁 Frontend: {frontend_dir}")
print()

# Iniciar backend
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
    cwd=backend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

# Iniciar frontend
frontend_proc = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=frontend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

print("✅ Servidores iniciados!")
print("🌐 Backend: http://127.0.0.1:8000")
print("🌐 Frontend: http://localhost:5173")
print("⏹️  Pressione Ctrl+C para encerrar ambos os servidores")
print()

def print_output(proc, name):
    """Imprime saída do processo em tempo real"""
    try:
        for line in iter(proc.stdout.readline, ''):
            if line:
                print(f"[{name}] {line.strip()}")
    except:
        pass

# Manter o script rodando e mostrar saída
try:
    while True:
        # Verificar se os processos ainda estão rodando
        if backend_proc.poll() is not None:
            print("❌ Backend parou inesperadamente")
            break
            
        if frontend_proc.poll() is not None:
            print("❌ Frontend parou inesperadamente")
            break
            
        # Pequena pausa para não usar 100% CPU
        import time
        time.sleep(0.1)
        
except KeyboardInterrupt:
    print("\n🛑 Encerrando servidores...")
    backend_proc.terminate()
    frontend_proc.terminate()
    
    # Forçar encerramento se necessário
    try:
        backend_proc.wait(timeout=5)
        frontend_proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        print("⚠️ Forçando encerramento...")
        backend_proc.kill()
        frontend_proc.kill()
    
    print("✅ Servidores encerrados!")
    sys.exit(0)
