const CART_ITEMS_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart:updated";

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

