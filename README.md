# Vectix — Документація кваліфікаційного проєкту

**Тема:** Проєктування та розробка хмароорієнтованої мікросервісної платформи-агрегатора міжнародних вантажних перевезень з динамічним порівнянням пропозицій перевізників та відстеженням вантажів у реальному часі.

**Спеціальність:** F2 Інженерія програмного забезпечення

## Зміст

| Файл | Розділ |
|---|---|
| [proposal.md](proposal.md) | Thesis Proposal |
| [0_intro.md](0_intro.md) | Вступ та науковий апарат |
| [1_analysis.md](1_analysis.md) | Розділ 1. Аналіз предметної області та постановка задачі дослідження |
| [2_design.md](2_design.md) | Розділ 2. Проєктування (UML, C4, схеми даних) |
| [3_implementation.md](3_implementation.md) | Розділ 3. Реалізація, тестування, розгортання |
| [4_conclusions.md](4_conclusions.md) | Висновки |

## Робочий документ Розділу 1

Google Docs (доступ «Can comment»): [F2_Diploma_Chapter1](https://docs.google.com/document/d/1XnsUoH4SxvJM_VTPM5jImrsVDD12gr9qOn7lqlzYUeE/edit?usp=sharing)

## Календарний план

| № з/п | Назва етапу кваліфікаційної роботи | Термін виконання етапів проєкту | Статус |
|---|---|---|---|
| 1 | Аналіз предметної області та програмних аналогів, формування вимог | 14.10.2026 – 10.11.2026 | Done |
| 2 | Обґрунтування архітектурного стилю та технологічного стеку | 11.11.2026 – 30.11.2026 | In Progress |
| 3 | Проєктування архітектури (C4, UML, схеми БД, ADR) | 01.12.2026 – 15.01.2027 | To Do |
| 4 | Алгоритмізація критичних вузлів та розробка базового коду | 16.01.2027 – 28.02.2027 | To Do |
| 5 | Проєктування інтерфейсів та схеми розгортання (Docker, Kubernetes, CI/CD) | 01.03.2027 – 25.03.2027 | To Do |
| 6 | Інструментальний аудит: тестування, навантаження, статичний аналіз, безпека | 26.03.2027 – 12.04.2027 | To Do |
| 7 | Апробація результатів та підготовка наукової публікації | 13.04.2027 – 30.04.2027 | To Do |

> Травень 2027 зарезервовано під нормоконтроль та передзахист.

## NFRs Matrix (зведення)

Повна матриця: [1_analysis.md, підрозділ 1.5.3](1_analysis.md).

| Категорія | Ключова вимога |
|---|---|
| Продуктивність | p95 Latency ≤ 200 мс при 500 RPS; генерація пропозицій p95 ≤ 3 с при 100 RPS |
| Масштабованість | Stateless-сервіси, ≥ 2 репліки, HPA за CPU 70% |
| Консистентність | Eventual consistency ≤ 5 с; Transactional Outbox, Idempotent Consumer; компенсація Saga ≤ 30 с |
| Надійність | Доступність ≥ 99,9%; Circuit Breaker (≥ 50% помилок у вікні з 20 запитів); RPO ≤ 5 хв, RTO ≤ 30 хв |
| Безпека | OAuth 2.0 / OIDC, JWT (RS256), TLS ≥ 1.2, Argon2id, Rate Limiting 100 запитів/хв, Trivy: 0 CRITICAL/HIGH |
| Комплаєнс | GDPR та Закон України «Про захист персональних даних», PCI DSS (без зберігання даних карток) |
| Якість коду | Покриття доменної логіки ≥ 80%; SonarQube Quality Gate: 0 Blocker/Critical |
| Спостережуваність | OpenTelemetry trace-id для 100% міжсервісних запитів; метрики RED у Prometheus/Grafana |

# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and
  `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
bun exec turbo build
bun exec turbo build
```

You can build a specific package by using a
[filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
bun exec turbo build --filter=docs
bun exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
bun exec turbo dev
bun exec turbo dev
```

You can develop a specific package by using a
[filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
bun exec turbo dev --filter=web
bun exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at
> [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as
[Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache
artifacts across machines, enabling you to share build caches with your team and CI/CD
pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an
account with Vercel. If you don't have an account you can
[create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the
following commands:

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
bun exec turbo login
bun exec turbo login
```

This will authenticate the Turborepo CLI with your
[Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command
from the root of your Turborepo:

With
[global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation)
installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
bun exec turbo link
bun exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
