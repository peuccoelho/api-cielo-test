## Instalação das dependências

Após o clone, instale as dependências do projeto (incluindo o pacote local presente na pasta `.api`):

```bash
npm install
```

## Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as credenciais e URLs necessárias. Utilize o modelo abaixo como referência:

```ini

PORT=3000

CIELO_CLIENT_ID=
CIELO_CLIENT_SECRET=

CIELO_TOKEN_URL=https://cieloecommerce.cielo.com.br/api/public/v2/token

CIELO_API_BASE=https://cieloecommerce.cielo.com.br/api/public/v1
```



## Endpoints disponíveis

| Método | Rota          | Descrição                                         |
|--------|---------------|---------------------------------------------------|
| POST   | `/create-link` | Gera um link de pagamento na Cielo Link de Pagamento |

### Exemplo de corpo da requisição

```json
{
  "name": "Produto Teste",
  "price": 49.9,
  "description": "Descrição opcional do produto",
  "quantity": 1,
  "orderNumber": "PEDIDO-123"
}
```

Resposta esperada em caso de sucesso (`HTTP 201`):

```json
{
  "success": true,
  "data": {
    "id": "...",
    "shortUrl": "https://...",
    "status": "ACTIVE",
    "...": "..."
  },
  "status": 201,
  "statusText": "Created"
}
```
