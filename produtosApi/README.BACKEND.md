# 📦 Backend - API de Produtos (Laravel)

Este backend foi desenvolvido em Laravel e fornece uma API REST para gerenciamento dos produtos da loja Atlântica Store.

## 🔧 Requisitos

- PHP >= 8.1
- Composer
- SQLite
- Laravel CLI (Artisan)

## ▶️ Como executar

1. Clone o repositório (caso ainda não tenha):
   
   git clone https://github.com/GabrielOliveira1245/DevSquadWeb.git
   cd DevSquadWeb/produtosApi
   

2. Instale as dependências:
   
   composer install
   

3. Crie o arquivo `.env` com base no `.env.example`:
   
   cp .env.example .env
   

4. Gere a chave da aplicação:
   
   php artisan key:generate
  

5. Configure o banco de dados no `.env`:
   Use SQLite:
   
   DB_CONNECTION=sqlite
   

6. Crie o banco SQLite:
   
   mkdir -p database

   touch database/database.sqlite
   

7. Rode as migrations:
   
   php artisan migrate
   

8. Crie o link simbólico para exibir imagens:
   
   php artisan storage:link
   

9. Inicie o servidor:
   
   php -S localhost:8000 -t public/
   

10. A API estará disponível em:  
    http://localhost:8000/api/produtos

## 🧪 Testando a API

Você pode utilizar ferramentas como Postman para testar os endpoints:

- GET     /api/produtos
- POST    /api/produtos
- PUT     /api/produtos/{id}
- DELETE  /api/produtos/{id}