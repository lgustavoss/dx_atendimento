# DX Atendimento

Sistema de gestão de atendimento via WhatsApp com painel administrativo completo.

## Sobre o Projeto

DX Atendimento é uma aplicação web para gerenciamento de atendimentos e conversas via WhatsApp, permitindo que empresas possam organizar seu atendimento ao cliente de forma eficiente.

### Principais Funcionalidades

- Chat em tempo real com clientes via WhatsApp
- Gestão de usuários com diferentes níveis de acesso
- Gerenciamento de empresas e seus respectivos grupos
- Painel administrativo completo
- Dashboard com estatísticas e métricas

## Tecnologias Utilizadas

### Backend
- Django 4.2+: Framework web Python de alto nível
- Django REST Framework: Toolkit para construção de Web APIs
- Django Channels: Suporte a WebSockets para comunicação em tempo real
- JWT: Autenticação via tokens
- SQLite/PostgreSQL: Banco de dados relacional
- Redis: Para gerenciamento de canais WebSocket

### Frontend
- React 19: Biblioteca JavaScript para construção de interfaces
- Material UI v7: Biblioteca de componentes React
- Vite: Build tool e dev server
- TypeScript: Superset tipado de JavaScript
- Axios: Cliente HTTP para requisições à API

## Instalação e Configuração

### Pré-requisitos
- Python 3.12+
- Node.js 18+
- MySQL 8+
- Redis (para WebSockets)

### Backend

1. Clone o repositório
   ```bash
   git clone https://github.com/[seu-usuario]/dx_atendimento.git
   cd dx_atendimento
2. Configure o ambiente virtual Python
    ```cd backend
    python -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    pip install -r requirements.txt
3. Configure o banco de dados
    ```
    # Crie um arquivo .env na pasta backend com:
    DATABASE_URL=mysql+pymysql://[usuario]:[senha]@localhost:3306/dx_atendimento
    SECRET_KEY=[sua-chave-secreta]
4. Execute as migrações
    ```
    python manage.py makemigrations
    python manage.py migrate
5. Crie um usuário inicial (administrador)
    ```
    python manage.py createsuperuser
### Frontend

1. Instale as dependências
    ```
    cd frontend
    npm install
2. Configure as variáveis de ambiente
    ```
    # Crie um arquivo .env.development.local na pasta frontend com:
    VITE_API_URL=http://localhost:8000

# 🏃‍♂️ Executando o Projeto

### Backend

    cd backend
    python manage.py runserver
    # O servidor estará disponível em http://localhost:8000

    Para o servidor WebSocket (requer Redis):
    daphne api.asgi:application

    Admin Django: http://localhost:8000/admin API Endpoints: http://localhost:8000/api/v1/

### Frontend

    cd frontend
    npm run dev
    # A aplicação estará disponível em http://localhost:5173

# 🌟 Status do Projeto

O projeto está em desenvolvimento ativo. Features implementadas:

✅ Autenticação e autorização

✅ CRUD de usuários

✅ CRUD de empresas

✅ CRUD de grupos

✅ CRUD de contatos

✅ Painel administrativo

🚧 Chat em tempo real (em desenvolvimento)

🚧 Integração com WhatsApp (em desenvolvimento)

# 📝 Desenvolvimento

    Estrutura do Projeto
        dx_atendimento/
        ├── backend/           # API Django
        │   ├── api/          # Configuração principal do Django
        │   ├── apps/         # Aplicações Django
        │   │   ├── accounts/ # Autenticação e usuários
        │   │   ├── chats/    # Gestão de conversas
        │   │   ├── companies/# Gestão de empresas
        │   │   ├── contacts/ # Gestão de contatos
        │   │   └── groups/   # Gestão de grupos
        │   └── tests/        # Testes
        └── frontend/         # Aplicação React
            ├── public/       # Arquivos estáticos
            └── src/         # Código fonte
                ├── components/  # Componentes React reutilizáveis
                ├── features/   # Features por domínio
                ├── providers/  # Provedores de contexto
                ├── routes/     # Configuração de rotas
                ├── services/   # Serviços de comunicação com API
                └── styles/     # Estilos e temas

Contribuição

1. Crie uma branch para sua feature: 
    ```
    git checkout -b feature/nova-funcionalidade
2. Commit suas mudanças: 
    ```
    git commit -m 'feat: implementação da nova funcionalidade'
3. Push para a branch: 
    ```
    git push origin feature/nova-funcionalidade
4. Abra um Pull Request

📄 Licença


    Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
