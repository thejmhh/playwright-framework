# Playwright QA Automation Framework

> Multi-domain end-to-end automation framework built with **Playwright + TypeScript**.
> Demonstrates Page Object Model, custom fixtures per domain, data-driven tests,
> API testing, multi-environment configuration, Allure reporting, and CI/CD on
> **both GitHub Actions and GitLab CI**.

[![Playwright](https://img.shields.io/badge/Playwright-1.42-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure-3.0-FF6B6B?logo=allure&logoColor=white)](https://docs.qameta.io/allure/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🇪🇸 [Versión en español](README.es.md)

---

## Highlights for reviewers

- 🏗 **Page Object Model** organized by business domain (`ecommerce`, `airline`, extensible to `insurance`).
- 🧩 **Custom fixtures per domain** — Page Objects are dependency-injected into specs.
- 🧪 **Test types**: smoke, e2e, functional, data-driven, network mocking, multi-tab, native dialogs, API.
- 🌐 **Multi-environment** via `dotenv` (`config/.env.qa`, `config/.env.stage`).
- 🔐 **Auth state caching** with `globalSetup` + `storageState` so most specs skip the login UI.
- 🦊 **Cross-browser** matrix: Chromium, Firefox, WebKit.
- 📊 **Allure reporting** with epics/features/stories/severity labels.
- 🤖 **CI/CD on two platforms**: GitHub Actions _and_ GitLab CI, both publish the Allure report to Pages.
- 🧹 **Code quality**: ESLint flat config + Prettier + Husky pre-commit + lint-staged + TypeScript strict.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Reports](#reports)
- [Architecture decisions](#architecture-decisions)
- [CI/CD](#cicd)
- [Skills demonstrated](#skills-demonstrated)
- [License](#license)

---

## Tech stack

| Layer        | Tool                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| Test runner  | [Playwright Test](https://playwright.dev/) 1.42                                    |
| Language     | TypeScript 5 (strict mode)                                                         |
| Reporting    | Allure + HTML (built-in) + JUnit (for CI)                                          |
| Quality      | ESLint 9 (flat config), Prettier 3, Husky 9, lint-staged 15                        |
| Config       | dotenv, multi-env, multi-domain                                                    |
| CI/CD        | GitHub Actions, GitLab CI                                                          |
| Sandbox APIs | [reqres.in](https://reqres.in)                                                     |
| Sandbox UIs  | [saucedemo.com](https://www.saucedemo.com), [blazedemo.com](https://blazedemo.com) |

---

## Project structure

```
playwright-framework/
├── config/
│   ├── .env.qa                 # Env vars per environment (committed: demo creds only)
│   ├── .env.stage
│   ├── env.ts                  # Loads dotenv + selects active domain config
│   └── domains/
│       ├── ecommerce.config.ts
│       ├── airline.config.ts
│       └── insurance.config.ts
├── fixtures/
│   ├── baseFixture.ts          # Cross-cutting hooks (page error capture, etc.)
│   ├── ecommerceFixture.ts     # Injects ecommerce Page Objects
│   └── airlineFixture.ts       # Injects airline Page Objects + UserApiHelper
├── pages/
│   ├── ecommerce/              # LoginPage, InventoryPage, CartPage, CheckoutPage
│   └── airline/                # HomePage, ReservePage, PurchasePage
├── tests/
│   ├── ecommerce/
│   │   ├── smoke/              # @smoke — login flows
│   │   ├── e2e/                # @e2e — checkout, data-driven add-to-cart
│   │   └── functional/         # @functional — alerts, multi-tab
│   └── airline/                # @AirlineFunc — mocking, multi-tab, dynamic XPath, API
├── utils/
│   ├── helpers.ts              # Screenshot attach, retry helpers
│   ├── dataFactory.ts          # Synthetic test data
│   ├── UserApiHelper.ts        # API client targeting reqres.in
│   └── helpers/allure.ts       # Allure label helpers (epic/feature/story/severity)
├── test-data/                  # Static data sets (PRODUCTS, USERS)
├── storage/                    # Generated auth states (gitignored, .gitkeep tracked)
├── global-setup.ts             # One-time login → storageState
├── playwright.config.ts        # Reporters, projects, timeouts, baseURL
├── tsconfig.json               # Path aliases, strict mode
├── eslint.config.js            # Flat config
├── .gitlab-ci.yml              # GitLab CI pipeline
└── .github/workflows/          # GitHub Actions pipeline
    └── playwright.yml
```

---

## Getting started

### Prerequisites

- Node.js ≥ 18 (use `nvm use` — there's a `.nvmrc`)
- npm

### Install

```bash
git clone <this-repo>
cd playwright-framework
npm ci
npx playwright install --with-deps
```

The `.env.qa` is committed because it only contains **public demo credentials**
(`saucedemo.com` documents `standard_user` / `secret_sauce` openly). For real
projects, copy `.env.example` to a `.env.local` file and gitignore it.

---

## Running tests

```bash
# All tests, all browsers
npm test

# By browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# By domain
npm run test:ecommerce
npm run test:airline

# By tag
npm run smoke:qa          # @smoke
npm run e2e:qa            # @e2e
npm run functional:qa     # @functional

# Headed mode (see the browser)
HEADED=1 npm test
# or
npm run test:headed

# Interactive UI mode (great for development)
npm run test:ui

# Debugger
npm run test:debug
```

### Useful environment variables

| Variable | Default     | Description                            |
| -------- | ----------- | -------------------------------------- |
| `DOMAIN` | `ecommerce` | `ecommerce`, `airline`, or `insurance` |
| `ENV`    | `qa`        | Loads `config/.env.${ENV}`             |
| `HEADED` | unset       | Set to `1` to disable headless mode    |
| `CI`     | unset       | When set, retries=2 and workers=50%    |

---

## Reports

```bash
# Built-in Playwright HTML report
npm run report

# Allure report (richer — epics/features/stories/severity)
npm run allure:generate && npm run allure:open
# or in one shot:
npm run allure:serve
```

In CI both reports are published automatically:

- **GitHub Actions** → Allure deployed to the `gh-pages` branch.
- **GitLab CI** → Allure published via GitLab Pages at
  `https://<group>.gitlab.io/<project>/`.

---

## Architecture decisions

### Why fixtures-per-domain?

Each domain owns its Page Objects. A spec under `tests/ecommerce/` imports
`ecommerceFixture` and gets `loginPage`, `inventoryPage`, `cartPage`,
`checkoutPage` injected. Specs under `tests/airline/` import `airlineFixture`
and get `homePage`, `reservePage`, `purchasePage`, `apiHelper`.

This keeps test files small (no boilerplate `new InventoryPage(page)`) and
makes the dependency graph explicit.

### Why a global setup?

Login UI is exercised once per run (in `global-setup.ts`) and the resulting
`storageState` is reused by every spec that declares
`test.use({ storageState: 'storage/standard.json' })`. This shaves significant
time off the suite and isolates _the auth flow itself_ in dedicated smoke
specs that **don't** use the saved state.

### Why fail-fast on missing env vars?

`config/env.ts` throws immediately if the active domain has no `baseURL`. Tests
crash with a clear message at config-load time instead of failing mid-flight
with `TypeError: Cannot read properties of undefined`.

### Why `reqres.in` for the API tests?

It's a free, well-known sandbox API that returns realistic shapes. The
framework's `UserApiHelper` is generic — point it at your real backend by
overriding `API_BASE_URL`.

---

## CI/CD

### GitHub Actions (`.github/workflows/playwright.yml`)

1. **lint** stage: prettier check, eslint, tsc --noEmit
2. **test** matrix: chromium / firefox / webkit in parallel
3. **publish-report**: merges Allure results from all browsers and pushes to
   `gh-pages` (only on `main`)

### GitLab CI (`.gitlab-ci.yml`)

Same shape, four stages:

1. `lint` — fast feedback
2. `test` — matrix per browser, JUnit reports surface in the MR view
3. `report` — single merged Allure report
4. `pages` — publishes the report to GitLab Pages

Both pipelines pin Node via `.nvmrc` and use the official Playwright Docker
image (`mcr.microsoft.com/playwright`) for the test stage in GitLab.

---

## Skills demonstrated

| Capability                                             | Where to look                                         |
| ------------------------------------------------------ | ----------------------------------------------------- |
| Page Object Model                                      | `pages/ecommerce/`, `pages/airline/`                  |
| Custom fixtures (DI)                                   | `fixtures/*.ts`                                       |
| Web-first locators (`getByRole`, `getByPlaceholder`)   | `pages/ecommerce/LoginPage.ts`                        |
| Web-first assertions (`expect(locator).toBeVisible()`) | every spec                                            |
| Data-driven testing                                    | `tests/ecommerce/e2e/add_to_cart_data_driven.spec.ts` |
| Network mocking                                        | `pages/airline/HomePage.ts` (`mockFlightSearchError`) |
| Multi-tab handling                                     | `tests/.../new_tab.spec.ts`, airline tests            |
| Native dialogs                                         | `tests/ecommerce/functional/alerts.spec.ts`           |
| API testing                                            | `utils/UserApiHelper.ts`, airline API spec            |
| Auth state caching                                     | `global-setup.ts`                                     |
| Multi-environment config                               | `config/env.ts` + `config/.env.*`                     |
| Multi-browser CI matrix                                | `.github/workflows/`, `.gitlab-ci.yml`                |
| Allure reporting                                       | `utils/helpers/allure.ts`                             |
| Code quality automation                                | `eslint.config.js`, `.husky/`, `lint-staged`          |

---

## License

[MIT](LICENSE)
