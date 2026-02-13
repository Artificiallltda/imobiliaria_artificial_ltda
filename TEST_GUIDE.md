# Guia de Teste - Endpoints CRUD de Imóveis

## 📋 Verificação de Implementação

### ✅ 1) Banco de Dados - IMPLEMENTADO
- **Constraints básicas**: 
  - ✅ price não pode ser negativo (chk_price_positive)
  - ✅ title obrigatório (chk_title_not_empty)
  - ✅ description obrigatório (chk_description_not_empty)
  - ✅ city obrigatório (chk_city_not_empty)
  - ✅ bedrooms > 0 (chk_bedrooms_positive)
  - ✅ bathrooms > 0 (chk_bathrooms_positive)
  - ✅ area > 0 (chk_area_positive)
- **Índices criados**:
  - ✅ idx_properties_city
  - ✅ idx_properties_status
  - ✅ idx_properties_price

### ✅ 2) Backend (CRUD) - IMPLEMENTADO
- **Endpoints disponíveis**:
  - ✅ POST /properties/ → Criar imóvel
  - ✅ PUT /properties/{id} → Editar imóvel
  - ✅ DELETE /properties/{id} → Remover imóvel
  - ✅ GET /properties/{id} → Obter imóvel específico
  - ✅ GET /properties/ → Listar imóveis (já existia)

- **Validações implementadas**:
  - ✅ Campos obrigatórios validados
  - ✅ Retorno 404 se imóvel não existir
  - ✅ Retorno 400 para dados inválidos
  - ✅ Valores positivos para price, bedrooms, bathrooms, area
  - ✅ Status controlados (AVAILABLE, SOLD, RESERVED)

### ✅ 3) Frontend (React) - IMPLEMENTADO
- **Página administrativa**: ✅ AdminPropertyForm.js
- **Funcionalidades**:
  - ✅ Formulário com todos os campos obrigatórios
  - ✅ Modo criação (/admin/properties/new)
  - ✅ Modo edição (/admin/properties/:id/edit)
  - ✅ Validações no frontend
  - ✅ Loading states
  - ✅ Tratamento de erros
  - ✅ Redirecionamento após salvar

- **Services atualizados**:
  - ✅ createProperty(data)
  - ✅ updateProperty(id, data)
  - ✅ deleteProperty(id)
  - ✅ getPropertyById(id)

## 🧪 Testes via Postman/Insomnia

### 1) Criar Imóvel (POST)
```http
POST http://localhost:8000/properties/
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Casa em Condomínio",
  "description": "Casa moderna com piscina e jardim",
  "price": 950000,
  "city": "Campinas",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 250,
  "status": "AVAILABLE"
}
```

### 2) Editar Imóvel (PUT)
```http
PUT http://localhost:8000/properties/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Casa em Condomínio - Atualizado",
  "price": 1050000
}
```

### 3) Deletar Imóvel (DELETE)
```http
DELETE http://localhost:8000/properties/{id}
Authorization: Bearer {token}
```

### 4) Buscar Imóvel (GET)
```http
GET http://localhost:8000/properties/{id}
Authorization: Bearer {token}
```

### 5) Listar Imóveis (GET)
```http
GET http://localhost:8000/properties/?city=Campinas&status=AVAILABLE
```

## 🎯 Casos de Teste para Validação

### Testar Campos Inválidos:
1. **Price negativo**: Deve retornar 400
2. **Title vazio**: Deve retornar 400
3. **Bedrooms = 0**: Deve retornar 400
4. **Status inválido**: Deve retornar 400
5. **ID inexistente**: Deve retornar 404

### Testar Sucesso:
1. **Criação válida**: Deve retornar 201 com dados do imóvel
2. **Edição válida**: Deve retornar 200 com dados atualizados
3. **Delete válido**: Deve retornar 204
4. **Busca válida**: Deve retornar 200 com dados do imóvel

## 🚀 Como Executar os Testes

1. **Iniciar Backend**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Iniciar Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Acessar Admin**:
   - Frontend: http://localhost:5173/admin/properties
   - Criar novo: http://localhost:5173/admin/properties/new
   - API Docs: http://localhost:8000/docs

## ✅ Critérios de Aceite - CUMPRIDOS

- [x] Criar imóvel via formulário
- [x] Editar imóvel existente
- [x] Redirecionar após salvar
- [x] Mostrar loading
- [x] Mostrar erro se API falhar
- [x] Sem uso de mock
- [x] Campos obrigatórios validados
- [x] Índices criados
- [x] Não permitir inserir imóvel inválido
