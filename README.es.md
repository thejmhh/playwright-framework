# Framework de Automatización QA con Playwright

> Framework de automatización end-to-end multi-dominio construido con **Playwright + TypeScript**.
> Demuestra Page Object Model, fixtures personalizadas por dominio, pruebas data-driven,
> testing de API, configuración multi-ambiente, reportes con Allure y CI/CD en
> **GitHub Actions y GitLab CI** simultáneamente.

[![Playwright](https://img.shields.io/badge/Playwright-1.42-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure-3.0-FF6B6B?logo=allure&logoColor=white)](https://docs.qameta.io/allure/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🇬🇧 [English version](README.md)

---

## Lo más relevante para reclutadores

- 🏗 **Page Object Model** organizado por dominio de negocio (`ecommerce`, `airline`, extensible a `insurance`).
- 🧩 **Fixtures personalizadas por dominio** — los Page Objects se inyectan vía DI en los specs.
- 🧪 **Tipos de pruebas**: smoke, e2e, funcionales, data-driven, mocking de red, multi-tab, diálogos nativos, API.
- 🌐 **Multi-ambiente** vía `dotenv` (`config/.env.qa`, `config/.env.stage`).
- 🔐 **Caché de estado de autenticación** con `globalSetup` + `storageState` para que la mayoría de specs salten el flujo de login.
- 🦊 **Cross-browser**: Chromium, Firefox, WebKit en matriz paralela.
- 📊 **Reportes Allure** con etiquetas epic/feature/story/severity.
- 🤖 **CI/CD en dos plataformas**: GitHub Actions y GitLab CI, ambas publican el reporte Allure en Pages.
- 🧹 **Calidad de código**: ESLint flat config + Prettier + Husky pre-commit + lint-staged + TypeScript strict.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo empezar](#cómo-empezar)
- [Cómo correr los tests](#cómo-correr-los-tests)
- [Reportes](#reportes)
- [Decisiones de arquitectura](#decisiones-de-arquitectura)
- [CI/CD](#cicd)
- [Habilidades demostradas](#habilidades-demostradas)
- [Licencia](#licencia)

---

## Stack tecnológico

| Capa | Herramienta |
|---|---|
| Test runner | [Playwright Test](https://playwright.dev/) 1.42 |
| Lenguaje | TypeScript 5 (modo strict) |
| Reportes | Allure + HTML (built-in) + JUnit (para CI) |
| Calidad | ESLint 9 (flat config), Prettier 3, Husky 9, lint-staged 15 |
| Configuración | dotenv, multi-env, multi-dominio |
| CI/CD | GitHub Actions, GitLab CI |
| APIs sandbox | [reqres.in](https://reqres.in) |
| UIs sandbox | [saucedemo.com](https://www.saucedemo.com), [blazedemo.com](https://blazedemo.com) |

---

## Estructura del proyecto

```
playwright-framework/
├── config/
│   ├── .env.qa                 # Variables por ambiente (commit con creds de demo solamente)
│   ├── .env.stage
│   ├── env.ts                  # Carga dotenv y selecciona el dominio activo
│   └── domains/
│       ├── ecommerce.config.ts
│       ├── airline.config.ts
│       └── insurance.config.ts
├── fixtures/
│   ├── baseFixture.ts          # Hooks transversales (captura de errores de página, etc.)
│   ├── ecommerceFixture.ts     # Inyecta Page Objects de ecommerce
│   └── airlineFixture.ts       # Inyecta Page Objects de airline + UserApiHelper
├── pages/
│   ├── ecommerce/              # LoginPage, InventoryPage, CartPage, CheckoutPage
│   └── airline/                # HomePage, ReservePage, PurchasePage
├── tests/
│   ├── ecommerce/
│   │   ├── smoke/              # @smoke — flujos de login
│   │   ├── e2e/                # @e2e — checkout, add-to-cart data-driven
│   │   └── functional/         # @functional — alertas, multi-tab
│   └── airline/                # @AirlineFunc — mocking, multi-tab, XPath dinámico, API
├── utils/
│   ├── helpers.ts              # Adjuntar screenshots, helpers de retry
│   ├── dataFactory.ts          # Generación de datos sintéticos
│   ├── UserApiHelper.ts        # Cliente API apuntando a reqres.in
│   └── helpers/allure.ts       # Helpers para etiquetas Allure (epic/feature/story/severity)
├── test-data/                  # Sets de datos estáticos (PRODUCTS, USERS)
├── storage/                    # Estados de auth generados (gitignored, .gitkeep tracked)
├── global-setup.ts             # Login único → storageState
├── playwright.config.ts        # Reporters, projects, timeouts, baseURL
├── tsconfig.json               # Path aliases, modo strict
├── eslint.config.js            # Flat config
├── .gitlab-ci.yml              # Pipeline GitLab CI
└── .github/workflows/          # Pipeline GitHub Actions
    └── playwright.yml
```

---

## Cómo empezar

### Requisitos previos

- Node.js ≥ 18 (usa `nvm use` — hay un `.nvmrc`)
- npm

### Instalación

```bash
git clone <este-repo>
cd playwright-framework
npm ci
npx playwright install --with-deps
```

El archivo `.env.qa` está commiteado porque solo contiene **credenciales públicas
de sitios demo** (`saucedemo.com` documenta `standard_user` / `secret_sauce`
abiertamente). Para proyectos reales, copia `.env.example` a un archivo
`.env.local` y agrégalo al `.gitignore`.

---

## Cómo correr los tests

```bash
# Todos los tests, todos los navegadores
npm test

# Por navegador
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Por dominio
npm run test:ecommerce
npm run test:airline

# Por tag
npm run smoke:qa          # @smoke
npm run e2e:qa            # @e2e
npm run functional:qa     # @functional

# Modo headed (ver el navegador)
HEADED=1 npm test
# o
npm run test:headed

# UI interactivo (genial para desarrollo)
npm run test:ui

# Debugger
npm run test:debug
```

### Variables de entorno útiles

| Variable | Default | Descripción |
|---|---|---|
| `DOMAIN` | `ecommerce` | `ecommerce`, `airline` o `insurance` |
| `ENV` | `qa` | Carga `config/.env.${ENV}` |
| `HEADED` | sin valor | Pon `1` para desactivar headless |
| `CI` | sin valor | Cuando está seteado, retries=2 y workers=50% |

---

## Reportes

```bash
# Reporte HTML built-in de Playwright
npm run report

# Reporte Allure (más rico — epics/features/stories/severity)
npm run allure:generate && npm run allure:open
# o en un solo comando:
npm run allure:serve
```

En CI ambos reportes se publican automáticamente:

- **GitHub Actions** → Allure se despliega a la rama `gh-pages`.
- **GitLab CI** → Allure se publica vía GitLab Pages en
  `https://<grupo>.gitlab.io/<proyecto>/`.

---

## Decisiones de arquitectura

### ¿Por qué fixtures por dominio?

Cada dominio es dueño de sus Page Objects. Un spec bajo `tests/ecommerce/`
importa `ecommerceFixture` y recibe `loginPage`, `inventoryPage`, `cartPage`,
`checkoutPage` ya inyectados. Los specs bajo `tests/airline/` importan
`airlineFixture` y reciben `homePage`, `reservePage`, `purchasePage`,
`apiHelper`.

Esto mantiene los archivos de test cortos (sin el boilerplate de
`new InventoryPage(page)`) y hace explícito el grafo de dependencias.

### ¿Por qué un global setup?

El UI de login se ejercita una sola vez por corrida (en `global-setup.ts`) y
el `storageState` resultante se reusa en cada spec que declare
`test.use({ storageState: 'storage/standard.json' })`. Esto reduce
significativamente el tiempo de la suite y aísla *el flujo de auth en sí
mismo* en specs smoke dedicados que **no** usan el estado guardado.

### ¿Por qué fallar rápido si faltan env vars?

`config/env.ts` lanza inmediatamente si el dominio activo no tiene `baseURL`.
Los tests truenan con un mensaje claro al cargar la config en lugar de fallar
a mitad de ejecución con `TypeError: Cannot read properties of undefined`.

### ¿Por qué `reqres.in` para los tests de API?

Es un sandbox API gratuito y conocido que devuelve formas realistas. El
`UserApiHelper` del framework es genérico — apúntalo a tu backend real
sobreescribiendo `API_BASE_URL`.

---

## CI/CD

### GitHub Actions (`.github/workflows/playwright.yml`)

1. Stage **lint**: prettier check, eslint, tsc --noEmit
2. Matriz **test**: chromium / firefox / webkit en paralelo
3. **publish-report**: combina los resultados Allure de todos los browsers
   y los pushea a `gh-pages` (solo en `main`)

### GitLab CI (`.gitlab-ci.yml`)

La misma forma, en cuatro stages:

1. `lint` — feedback rápido
2. `test` — matriz por browser; los reportes JUnit aparecen en la vista del MR
3. `report` — un único reporte Allure combinado
4. `pages` — publica el reporte en GitLab Pages

Ambas pipelines fijan Node vía `.nvmrc` y usan la imagen Docker oficial de
Playwright (`mcr.microsoft.com/playwright`) para el stage de test en GitLab.

---

## Habilidades demostradas

| Capacidad | Dónde verla |
|---|---|
| Page Object Model | `pages/ecommerce/`, `pages/airline/` |
| Fixtures personalizadas (DI) | `fixtures/*.ts` |
| Locators web-first (`getByRole`, `getByPlaceholder`) | `pages/ecommerce/LoginPage.ts` |
| Aserciones web-first (`expect(locator).toBeVisible()`) | todos los specs |
| Pruebas data-driven | `tests/ecommerce/e2e/add_to_cart_data_driven.spec.ts` |
| Mocking de red | `pages/airline/HomePage.ts` (`mockFlightSearchError`) |
| Manejo multi-tab | `tests/.../new_tab.spec.ts`, tests airline |
| Diálogos nativos | `tests/ecommerce/functional/alerts.spec.ts` |
| Testing de API | `utils/UserApiHelper.ts`, spec airline de API |
| Caché de estado de auth | `global-setup.ts` |
| Configuración multi-ambiente | `config/env.ts` + `config/.env.*` |
| Matriz CI multi-browser | `.github/workflows/`, `.gitlab-ci.yml` |
| Reportes Allure | `utils/helpers/allure.ts` |
| Automatización de calidad de código | `eslint.config.js`, `.husky/`, `lint-staged` |

---

## Licencia

[MIT](LICENSE)
