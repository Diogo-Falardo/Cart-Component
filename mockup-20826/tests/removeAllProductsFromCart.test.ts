import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cartCache,
  removeAllProductsFromCart,
} from "../src/components/cart/cart";

const CART_ITEMS_KEY = "cart-items";

describe("removeAllProductsFromCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("removes every occurrence of a product and backups localStorage", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-002", "p-001"]),
    );

    const cart = removeAllProductsFromCart("p-001");

    expect(cart).toEqual(["p-002"]);
    expect(cartCache).toEqual(["p-002"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(JSON.stringify(["p-002"]));
  });
});
