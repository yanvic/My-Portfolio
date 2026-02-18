---
title: "Por que Escolhi Rust para o Backend"
description: "Minha experiência migrando serviços de Node.js para Rust e os ganhos reais de performance e segurança."
date: 2025-06-10
tag: "Rust"
readTime: "10 min"
---

## O contexto

Tínhamos um serviço de processamento de imagens em Node.js que consumia 2GB de RAM e levava 800ms por requisição. O custo de infraestrutura estava alto e a latência impactava a experiência do usuário.

## Por que Rust?

### Performance previsível

Rust não tem garbage collector. Isso significa latência consistente — sem pausas inesperadas de GC que causavam spikes de 2-3 segundos no Node.

### Segurança de memória em tempo de compilação

O borrow checker do Rust pega bugs que em outras linguagens só aparecem em produção:

```rust
// O compilador não deixa isso passar
fn process_image(data: Vec<u8>) -> Result<Image, Error> {
    let processed = transform(data)?;  // data é movido aqui
    // data não pode mais ser usado - o compilador garante
    Ok(processed)
}
```

### Ecossistema maduro

- **Actix-web** — framework web com performance absurda
- **Tokio** — runtime async robusto
- **Serde** — serialização zero-cost

## Os números

| Métrica | Node.js | Rust |
|---------|---------|------|
| Latência p99 | 800ms | 45ms |
| RAM | 2GB | 120MB |
| Throughput | 50 req/s | 800 req/s |
| Custo mensal | R$ 1.200 | R$ 180 |

## Dificuldades

- **Curva de aprendizado** — o borrow checker é frustrante no início
- **Tempo de compilação** — builds de 3-5 minutos no CI
- **Ecossistema menor** — nem tudo tem lib pronta

## Conclusão

Rust não é pra todo projeto. Mas para serviços com requisitos de performance e confiabilidade, é uma escolha excelente. O investimento na curva de aprendizado se paga rapidamente.
