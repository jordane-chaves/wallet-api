<h1 align="center">
  Wallet API
</h1>

<p align="center">Desafio | Carteira Financeira</p>

<p align="center">
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#%EF%B8%8F-pré-requisitos">Pré requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como Executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-autor">Autor</a>
</p>

## 💻 Projeto

**Wallet API** é o backend de uma carteira financeira em que os usuários possam realizar transferência de saldo.

Funcionalidades:
- Criação de conta
- Autenticação
- Depósito
- Transferir para outro usuário
- Reversão da transferência (somente quem recebeu a transferência pode reverter)
- Consultar saldo

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Postgres](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [JWT](https://jwt.io/)
- [Vitest](https://vitest.dev/)

## 🛠️ Pré requisitos

**Variáveis de ambiente**

> [!IMPORTANT]
> Crie uma cópia do arquivo `.env.example` para `.env` e preencha todas as variáveis de ambiente.

**Banco de dados (Docker)**

Para executar o banco de dados localmente execute o comando abaixo:

```bash
# Execute o banco de dados com docker
docker compose up -d
```

## 🎲 Como executar

```bash
# Clone este repositório
$ git clone https://github.com/jordane-chaves/wallet-api

# Acesse o diretório do projeto no terminal/cmd
$ cd wallet-api

# Instale as dependências
$ npm install

# Execute as migrations para criar as tabelas no banco de dados
$ npx prisma migrate dev

# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# O servidor inciará na porta:3333 - acesse <http://localhost:3333>
```

**Executar Testes**

```bash
# Para executar os testes unitários
$ npm run test

# Para executar os testes E2E (é importante que o banco de dados esteja executando)
$ npm run test:e2e
```

## 📝 Licença

Esse projeto está sob a licença MIT - veja o arquivo [LICENSE](https://github.com/jordane-chaves/wallet-api/blob/main/LICENSE) para mais detalhes.

## 👨🏻‍💻 Autor

<img
  style="border-radius:50%;"
  src="https://avatars.githubusercontent.com/jordane-chaves"
  width="100px;"
  title="Foto de Jordane Chaves"
  alt="Foto de Jordane Chaves"
/>

Feito com 💜 por Jordane Chaves
