import { beforeEach, describe, expect, it, vi } from "vitest";
import { addProductsToCart, cartCache } from "../src/components/cart/cart";

const CART_ITEMS_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart:updated";

describe("addProductsToCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("creates a cart and adds the product when none exists", () => {
    const cart = addProductsToCart("p-001");

    expect(cart).toEqual(["p-001"]);
    expect(cartCache).toEqual(["p-001"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(JSON.stringify(["p-001"]));
  });

  it("appends the product to an existing cart and backups localStorage", () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(["p-001"]));

    const cart = addProductsToCart("p-002");

    expect(cart).toEqual(["p-001", "p-002"]);
    expect(cartCache).toEqual(["p-001", "p-002"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(
      JSON.stringify(["p-001", "p-002"]),
    );
  });

  it("keeps duplicate product ids", () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(["p-001"]));

    const cart = addProductsToCart("p-001");

    expect(cart).toEqual(["p-001", "p-001"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(
      JSON.stringify(["p-001", "p-001"]),
    );
  });

  it("dispatches cart:updated after adding", () => {
    const listener = vi.fn();
    window.addEventListener(CART_UPDATED_EVENT, listener);

    addProductsToCart("p-001");

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(CART_UPDATED_EVENT, listener);
  });
});
