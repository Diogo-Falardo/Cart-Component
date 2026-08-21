import { products } from "../../data/products.db.table";

const CART_ITEMS_KEY = "cart-items";
export const CART_UPDATED_EVENT = "cart:updated";

type Product = (typeof products)[number];
export type CartProduct = Product & { cartIndex: number };
export type GroupedCartProduct = Product & {
  quantity: number;
  cartIndexes: number[];
};

// in memory cache for cart
export let cartCache: Array<string> = []

function backupCart() {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartCache));
}

function notifyCartUpdated() {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

// initial load of the cart into cache
// if the cart does not exist, create an empty one
export function getCart() {
  try {
    const rawItems = localStorage.getItem(CART_ITEMS_KEY);

    if (rawItems === null) {
      cartCache = [];
      backupCart();
      return cartCache;
    }

    cartCache = JSON.parse(rawItems);
    return cartCache;
  } catch (error) {
    console.error("getCart", error);
    cartCache = [];
    backupCart();
    return cartCache;
  }
}

// add a product id to the cached cart and backup to localStorage
// duplicates are kept so the same product can appear more than once
export function addProductsToCart(productId: string) {
  getCart();
  cartCache.push(productId);
  backupCart();
  notifyCartUpdated();
  return cartCache;
}

// remove the product at index from the cached cart and backup to localStorage
export function removeProductsFromCart(index: number) {
  getCart();
  cartCache = cartCache.filter((_, itemIndex) => itemIndex !== index);
  backupCart();
  notifyCartUpdated();
  return cartCache;
}

// load cart ids and return the matching products from the products table
export function getCartProducts(): Array<CartProduct> {
  getCart();

  return cartCache
    .map((id, index) => {
      const product = products.find((item) => item.id === id);
      if (!product) {
        return null;
      }

      return {
        ...product,
        cartIndex: index,
      };
    })
    .filter((item): item is CartProduct => item !== null);
}

// group duplicate product ids into counted lines, first-seen order
export function getGroupedCartProducts(): Array<GroupedCartProduct> {
  const items = getCartProducts();
  const groups: Array<GroupedCartProduct> = [];
  const byId = new Map<string, GroupedCartProduct>();

  for (const item of items) {
    const existing = byId.get(item.id);

    if (existing) {
      existing.quantity += 1;
      existing.cartIndexes.push(item.cartIndex);
      continue;
    }

    const { cartIndex, ...product } = item;
    const group: GroupedCartProduct = {
      ...product,
      quantity: 1,
      cartIndexes: [cartIndex],
    };

    byId.set(item.id, group);
    groups.push(group);
  }

  return groups;
}

// remove every occurrence of a product id from the cached cart
export function removeAllProductsFromCart(productId: string) {
  getCart();
  cartCache = cartCache.filter((id) => id !== productId);
  backupCart();
  notifyCartUpdated();
  return cartCache;
}

