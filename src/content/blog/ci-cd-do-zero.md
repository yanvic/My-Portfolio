---
title: "CI/CD do Zero com GitHub Actions"
description: "Guia prático para montar um pipeline de CI/CD completo usando GitHub Actions, Docker e deploy automatizado."
date: 2025-09-01
tag: "DevOps"
readTime: "12 min"
---

## O que vamos construir

Um pipeline completo que:

1. Roda testes automatizados a cada push
2. Faz build da aplicação em Docker
3. Publica a imagem no Docker Hub
4. Faz deploy automático no servidor

## Estrutura do workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: user/app:latest
```

## Boas práticas

### Cache de dependências

Sem cache, o `npm ci` leva 2 minutos. Com cache, 15 segundos:

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('package-lock.json') }}
```

### Testes em paralelo

Dividir testes em jobs paralelos reduz o tempo total:

- **Unit tests** — 30 segundos
- **Integration tests** — 2 minutos
- **E2E tests** — 3 minutos

Rodando em paralelo: **3 minutos** total em vez de 5.5 minutos sequencial.

### Secrets e variáveis de ambiente

Nunca coloque credenciais no código. Use GitHub Secrets:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

## Deploy automatizado

Para o deploy, usamos SSH para conectar no servidor e atualizar o container:

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Deploy via SSH
      uses: appleboy/ssh-action@v1
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          docker pull user/app:latest
          docker compose up -d
```

## Resultado

- Deploy manual que levava **30 minutos** agora leva **0 minutos** (é automático)
- Bugs são pegos antes de chegar em produção
- O time tem confiança para fazer deploys a qualquer hora

CI/CD não é luxo — é necessidade. E com GitHub Actions, é grátis para projetos open source.
