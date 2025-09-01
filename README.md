## Descrição

Microserviço de frontend com:
- O CRUD de Usuários.
- O flow de autenticação (essa implementação ainda encontra-se em progresso, ou seja, ainda não foi finalizado todo o flow de autenticação e autorização). Atualmente o Usuário autenticado está sendo salvo no ```localStorage```, sendo assim compartilhado com os serviços de Frontend.

## Setup do projeto

```bash
$ npm install
```

## Compilar e rodar o projeto

```bash
# development
$ npm run dev

# script para rodar o module federation localmente sem erros
$ npm run start-mf
```

## Rodar os testes

```bash
# unit tests
$ npm run test
```
