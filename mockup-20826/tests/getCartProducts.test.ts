import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCartProducts } from "../src/components/cart/cart";
import { products } from "../src/data/products.db.table";

const CART_ITEMS_KEY = "cart-items";

function productById(id: string) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`missing product ${id}`);
  }
  return product;
}

describe("getCartProducts", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns an empty list when no cart exists", () => {
    const cartProducts = getCartProducts();

    expect(cartProducts).toEqual([]);
  });

  it("returns the products for stored cart ids", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-002"]),
    );

    const cartProducts = getCartProducts();

    expect(cartProducts).toEqual([
      { ...productById("p-001"), cartIndex: 0 },
      { ...productById("p-002"), cartIndex: 1 },
    ]);
  });

  it("keeps duplicate products as separate line items", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-001"]),
    );

    const cartProducts = getCartProducts();

    expect(cartProducts).toEqual([
      { ...productById("p-001"), cartIndex: 0 },
      { ...productById("p-001"), cartIndex: 1 },
    ]);
  });

  it("skips unknown ids and keeps the original cart index", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "missing-id", "p-003"]),
    );

    const cartProducts = getCartProducts();

    expect(cartProducts).toEqual([
      { ...productById("p-001"), cartIndex: 0 },
      { ...productById("p-003"), cartIndex: 2 },
    ]);
  });
});
