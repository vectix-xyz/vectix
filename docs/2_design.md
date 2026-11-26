# РОЗДІЛ 2. ПРОЄКТУВАННЯ АРХІТЕКТУРИ СИСТЕМИ

Розділ містить архітектурну модель Vectix за методологією C4 Model (рівні Context, Container, Component), виконану за підходом Diagrams-as-Code (Mermaid.js), та зафіксовані архітектурні рішення. Усі елементи трасуються до вимог у [srs.md](./srs.md) та до рішень у [adr/](./adr/).

## 2.1. Контекстне та контейнерне моделювання системи (C4 Model)

<a id="diagram-level1"></a>

### 2.1.1. C4 Level 1 — System Context

```mermaid
C4Context
    title System Context Diagram — Vectix

    Person(client, "Client", "Відправник: створює вантажний запит, обирає перевізника, відстежує вантаж")
    Person(carrierOp, "Carrier Operator", "Представник перевізника: керує тарифами, місткістю та замовленнями")
    Person(admin, "Admin", "Оператор платформи: модерація перевізників, спірні замовлення")

    System(vectix, "Vectix", "Платформа-агрегатор міжнародних вантажних перевезень")

    System_Ext(carrierApis, "Carrier APIs", "Зовнішні системи перевізників: тарифи та статуси вантажів")
    System_Ext(paymentProvider, "Payment Provider", "Утримання та повернення коштів")
    System_Ext(insuranceProvider, "Insurance Provider", "Розрахунок премії та оформлення поліса")
    System_Ext(messaging, "Email та Telegram", "Канали доставки сповіщень")

    Rel(client, vectix, "Створює запити, обирає пропозиції, відстежує вантаж", "HTTPS")
    Rel(carrierOp, vectix, "Керує тарифами, місткістю, замовленнями", "HTTPS")
    Rel(admin, vectix, "Модерує перевізників і спори", "HTTPS")
    Rel(vectix, carrierApis, "Запитує тарифи", "REST / HTTPS")
    Rel(carrierApis, vectix, "Надсилає події статусу", "Webhooks / HTTPS")
    Rel(vectix, paymentProvider, "Утримує та повертає кошти", "REST / HTTPS")
    Rel(vectix, insuranceProvider, "Розраховує премію, оформлює поліс", "REST / HTTPS")
    Rel(vectix, messaging, "Надсилає сповіщення", "SMTP / TLS, Bot API / HTTPS")
```

**Опис.** Система Vectix представлена єдиним блоком. Актори Client, Carrier Operator та Admin взаємодіють із системою через вебпорталі за протоколом HTTPS. Зовнішні системи: Carrier APIs (двобічна взаємодія: запит тарифів за REST / HTTPS та прийом подій статусу через Webhooks / HTTPS), Payment Provider та Insurance Provider (REST / HTTPS), Email та Telegram (SMTP / TLS та Bot API / HTTPS).

