import { beforeEach, describe, expect, it, vi } from "vitest";
import { cartCache, removeProductsFromCart } from "../src/components/cart/cart";

const CART_ITEMS_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart:updated";

describe("removeProductsFromCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("removes the product at the given index and backups localStorage", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-002", "p-003"]),
    );

    const cart = removeProductsFromCart(1);

    expect(cart).toEqual(["p-001", "p-003"]);
    expect(cartCache).toEqual(["p-001", "p-003"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(
      JSON.stringify(["p-001", "p-003"]),
    );
  });

  it("removes only the occurrence at that index when ids are duplicated", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-001"]),
    );

    const cart = removeProductsFromCart(0);

    expect(cart).toEqual(["p-001"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(JSON.stringify(["p-001"]));
  });

  it("leaves the cart unchanged when the index is out of range", () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(["p-001"]));

    const cart = removeProductsFromCart(4);

    expect(cart).toEqual(["p-001"]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe(JSON.stringify(["p-001"]));
  });

  it("backups an empty cart after removing the last product", () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(["p-001"]));

    const cart = removeProductsFromCart(0);

    expect(cart).toEqual([]);
    expect(cartCache).toEqual([]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe("[]");
  });

  it("dispatches cart:updated after removing", () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(["p-001"]));
    const listener = vi.fn();
    window.addEventListener(CART_UPDATED_EVENT, listener);

    removeProductsFromCart(0);

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(CART_UPDATED_EVENT, listener);
  });
});
