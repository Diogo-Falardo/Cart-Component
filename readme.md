# Cart component

Reusable React cart for a product grid: add by product id, inspect a grouped bag, change quantity, and persist across reloads.

The working copy lives in memory. `localStorage` (`cart-items`) is the backup. The UI is shadcn’s default theme — a right-side panel on desktop, a bottom sheet on mobile.

## Stack

- React 19 + TypeScript + Vite
- [shadcn/ui](https://ui.shadcn.com/) (Radix, Tailwind 4)
- GSAP (add-to-cart flight and panel resize)
- Vitest + jsdom

> This mockup is a Vite SPA

## Quick start

```bash
cd mockup-20826
bun install
bun run dev
```

Open the URL Vite prints. `bun run test` runs the cart module tests. `bun run test:watch` reruns on save.

## How it works

```
AddToCart  →  cart.ts (cache + backup)  →  Cart sheet
                 ↑                              │
                 └──── cart:updated event ──────┘
```

1. **Catalog** — `src/data/products.db.table.ts` stands in for a products table (`id`, `name`, `price`, `image`).
2. **Store** — `src/components/cart/cart.ts` hydrates `cartCache` from `localStorage`, mutates it, writes it back, and dispatches `cart:updated`.
3. **Add** — `AddToCart` calls `handleAddToCartClick`, which appends the id (duplicates allowed) and flies a chip to the bag button.
4. **Bag** — `Cart` loads grouped lines (`getGroupedCartProducts`). Same id → one row with a quantity. `−` / `+` change count; trash removes that product.

If the `cart-items` key is missing or invalid, `getCart()` creates `[]` and saves it.

## Usage

Drop the bag once. Render an add button per product.

```tsx
import Cart from "./components/cart/cart.tsx";
import AddToCart from "./components/cart/add-to-cart.tsx";
import { products } from "./data/products.db.table";

<Cart />

{products.map((product) => (
  <AddToCart key={product.id} productId={product.id} />
))}
```

`AddToCart` props:

| Prop        | Type                                              | Required | Role                                      |
| ----------- | ------------------------------------------------- | -------- | ----------------------------------------- |
| `productId` | `string`                                          | yes      | Id stored in the cart                     |
| `onClick`   | `(event: MouseEvent<HTMLButtonElement>) => void`  | no       | Extra handler after add (animations, etc.) |

The store is the public logic API:

| Function                     | Role                                              |
| ---------------------------- | ------------------------------------------------- |
| `getCart()`                  | Hydrate cache; create an empty cart if missing    |
| `addProductsToCart(id)`      | Append one id and persist                         |
| `removeProductsFromCart(i)`  | Remove the id at index `i`                        |
| `removeAllProductsFromCart(id)` | Remove every occurrence of `id`                |
| `getCartProducts()`          | Resolve ids to product rows + `cartIndex`         |
| `getGroupedCartProducts()`   | Collapse duplicates into `{ quantity, cartIndexes }` |
| `handleAddToCartClick(e, id)` | Add + fly-to-bag motion                         |

## Persistence

- **Key:** `cart-items`
- **Value:** JSON array of product ids, e.g. `["p-001", "p-001", "p-003"]`
- Duplicates are stored as repeated ids; the UI counts them.

## Layout

```
mockup-20826/
  src/
    components/cart/
      cart.ts           store, persistence, motion
      add-to-cart.tsx   add button
      cart.tsx          bag sheet
    data/products.db.table.ts
    main.tsx            demo page
  tests/                Vitest coverage for cart.ts
```

## Scripts

| Command             | What it does              |
| ------------------- | ------------------------- |
| `bun run dev`       | Dev server                |
| `bun run test`      | Vitest once               |
| `bun run test:watch`| Vitest in watch mode      |
| `bun run build`     | Typecheck + production build |