**Трасування:** користувачі та ролі — [SRS-FUN-01](./srs.md#srs-fun-01), [SRS-FUN-03](./srs.md#srs-fun-03); тарифи та статуси перевізників — [SRS-FUN-06](./srs.md#srs-fun-06), [SRS-FUN-15](./srs.md#srs-fun-15); оплата та страхування — [SRS-FUN-12](./srs.md#srs-fun-12); сповіщення — [SRS-FUN-19](./srs.md#srs-fun-19).

<a id="diagram-level2"></a>

### 2.1.2. C4 Level 2 — Container

```mermaid
C4Container
    title Container Diagram — Vectix

    Person(client, "Client", "Відправник")
    Person(carrierOp, "Carrier Operator", "Представник перевізника")
    Person(admin, "Admin", "Оператор платформи")

    System_Boundary(vectixBoundary, "Vectix") {
        Container(clientPortal, "Client Portal", "Next.js", "Створення запитів, вибір пропозицій, відстеження")
        Container(carrierPortal, "Carrier Portal", "Next.js", "Тарифи, маршрути, місткість, замовлення, адміністрування")
        Container(gateway, "API Gateway", "NestJS", "Маршрутизація, перевірка JWT, RBAC, Rate Limiting")
        Container(identity, "Identity Service", "NestJS", "Реєстрація, OAuth 2.0 / OIDC, видача JWT")
        Container(shipment, "Shipment Request Service", "NestJS", "Прийом і валідація запитів, тарифікована вага")
        Container(quote, "Quote Engine Service", "NestJS", "Паралельне формування пропозицій")
        Container(scoring, "Quote Scoring Service", "FastAPI, Python", "Ранжування пропозицій, прогноз ETA")
        Container(carrierMgmt, "Carrier Management Service", "NestJS", "Тарифні сітки, маршрути, місткість")
        Container(order, "Order Orchestrator", "NestJS", "Saga оформлення замовлення")
        Container(payment, "Payment and Insurance Service", "NestJS", "Escrow, страхування")
        Container(tracking, "Tracking Service", "NestJS", "Прийом подій, CQRS read-model, SSE")
        Container(docs, "Document and Notification Service", "NestJS", "Накладні PDF, сповіщення, рейтинг")
        ContainerQueue(kafka, "Apache Kafka", "Kafka, KRaft", "Шина подій і команд Saga")
        ContainerDb(pg, "PostgreSQL", "PostgreSQL 16", "Окрема логічна БД на сервіс, outbox-таблиці")
        ContainerDb(redis, "Redis", "Redis 7", "Кеш пропозицій, лічильники Rate Limiting")
        ContainerDb(minio, "Object Storage", "MinIO, S3 API", "Документи PDF")
        Container(otel, "Observability Stack", "OpenTelemetry Collector, Prometheus, Grafana, Jaeger", "Трасування, метрики, дашборди")
    }

    System_Ext(carrierApis, "Carrier APIs", "Системи перевізників")
    System_Ext(paymentProvider, "Payment Provider", "Платіжний провайдер")
    System_Ext(insuranceProvider, "Insurance Provider", "Страховий провайдер")
    System_Ext(messaging, "Email та Telegram", "Канали сповіщень")

    Rel(client, clientPortal, "Використовує", "HTTPS")
    Rel(carrierOp, carrierPortal, "Використовує", "HTTPS")
    Rel(admin, carrierPortal, "Використовує", "HTTPS")

    Rel(clientPortal, gateway, "Запити API", "REST / HTTPS")
    Rel(clientPortal, gateway, "Потік статусів", "SSE / HTTPS")
    Rel(carrierPortal, gateway, "Запити API", "REST / HTTPS")
    Rel(carrierApis, gateway, "Події статусу", "Webhooks / HTTPS")

    Rel(gateway, identity, "Отримує публічні ключі JWKS", "HTTP / JSON")
    Rel(gateway, redis, "Лічильники Token Bucket", "RESP / TCP")
    Rel(gateway, shipment, "Маршрутизує запити", "gRPC / HTTP/2")
    Rel(gateway, quote, "Маршрутизує запити", "gRPC / HTTP/2")
    Rel(gateway, carrierMgmt, "Маршрутизує запити", "gRPC / HTTP/2")
    Rel(gateway, order, "Маршрутизує запити", "gRPC / HTTP/2")
    Rel(gateway, tracking, "Маршрутизує запити та SSE", "gRPC / HTTP/2")
    Rel(gateway, docs, "Маршрутизує запити", "gRPC / HTTP/2")

    Rel(identity, pg, "Зберігає облікові записи", "SQL / TCP")
    Rel(shipment, pg, "Зберігає запити та outbox", "SQL / TCP")
    Rel(shipment, kafka, "Публікує shipment.requested", "Kafka protocol / TCP")
    Rel(quote, kafka, "Споживає shipment.requested, публікує quotes.generated", "Kafka protocol / TCP")
    Rel(quote, carrierMgmt, "Запитує тарифні сітки", "gRPC / HTTP/2")
    Rel(quote, carrierApis, "Запитує тарифи", "REST / HTTPS")
    Rel(quote, scoring, "Передає пропозиції на ранжування", "REST / HTTP, JSON")
    Rel(quote, redis, "Кешує пропозиції", "RESP / TCP")
    Rel(quote, pg, "Зберігає пропозиції та outbox", "SQL / TCP")
    Rel(carrierMgmt, pg, "Зберігає тарифи та місткість", "SQL / TCP")
    Rel(carrierMgmt, kafka, "Споживає команди резервування, публікує результат", "Kafka protocol / TCP")
    Rel(order, kafka, "Публікує команди Saga, споживає відповіді", "Kafka protocol / TCP")
    Rel(order, pg, "Зберігає стан Saga та outbox", "SQL / TCP")
    Rel(payment, kafka, "Споживає команди escrow та страхування", "Kafka protocol / TCP")
    Rel(payment, pg, "Зберігає платежі та поліси", "SQL / TCP")
    Rel(payment, paymentProvider, "Утримує та повертає кошти", "REST / HTTPS")
    Rel(payment, insuranceProvider, "Розраховує премію, оформлює поліс", "REST / HTTPS")
    Rel(tracking, kafka, "Публікує та споживає tracking.events", "Kafka protocol / TCP")
    Rel(tracking, pg, "Зберігає read-model статусів", "SQL / TCP")
    Rel(docs, kafka, "Споживає події життєвого циклу", "Kafka protocol / TCP")
    Rel(docs, minio, "Зберігає PDF", "S3 API / HTTPS")
    Rel(docs, messaging, "Надсилає сповіщення", "SMTP / TLS, Bot API / HTTPS")

    Rel(gateway, otel, "Експортує телеметрію", "OTLP / gRPC")
    Rel(quote, otel, "Експортує телеметрію", "OTLP / gRPC")
    Rel(order, otel, "Експортує телеметрію", "OTLP / gRPC")
    Rel(tracking, otel, "Експортує телеметрію", "OTLP / gRPC")
```

**Опис вузлів.** Кожен контейнер розгортається як окремий Docker-образ; stateless-сервіси масштабуються горизонтально ([SRS-NFR-SCAL-01](./srs.md#srs-nfr-scal-01), [SRS-NFR-DEP-01](./srs.md#srs-nfr-dep-01)). Сервіси Identity, Shipment, Carrier Management, Quote Engine, Order, Payment, Tracking використовують окремі логічні бази даних в одному кластері PostgreSQL (Database per Service на рівні логічної ізоляції); звернення одного сервісу до бази іншого заборонене. Спільна відповідальність усіх сервісів — експорт телеметрії до Observability Stack (OTLP / gRPC); на діаграмі показано чотири сервіси, решта сервісів експортують телеметрію аналогічно.

**Трасування контейнерів до вимог.**

| Контейнер | Реалізовані вимоги | Рішення |
|---|---|---|
| Identity Service | [SRS-FUN-01](./srs.md#srs-fun-01), [SRS-FUN-02](./srs.md#srs-fun-02), [SRS-NFR-SEC-01](./srs.md#srs-nfr-sec-01), [SRS-FUN-21](./srs.md#srs-fun-21) | — |
| API Gateway | [SRS-FUN-03](./srs.md#srs-fun-03), [SRS-NFR-SEC-03](./srs.md#srs-nfr-sec-03) | — |
| Shipment Request Service | [SRS-FUN-04](./srs.md#srs-fun-04), [SRS-FUN-05](./srs.md#srs-fun-05) | [ADR-001](./adr/0001-choice-of-technology.md) |
| Quote Engine Service | [SRS-FUN-06](./srs.md#srs-fun-06), [SRS-FUN-07](./srs.md#srs-fun-07), [SRS-NFR-PERF-02](./srs.md#srs-nfr-perf-02), [SRS-NFR-REL-02](./srs.md#srs-nfr-rel-02) | [ADR-001](./adr/0001-choice-of-technology.md) |
| Quote Scoring Service | [SRS-FUN-08](./srs.md#srs-fun-08), [SRS-FUN-09](./srs.md#srs-fun-09) | — |
| Carrier Management Service | [SRS-FUN-10](./srs.md#srs-fun-10), [SRS-FUN-11](./srs.md#srs-fun-11) | — |
| Order Orchestrator | [SRS-FUN-12](./srs.md#srs-fun-12), [SRS-FUN-13](./srs.md#srs-fun-13), [SRS-FUN-14](./srs.md#srs-fun-14), [SRS-NFR-CONS-02](./srs.md#srs-nfr-cons-02) | [ADR-001](./adr/0001-choice-of-technology.md) |
| Payment and Insurance Service | [SRS-FUN-12](./srs.md#srs-fun-12), [SRS-NFR-SEC-05](./srs.md#srs-nfr-sec-05) | — |
| Tracking Service | [SRS-FUN-15](./srs.md#srs-fun-15), [SRS-FUN-16](./srs.md#srs-fun-16), [SRS-FUN-17](./srs.md#srs-fun-17), [SRS-NFR-PERF-03](./srs.md#srs-nfr-perf-03), [SRS-NFR-CONS-01](./srs.md#srs-nfr-cons-01) | [ADR-001](./adr/0001-choice-of-technology.md) |
| Document and Notification Service | [SRS-FUN-18](./srs.md#srs-fun-18), [SRS-FUN-19](./srs.md#srs-fun-19), [SRS-FUN-20](./srs.md#srs-fun-20) | — |
| Observability Stack | [SRS-NFR-OBS-01](./srs.md#srs-nfr-obs-01) | — |

## 2.2. Компонентне моделювання критичного сервісу системи

Для компонентного моделювання обрано Quote Engine Service (NestJS, TypeScript): сервіс містить основне обчислювальне навантаження системи (паралельний збір пропозицій від множини джерел) та вимагає ізоляції збоїв зовнішніх систем.

<a id="diagram-level3"></a>

### 2.2.1. C4 Level 3 — Component (Quote Engine Service)

```mermaid
C4Component
    title Component Diagram — Quote Engine Service

    Container(gateway, "API Gateway", "NestJS", "Маршрутизація та RBAC")
    ContainerQueue(kafka, "Apache Kafka", "Kafka", "Шина подій")
    Container(carrierMgmt, "Carrier Management Service", "NestJS", "Тарифні сітки")
    Container(scoring, "Quote Scoring Service", "FastAPI", "Ранжування та ETA")
    System_Ext(carrierApis, "Carrier APIs", "Системи перевізників")
    ContainerDb(pg, "PostgreSQL", "PostgreSQL 16", "Пропозиції, outbox")
    ContainerDb(redis, "Redis", "Redis 7", "Кеш пропозицій")
    Container(otel, "Observability Stack", "OpenTelemetry", "Телеметрія")

    Container_Boundary(quoteBoundary, "Quote Engine Service") {
        Component(ctrl, "QuoteController", "NestJS Controller, gRPC", "Вхідний шар: запит пропозицій і вибір пропозиції")
        Component(consumer, "ShipmentRequestedConsumer", "NestJS Kafka Consumer", "Вхідний шар: споживання shipment.requested")
        Component(guards, "JwtAuthGuard та RolesGuard", "NestJS Guards", "Перевірка JWT та RBAC")
        Component(validation, "ValidationPipe", "class-validator DTO", "Валідація вхідних даних")
        Component(errors, "GlobalExceptionFilter", "NestJS Filter", "Єдина обробка помилок")
        Component(telemetry, "TelemetryInterceptor", "OpenTelemetry SDK", "Trace-id, метрики RED")
        Component(orchestration, "QuoteOrchestrationService", "Application Service", "Сценарій формування пропозицій")
        Component(weight, "ChargeableWeightCalculator", "Domain Service", "Тарифікована вага")
        Component(normalizer, "TariffNormalizer", "Domain Service", "Нормалізація тарифів перевізників")
        Component(carrierPort, "CarrierQuotePort", "Interface", "Порт отримання пропозицій перевізника")
        Component(rankingPort, "RankingPort", "Interface", "Порт ранжування")
        Component(gridProvider, "TariffGridQuoteProvider", "gRPC Client Adapter", "Пропозиції за тарифними сітками")
        Component(apiProvider, "ExternalCarrierApiProvider", "HTTP Client Adapter", "Пропозиції через API перевізників")
        Component(breaker, "CircuitBreakerPolicy", "Resilience Policy", "Таймаут 2 с, Circuit Breaker, повторні спроби")
        Component(scoringClient, "ScoringServiceClient", "HTTP Client Adapter", "Виклик сервісу ранжування")
        Component(repo, "QuoteRepository", "Repository Adapter", "Збереження пропозицій")
        Component(cache, "QuoteCache", "Cache Adapter", "Кеш пропозицій")
        Component(outbox, "OutboxRelay", "Kafka Producer", "Публікація подій з outbox")
    }

    Rel(gateway, ctrl, "Запит пропозицій", "gRPC / HTTP/2")
    Rel(kafka, consumer, "shipment.requested", "Kafka protocol / TCP")
    Rel(ctrl, guards, "Застосовує декоратор UseGuards", "Dependency Injection")
    Rel(ctrl, validation, "Застосовує ValidationPipe", "Dependency Injection")
    Rel(ctrl, orchestration, "Викликає сценарій", "Interface call")
    Rel(consumer, orchestration, "Викликає сценарій", "Interface call")
    Rel(ctrl, errors, "Передає винятки", "Exception Filter")
    Rel(ctrl, telemetry, "Підключає інтерсептор", "Interceptor")
    Rel(orchestration, weight, "Розраховує тарифіковану вагу", "Interface call")
    Rel(orchestration, normalizer, "Нормалізує тарифи", "Interface call")
    Rel(orchestration, carrierPort, "Запитує пропозиції паралельно", "Interface call, Promise.allSettled")
    Rel(orchestration, rankingPort, "Запитує ранжування", "Interface call")
    Rel(orchestration, repo, "Зберігає результат", "Interface call")
    Rel(orchestration, cache, "Читає та записує кеш", "Interface call")
    Rel(gridProvider, carrierPort, "Реалізує порт", "Dependency Inversion")
    Rel(apiProvider, carrierPort, "Реалізує порт", "Dependency Inversion")
    Rel(scoringClient, rankingPort, "Реалізує порт", "Dependency Inversion")
    Rel(apiProvider, breaker, "Обгортає виклики", "Decorator")
    Rel(gridProvider, carrierMgmt, "Запитує тарифні сітки", "gRPC / HTTP/2")
    Rel(apiProvider, carrierApis, "Запитує тарифи", "REST / HTTPS")
    Rel(scoringClient, scoring, "Передає пропозиції", "REST / HTTP, JSON")
    Rel(repo, pg, "Читає та пише пропозиції і outbox", "SQL / TCP")
    Rel(cache, redis, "Читає та пише ключі", "RESP / TCP")
    Rel(repo, outbox, "Передає записи outbox", "Polling outbox-таблиці")
    Rel(outbox, kafka, "Публікує quotes.generated", "Kafka protocol / TCP")
    Rel(telemetry, otel, "Експортує трасування та метрики", "OTLP / gRPC")
```

**Опис компонентів.**

| Компонент | Шар | Роль | Взаємодія |
|---|---|---|---|
| QuoteController | Inbound | Приймає запит пропозицій та вибір пропозиції від API Gateway | gRPC / HTTP/2; делегує QuoteOrchestrationService |
| ShipmentRequestedConsumer | Inbound | Споживає подію shipment.requested та запускає формування пропозицій | Kafka protocol / TCP; делегує QuoteOrchestrationService |
| JwtAuthGuard, RolesGuard | Cross-cutting | Верифікація JWT (RS256) та перевірка ролі (RBAC) до виконання контролера | NestJS Guards, Dependency Injection |
| ValidationPipe | Cross-cutting | Валідація DTO вхідних даних до передачі в бізнес-логіку | class-validator |
| GlobalExceptionFilter | Cross-cutting | Єдине перетворення винятків у відповіді та журнал помилок | NestJS Exception Filter |
| TelemetryInterceptor | Cross-cutting | Присвоєння та передача trace-id, збір метрик RED | OpenTelemetry SDK, OTLP / gRPC |
| QuoteOrchestrationService | Core | Сценарій: розрахунок ваги, паралельний збір пропозицій, нормалізація, ранжування, збереження | Залежить лише від інтерфейсів (портів) |
| ChargeableWeightCalculator | Core (Domain) | Обчислення тарифікованої ваги за [SRS-FUN-05](./srs.md#srs-fun-05); не має зовнішніх залежностей | Interface call |
| TariffNormalizer | Core (Domain) | Приведення тарифних моделей перевізників до єдиної структури | Interface call |
| CarrierQuotePort, RankingPort | Core (Ports) | Інтерфейси, що реалізують принцип Dependency Inversion | TypeScript interface |
| TariffGridQuoteProvider | Outbound | Отримує тарифні сітки з Carrier Management Service | gRPC / HTTP/2 |
| ExternalCarrierApiProvider | Outbound | Отримує тарифи від зовнішніх API перевізників | REST / HTTPS |
| CircuitBreakerPolicy | Outbound (Resilience) | Таймаут 2 с та Circuit Breaker за [SRS-NFR-REL-02](./srs.md#srs-nfr-rel-02) | Decorator |
| ScoringServiceClient | Outbound | Передає пропозиції до Quote Scoring Service | REST / HTTP, JSON |
| QuoteRepository | Outbound | Зберігання пропозицій та записів outbox однією транзакцією | SQL / TCP |
| QuoteCache | Outbound | Кешування пропозицій | RESP / TCP |
| OutboxRelay | Outbound | Публікація подій з таблиці outbox у Kafka | Kafka protocol / TCP |

**Дотримання принципів.** Контролер та споживач не мають прямого доступу до баз даних або зовнішніх систем і звертаються лише до QuoteOrchestrationService. Доменні компоненти (ChargeableWeightCalculator, TariffNormalizer) не залежать від фреймворку та інфраструктури. Залежності оркестраційного сервісу спрямовані на інтерфейси (CarrierQuotePort, RankingPort); реалізації (adapters) підключаються через Dependency Injection (принцип інверсії залежностей). Вимоги, що реалізуються: [SRS-FUN-06](./srs.md#srs-fun-06), [SRS-FUN-07](./srs.md#srs-fun-07), [SRS-FUN-08](./srs.md#srs-fun-08), [SRS-FUN-03](./srs.md#srs-fun-03), [SRS-NFR-SEC-06](./srs.md#srs-nfr-sec-06), [SRS-NFR-OBS-01](./srs.md#srs-nfr-obs-01), [SRS-NFR-CONS-01](./srs.md#srs-nfr-cons-01) (Transactional Outbox, [ADR-001](./adr/0001-choice-of-technology.md)).

## 2.3. Документування архітектурних рішень (Architecture Decision Records)

| ID | Рішення | Статус | Документ |
|---|---|---|---|
| ADR-001 | Apache Kafka замість RabbitMQ як брокер подій | Approved | [0001-choice-of-technology.md](./adr/0001-choice-of-technology.md) |

## 2.4. Проєктування та моделювання баз даних

Згідно з патерном Database per Service, кожен мікросервіс володіє ізольованою логічною базою даних у кластері PostgreSQL 16. Схема відповідає Третій нормальній формі (3NF) та містить технічні поля аудиту (`created_at`, `updated_at`, `deleted_at`), версіонування для оптимістичного блокування (`version`) та таблиці `outbox_events` / `processed_events` для реалізації патернів Transactional Outbox та Idempotent Consumer.

```mermaid
erDiagram
    USERS ||--o{ SHIPMENT_REQUESTS : creates
    USERS ||--o| CARRIERS : manages
    CARRIERS ||--o{ TARIFF_GRIDS : defines
    SHIPMENT_REQUESTS ||--|{ PARCEL_ITEMS : contains
    SHIPMENT_REQUESTS ||--o{ QUOTES : receives
    CARRIERS ||--o{ QUOTES : provides
    SHIPMENT_REQUESTS ||--o| ORDERS : converts_to
    QUOTES ||--o| ORDERS : selected_in
    ORDERS ||--o{ TRACKING_EVENTS : logs
    ORDERS ||--o{ OUTBOX_EVENTS : emits

    USERS {
        uuid id PK
        varchar email UK "NOT NULL"
        varchar password_hash "NOT NULL, Argon2id"
        varchar role "NOT NULL (CLIENT, CARRIER, ADMIN)"
        timestamptz created_at "NOT NULL"
        timestamptz updated_at "NOT NULL"
        timestamptz deleted_at "NULL, Soft Delete"
    }

    CARRIERS {
        uuid id PK
        uuid owner_user_id FK "UNIQUE, NOT NULL"
        varchar company_name "NOT NULL"
        varchar registration_code UK "NOT NULL"
        numeric rating "NOT NULL, DEFAULT 5.00"
        int volumetric_divisor "NOT NULL, DEFAULT 5000"
        boolean is_verified "NOT NULL, DEFAULT false"
        timestamptz created_at "NOT NULL"
        timestamptz updated_at "NOT NULL"
    }

    TARIFF_GRIDS {
        uuid id PK
        uuid carrier_id FK "NOT NULL"
        char origin_country "NOT NULL"
        char destination_country "NOT NULL"
        numeric min_weight_kg "NOT NULL"
        numeric max_weight_kg "NOT NULL"
        numeric rate_per_kg_usd "NOT NULL"
        int transit_days_min "NOT NULL"
        int transit_days_max "NOT NULL"
        timestamptz valid_until "NOT NULL"
    }

    SHIPMENT_REQUESTS {
        uuid id PK
        uuid client_id FK "NOT NULL"
        uuid idempotency_key UK "NOT NULL"
        char origin_country "NOT NULL"
        varchar origin_city "NOT NULL"
        char destination_country "NOT NULL"
        varchar destination_city "NOT NULL"
        varchar cargo_category "NOT NULL"
        varchar hs_code "NOT NULL"
        numeric declared_value_usd "NOT NULL"
        varchar incoterm "NOT NULL"
        numeric total_actual_weight_kg "NOT NULL"
        numeric total_chargeable_weight_kg "NOT NULL"
        varchar status "NOT NULL"
        timestamptz created_at "NOT NULL"
        timestamptz updated_at "NOT NULL"
    }

    PARCEL_ITEMS {
        uuid id PK
        uuid shipment_id FK "NOT NULL"
        numeric length_cm "NOT NULL"
        numeric width_cm "NOT NULL"
        numeric height_cm "NOT NULL"
        numeric weight_kg "NOT NULL"
        int quantity "NOT NULL"
    }

    QUOTES {
        uuid id PK
        uuid shipment_id FK "NOT NULL"
        uuid carrier_id FK "NOT NULL"
        numeric total_price_usd "NOT NULL"
        int estimated_days "NOT NULL"
        numeric score "NOT NULL"
        timestamptz expires_at "NOT NULL"
        timestamptz created_at "NOT NULL"
    }

    ORDERS {
        uuid id PK
        uuid shipment_id FK "UNIQUE, NOT NULL"
        uuid quote_id FK "UNIQUE, NOT NULL"
        uuid idempotency_key UK "NOT NULL"
        varchar status "NOT NULL"
        numeric escrow_amount_usd "NOT NULL"
        boolean insurance_required "NOT NULL"
        int version "NOT NULL, DEFAULT 1"
        timestamptz created_at "NOT NULL"
        timestamptz updated_at "NOT NULL"
    }

    TRACKING_EVENTS {
        uuid event_id PK
        uuid order_id FK "NOT NULL"
        varchar status_code "NOT NULL"
        varchar location "NOT NULL"
        timestamptz occurred_at "NOT NULL"
        timestamptz processed_at "NOT NULL"
    }

    OUTBOX_EVENTS {
        uuid id PK
        uuid aggregate_id "NOT NULL"
        varchar aggregate_type "NOT NULL"
        varchar event_type "NOT NULL"
        jsonb payload "NOT NULL"
        varchar status "NOT NULL (PENDING, PUBLISHED)"
        timestamptz created_at "NOT NULL"
    }
```

### Специфікація ключових таблиць та план індексування

| Таблиця | Призначення | Критичні індекси та обґрунтування |
| :--- | :--- | :--- |
| `USERS` | Облікові записи користувачів та ролі RBAC (`SRS-FUN-01`) | `UNIQUE B-Tree (email) WHERE deleted_at IS NULL` — швидкий пошук при автентифікації з підтримкою Soft Delete |
| `TARIFF_GRIDS` | Вагові та маршрутні тарифні сітки перевізників (`SRS-FUN-10`) | Складений `B-Tree (origin_country, destination_country, valid_until)` — фільтрація актуальних тарифів за напрямком |
| `SHIPMENT_REQUESTS` | Вантажні запити клієнтів з агрегованою вагою (`SRS-FUN-04`) | `UNIQUE B-Tree (idempotency_key)` — захист від дублювання запитів; `B-Tree (client_id, created_at DESC)` — історія запитів |
| `QUOTES` | Згенеровані та ранжовані пропозиції перевізників (`SRS-FUN-06`, `08`) | Складений `B-Tree (shipment_id, score DESC)` — вибірка відсортованих пропозицій за $O(\log N)$ |
| `ORDERS` | Агрегат замовлення та стан оркестрації Saga (`SRS-FUN-12`) | `UNIQUE B-Tree (idempotency_key)`; частковий `B-Tree (status, updated_at) WHERE status NOT IN ('COMPLETED', 'FAILED')` — виявлення завислих транзакцій |
| `TRACKING_EVENTS` | Журнал подій відстеження вантажу (`SRS-FUN-15`, `16`) | `PRIMARY KEY (event_id)` — апаратна дедуплікація; складений `B-Tree (order_id, occurred_at ASC)` — побудова хронологічної шкали |
| `OUTBOX_EVENTS` | Буфер подій для патерну Transactional Outbox (`SRS-NFR-CONS-01`) | Частковий `B-Tree (created_at ASC) WHERE status = 'PENDING'` — мінімізація навантаження при опитуванні (polling) |

## 2.5. Специфікація міжсервісних контрактів (API)

Взаємодія між `Client Portal` (`Next.js`) та бекенд-контуром через `API Gateway` спроєктована за підходом API-First. Деталізовану специфікацію ендпоінтів у форматі OpenAPI 3.0.3 зафіксовано у файлі [openapi.yaml](./api/openapi.yaml).

Ключові інженерні рішення контракту:

* **Ідемпотентність операцій запису:** методи `POST /shipments` та `POST /orders` вимагають обов'язковий заголовок `X-Idempotency-Key` формату UUID v4 (`SRS-FUN-14`).
* **Безпека та авторизація:** застосовано схему `BearerAuth` із підписаними JWT-токенами (`RS256`, `SRS-NFR-SEC-01`).
* **Детермінована обробка помилок:** усі помилки клієнтського (`400`, `401`, `403`, `404`, `409`, `429`) та серверного (`503`) рівнів уніфіковані структурою `ErrorResponseDto` із наскрізним ідентифікатором трасування `traceId` (`SRS-NFR-OBS-01`).

## 2.6. Моделювання логіки критичних вузлів

### Алгоритм 1. Розрахунок тарифікованої ваги вантажного запиту (`ChargeableWeightCalculator`)

Алгоритм реалізує вимогу `SRS-FUN-05` у модулі `Quote Engine Service`. Вхідними даними є масив вантажних місць `Parcels[0..N-1]` та об'ємний дільник перевізника `Divisor` (за замовчуванням 5000).

```mermaid
graph TD
    Start([Початок]) --> Input[/Ввід: Parcels, N, Divisor/]
    Input --> CheckEmpty{N <= 0 OR Divisor <= 0}
    CheckEmpty -- Так --> Err[/Вивід: Error INVALID_INPUT/]
    Err --> End([Кінець])
    CheckEmpty -- Ні --> Init["ActualSum := 0<br/>VolumetricSum := 0<br/>i := 0"]
    Init --> Loop{i < N}
    Loop -- Так --> CheckItem{"Parcels[i].weight <= 0 OR<br/>Parcels[i].quantity <= 0"}
    CheckItem -- Так --> Err
    CheckItem -- Ні --> CalcItem["ItemVol := (Parcels[i].L * Parcels[i].W * Parcels[i].H) / Divisor<br/>ActualSum := ActualSum + (Parcels[i].weight * Parcels[i].quantity)<br/>VolumetricSum := VolumetricSum + (ItemVol * Parcels[i].quantity)<br/>i := i + 1"]
    CalcItem --> Loop
    Loop -- Ні --> Compare{VolumetricSum > ActualSum}
    Compare -- Так --> SetVol["ChargeableWeight := VolumetricSum"]
    Compare -- Ні --> SetAct["ChargeableWeight := ActualSum"]
    SetVol --> Output[/Вивід: ChargeableWeight/]
    SetAct --> Output
    Output --> End
```

### Алгоритм 2. Опитування перевізників із Circuit Breaker та частковою деградацією (`QuoteAggregator`)

Алгоритм реалізує вимоги `SRS-FUN-06`, `SRS-FUN-07` та `SRS-NFR-REL-02`. Забезпечує захист від каскадних відмов при недоступності зовнішніх API перевізників.

```mermaid
graph TD
    Start([Початок]) --> Input[/Ввід: Carriers, M, Shipment, TimeoutMs/]
    Input --> Init["Quotes := []<br/>FailedCount := 0<br/>i := 0"]
    Init --> Loop{i < M}
    Loop -- Так --> CheckCB{"Carriers[i].cbState = OPEN AND<br/>Now < Carriers[i].nextRetryAt"}
    CheckCB -- Так --> IncFail["FailedCount := FailedCount + 1<br/>i := i + 1"]
    IncFail --> Loop
    CheckCB -- Ні --> Fetch["Resp := FetchCarrierRate(Carriers[i], Shipment, TimeoutMs)"]
    Fetch --> CheckResp{"Resp.ok = true AND<br/>Resp.price > 0"}
    CheckResp -- Так --> AddQuote["Quotes.push(Normalize(Resp))<br/>Carriers[i].failStreak := 0<br/>Carriers[i].cbState := CLOSED<br/>i := i + 1"]
    AddQuote --> Loop
    CheckResp -- Ні --> UpdateCB["Carriers[i].failStreak := Carriers[i].failStreak + 1<br/>FailedCount := FailedCount + 1"]
    UpdateCB --> Threshold{"Carriers[i].failStreak >= 10"}
    Threshold -- Так --> OpenCB["Carriers[i].cbState := OPEN<br/>Carriers[i].nextRetryAt := Now + 30000<br/>i := i + 1"]
    Threshold -- Ні --> NextIter["i := i + 1"]
    OpenCB --> Loop
    NextIter --> Loop
    Loop -- Ні --> CheckQuotes{"Quotes.length = 0"}
    CheckQuotes -- Так --> Err[/Вивід: Error NO_QUOTES_AVAILABLE/]
    Err --> End([Кінець])
    CheckQuotes -- Ні --> SetPartial["IsPartial := (FailedCount > 0)"]
    SetPartial --> Output[/Вивід: Quotes, IsPartial/]
    Output --> End
```

### Алгоритм 3. Оркестрація та компенсація розподіленої транзакції (`OrderOrchestrator`)

Алгоритм реалізує патерн Saga з компенсуючими діями у зворотному порядку (`SRS-FUN-12`, `SRS-FUN-13`) та контроль кількості спроб компенсації для запобігання нескінченним циклам.

```mermaid
graph TD
    Start([Початок]) --> Input[/Ввід: OrderId, QuoteId, MaxRetries/]
    Input --> StepsInit["Steps[0] := RESERVE_CAPACITY<br/>Steps[1] := ISSUE_INSURANCE<br/>Steps[2] := HOLD_ESCROW<br/>Steps[3] := CONFIRM_CARRIER<br/>k := 0<br/>Failed := false"]
    StepsInit --> ExecLoop{"k < 4 AND Failed = false"}
    ExecLoop -- Так --> ExecCmd["Res := ExecuteForward(Steps[k], OrderId, QuoteId)"]
    ExecCmd --> CheckExec{"Res.ok = true"}
    CheckExec -- Так --> NextStep["Order.status := Steps[k]<br/>k := k + 1"]
    NextStep --> ExecLoop
    CheckExec -- Ні --> MarkFail["Failed := true<br/>c := k - 1"]
    MarkFail --> ExecLoop
    ExecLoop -- Ні --> IsFailed{"Failed = true"}
    IsFailed -- Ні --> Success["Order.status := CONFIRMED"]
    Success --> OutOk[/Вивід: Order.status/]
    OutOk --> End([Кінець])
    IsFailed -- Так --> CompLoop{"c >= 0"}
    CompLoop -- Так --> InitRetry["Retry := 0<br/>CompOk := false"]
    InitRetry --> RetryLoop{"Retry < MaxRetries AND CompOk = false"}
    RetryLoop -- Так --> ExecComp["CompRes := ExecuteCompensate(Steps[c], OrderId)"]
    ExecComp --> CheckComp{"CompRes.ok = true"}
    CheckComp -- Так --> SetCompOk["CompOk := true"]
    CheckComp -- Ні --> IncRetry["Retry := Retry + 1"]
    SetCompOk --> RetryLoop
    IncRetry --> RetryLoop
    RetryLoop -- Ні --> CheckCompFinal{"CompOk = false"}
    CheckCompFinal -- Так --> Alert["Order.status := MANUAL_INTERVENTION<br/>EmitCriticalAlert(OrderId, Steps[c])"]
    Alert --> OutFail[/Вивід: Order.status/]
    OutFail --> End
    CheckCompFinal -- Ні --> PrevStep["c := c - 1"]
    PrevStep --> CompLoop
    CompLoop -- Ні --> SetCompensated["Order.status := FAILED"]
    SetCompensated --> OutFail
```

## 2.7. Інтеграційний аудит та верифікація цілісності доменів

### Production Readiness Report (Контроль інтеграційної цілісності)

За результатами перехресного аудиту між схемою даних (підрозділ 2.4), специфікацією OpenAPI (підрозділ 2.5) та алгоритмами критичних вузлів (підрозділ 2.6) встановлено повну узгодженість інтерфейсів:

1. **Узгодженість API ↔ База даних (API-to-Database Consistency):**
   * Усі атрибути `CreateShipmentRequestDto` (`originCountry`, `hsCode`, `declaredValueUsd`, `incoterm`) мають пряме відображення на стовпці таблиці `SHIPMENT_REQUESTS` із дотриманням розмірності (`CHAR(2)`, `VARCHAR`, `NUMERIC`).
   * Вкладений масив `parcels[]` в OpenAPI декомпоновано у зв'язану таблицю `PARCEL_ITEMS` зі зв'язком `1:M` (`SHIPMENT_REQUESTS ||--|{ PARCEL_ITEMS`) відповідно до 3NF.
   * Заголовок `X-Idempotency-Key` має відповідні унікальні обмеження `idempotency_key UK` у таблицях `SHIPMENT_REQUESTS` та `ORDERS`.
2. **Узгодженість Логіка ↔ API та БД (Logic-to-API/Data Consistency):**
   * Поля геометричних параметрів `L`, `W`, `H`, `weight`, `quantity` та об'ємний дільник `volumetric_divisor` в Алгоритмі 1 повністю збігаються зі схемою `ParcelItemDto` та таблицею `CARRIERS`.
   * Прапорець часткової деградації `IsPartial`, який обчислюється в Алгоритмі 2, задекларований у вихідній моделі `QuoteListResponseDto.isPartial`.
   * Стани життєвого циклу замовлення `CONFIRMED` та `FAILED` в Алгоритмі 3 синхронізовані з переліком допустимих значень `OrderResponseDto.status`.
3. **Висновок комісії (Quality Gate):**
   * Критичних блокувальних розбіжностей (Showstoppers) не виявлено. Специфікації Розділу 2 узгоджені та готові до передачі на етап програмної реалізації (Розділ 3 кваліфікаційної роботи).

## Висновки до розділу 2
