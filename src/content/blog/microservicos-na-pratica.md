---
title: "Microserviços na Prática"
description: "Como implementar uma arquitetura de microserviços que realmente escala e funciona em produção."
date: 2024-11-20
tag: "Arquitetura"
readTime: "8 min"
---

## Por que Microserviços?

Quando trabalhei em um projeto de e-commerce que precisava escalar para milhares de requisições por segundo, percebi que o monolito estava nos limitando. A cada deploy, tudo parava. A cada bug, tudo quebrava.

## O que aprendi

### 1. Comece pelo domínio, não pela tecnologia

Antes de sair criando serviços, mapeie os **bounded contexts** do seu sistema. No nosso caso:

- **Catálogo** — produtos, categorias, busca
- **Pedidos** — carrinho, checkout, pagamento
- **Usuários** — autenticação, perfil, preferências

### 2. Comunicação entre serviços

Usamos dois padrões principais:

- **HTTP/REST** para chamadas síncronas (consulta de produto no checkout)
- **Message Queue (RabbitMQ)** para eventos assíncronos (pedido criado → notificar estoque)

```go
// Publicando evento de pedido criado
func (s *OrderService) Create(order Order) error {
    if err := s.repo.Save(order); err != nil {
        return err
    }
    return s.queue.Publish("order.created", order)
}
```

### 3. Observabilidade é obrigatória

Sem logs centralizados e tracing distribuído, debugar microserviços é impossível. Usamos:

- **Grafana + Prometheus** para métricas
- **Jaeger** para tracing
- **ELK Stack** para logs

## Conclusão

Microserviços não são bala de prata. Use quando a complexidade do domínio justificar. Para projetos menores, um monolito bem estruturado é mais que suficiente.
