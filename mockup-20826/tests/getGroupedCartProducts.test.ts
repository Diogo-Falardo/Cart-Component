import { beforeEach, describe, expect, it, vi } from "vitest";
import { getGroupedCartProducts } from "../src/components/cart/cart";
import { products } from "../src/data/products.db.table";

const CART_ITEMS_KEY = "cart-items";

function productById(id: string) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`missing product ${id}`);
  }
  return product;
}

describe("getGroupedCartProducts", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns an empty list when no cart exists", () => {
    expect(getGroupedCartProducts()).toEqual([]);
  });

  it("groups duplicate ids into a counted line", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-001", "p-002", "p-001"]),
    );

    expect(getGroupedCartProducts()).toEqual([
      {
        ...productById("p-001"),
        quantity: 2,
        cartIndexes: [0, 2],
      },
      {
        ...productById("p-002"),
        quantity: 1,
        cartIndexes: [1],
      },
    ]);
  });

  it("keeps first-seen product order", () => {
    localStorage.setItem(
      CART_ITEMS_KEY,
      JSON.stringify(["p-003", "p-001", "p-003"]),
    );

    const groups = getGroupedCartProducts();

    expect(groups.map((group) => group.id)).toEqual(["p-003", "p-001"]);
  });
});
