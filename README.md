# Imobiliária — Documentação do Projeto

Projeto full-stack: **React + Vite** (frontend) e **FastAPI** (backend).

---

## Como rodar o projeto

```bash
cd backend
.\venv\Scripts\Activate.ps1   # Windows PowerShell
cd src
python run_server.py
```

- **Backend:** http://127.0.0.1:8000  
- **Frontend:** http://localhost:5173  

---

## Estrutura do Projeto (esqueleto obrigatório)

### Raiz

```
artificiall_imobiliaria/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

---

### Frontend (`frontend/`)

```
frontend/
├── public/              # Arquivos estáticos (imagens, favicon)
├── src/
│   ├── main.jsx         # Ponto de entrada (NÃO alterar estrutura)
│   ├── App.jsx          # Componente raiz e rotas
│   ├── index.css        # Estilos globais
│   │
│   ├── pages/           # Páginas (uma pasta por página)
│   │   ├── Home/
│   │   │   └── index.jsx
│   │   ├── Dashboard/
│   │   │   └── index.jsx
│   │   └── ...
│   │
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header/
│   │   │   └── index.jsx
│   │   ├── PropertyCard/
│   │   │   └── index.jsx
│   │   └── ...
│   │
│   ├── hooks/           # Custom hooks (opcional)
│   ├── services/        # Chamadas à API (opcional)
│   └── assets/          # Imagens, ícones (opcional)
│
├── index.html
├── package.json
└── vite.config.js
```

**Regras do frontend:**
- Cada **página** fica em `src/pages/NomeDaPagina/index.jsx`
- Cada **componente** reutilizável em `src/components/NomeDoComponente/index.jsx`
- Usar `index.jsx` como arquivo principal de cada pasta
- O `App.jsx` importa e organiza as rotas/páginas

---

### Backend (`backend/`)

```
backend/
├── src/
│   └── run_server.py    # Inicia backend + frontend (NÃO alterar)
│
├── main.py              # App FastAPI e rotas principais
├── requirements.txt
└── venv/                # Ambiente virtual (não vai pro Git)
```

**Regras do backend:**
- Lógica da API em `main.py` (ou módulos importados por ele)
- Dependências sempre em `requirements.txt`
- Nunca commitar `.env` ou `venv/`

---

## Padrões de código

1. **Nomenclatura:** camelCase para JS/JSX, snake_case para Python  
2. **Commits:** mensagens em português, claras e curtas  
3. **Branches:** `feature/nome-da-feature` ou `fix/nome-do-fix`  

---

## Primeiro acesso (setup)

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

---

## Contato

Dúvidas sobre o projeto ou sobre a estrutura acima, falar com o time.
