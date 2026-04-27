# Mandado App - Project Knowledge Base

## Project Overview
"Mandado" is a modern shopping list and grocery management web application built as a Progressive Web App (PWA). It is designed to work offline-first, leveraging local browser storage for persistence.

## Tech Stack
- **Framework:** Angular 19.0.0
- **UI & Styling:** Tailwind CSS 4, DaisyUI 5, PostCSS, Bootstrap Icons
- **Database (Offline-first):** Dexie 4.2.1 (IndexedDB wrapper)
- **Utilities:** Luxon (date & time handling), RxJS (reactive programming)
- **Tooling:** Angular CLI, TypeScript 5.6

## Architecture & Directory Structure
The application follows a modular and scalable directory structure, strongly utilizing TypeScript path aliases (configured in `tsconfig.json`):

- **`@components/`** (`src/app/components/`): Reusable, dumb/presentational UI components (e.g., `button`, `modal`, `drawer`, `toast`, `dock`, `field`, `breadcrumbs`).
- **`@views/`** (`src/app/views/`): Smart components acting as pages. Lazy-loaded via `app.routes.ts`. Includes `home`, `historical`, and `shopping-list`.
- **`@layouts/`** (`src/app/layouts/`): Structural components that wrap views (e.g., `app-layout`).
- **`@libs/`** (`src/app/libs/`): Core business logic, database configuration, and shared utilities.
  - **`modules/db/`**: Dexie database configuration (`db.ts`), where `MandadoDB` is initialized with tables (`shoppingList`, `products`, `snapshots`).
  - **`modules/persistent/`**: Domain modules containing logic for entities. Uses a structured pattern: `schema.ts`, `repository.ts`, `service.ts`, `adapter.ts`. Domain entities include `products`, `shopping-list`, and `snapshot`.
  - **`utils/`**: General helpers (`validators`, `services`).

## Domain Models (Database Schema)

### 1. Shopping List
Stores a collection of products for a specific grocery run.
```typescript
interface IShoppingListSchema extends IBaseSchema {
    alias?: string;
    products: IProductSchema[]; // Embedded array of products
}
```

### 2. Product
Represents individual items in a shopping list.
```typescript
interface IProductSchema extends IBaseSchema {
    name: string;
    quantity: number;
    unit_cost: number;
    description?: string;
    totalCost?: number;
    isPromo?: boolean; // Used to visually tag promotional items
}
```

### 3. Snapshot
Used for historical records and data state tracking.

## Key Conventions & Patterns
- **Standalone Components:** The project heavily uses Angular's standalone components paradigm (`loadComponent` in routing).
- **Offline-First:** All data operations happen through Dexie (`AppDB`) which syncs locally to IndexedDB.
- **Repository Pattern:** Database interactions are abstracted into repositories within `libs/modules/persistent/`, separating data access from UI components.
- **Path Aliases:** Always use absolute imports leveraging the aliases (`@components/*`, `@views/*`, etc.) to avoid relative path hell.
- **Styling:** Avoid writing custom CSS unless absolutely necessary. Rely on Tailwind CSS utility classes and DaisyUI components.

## Development Commands
- `npm start` / `ng serve`: Run local development server.
- `npm run build`: Build production assets to `dist/`.
- `npm run watch`: Run build in watch mode for development.

## Recent Features & Known Context
- Promotional tagging for items (`isPromo` boolean in Product schema).
- Historical view logic for deleting past lists and syncing data.
- Built-in PWA service worker enabled via `@angular/service-worker` (`ngsw-config.json`).
