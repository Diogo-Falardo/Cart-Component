import { beforeEach, describe, expect, it, vi } from "vitest";
import { cartCache, getCart } from "../src/components/cart/cart";

const CART_ITEMS_KEY = "cart-items";

describe("getCart", () => {
  beforeEach(() => {
    // jsdom gives us a real localStorage implementation.
    // Clear it so each test starts with "no cart".
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("creates an empty cart when none exists", () => {
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBeNull();

    const cart = getCart();

    expect(cart).toEqual([]);
    expect(cartCache).toEqual([]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe("[]");
  });

  it("loads an existing cart into the cache", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-002"]),
    );

    const cart = getCart();

    expect(cart).toEqual(["p-001", "p-002"]);
    expect(cartCache).toEqual(["p-001", "p-002"]);
  });

  it("creates a fresh empty cart when stored data is invalid", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem(CART_ITEMS_KEY, "{not-json");

    const cart = getCart();

    expect(cart).toEqual([]);
    expect(cartCache).toEqual([]);
    expect(localStorage.getItem(CART_ITEMS_KEY)).toBe("[]");
  });
});
