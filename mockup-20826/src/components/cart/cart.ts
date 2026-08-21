import { gsap } from "gsap";
import { products } from "../../data/products.db.table";

const CART_ITEMS_KEY = "cart-items";
export const CART_UPDATED_EVENT = "cart:updated";
export const CART_BUTTON_ID = "cart-button";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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

function pulseCartButton(cartButton: HTMLElement) {
  gsap.killTweensOf(cartButton);
  gsap.fromTo(
    cartButton,
    { scale: 1 },
    {
      scale: 1.1,
      duration: 0.14,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    },
  );

  const badge = cartButton.querySelector("[data-slot=badge]");
  if (badge) {
    gsap.fromTo(
      badge,
      { scale: 1 },
      {
        scale: 1.16,
        duration: 0.12,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        overwrite: "auto",
      },
    );
  }
}

export function animateAddToCart(source: HTMLElement) {
  const cartButton = document.getElementById(CART_BUTTON_ID);
  if (!cartButton) {
    return;
  }

  if (prefersReducedMotion()) {
    pulseCartButton(cartButton);
    return;
  }

  const fromRect = source.getBoundingClientRect();
  const toRect = cartButton.getBoundingClientRect();
  const size = 14;
  const fromX = fromRect.left + fromRect.width / 2 - size / 2;
  const fromY = fromRect.top + fromRect.height / 2 - size / 2;
  const toX = toRect.left + toRect.width / 2 - size / 2;
  const toY = toRect.top + toRect.height / 2 - size / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;

  const flyer = document.createElement("div");
  flyer.setAttribute("aria-hidden", "true");
  flyer.className = "pointer-events-none fixed rounded-md border bg-primary";
  flyer.style.cssText = `width:${size}px;height:${size}px;left:${fromX}px;top:${fromY}px;z-index:80;will-change:transform,opacity`;
  document.body.appendChild(flyer);

  gsap.set(flyer, { x: 0, y: 0, scale: 0.55, autoAlpha: 0, force3D: true });

  const timeline = gsap.timeline({
    onComplete: () => {
      flyer.style.willChange = "";
      flyer.remove();
    },
  });

  timeline
    .to(flyer, {
      scale: 1.08,
      autoAlpha: 1,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(flyer, {
      x: dx * 0.38,
      y: dy * 0.12 - 28,
      duration: 0.16,
      ease: "power2.out",
    })
    .to(flyer, {
      x: dx,
      y: dy,
      scale: 0.22,
      duration: 0.28,
      ease: "power3.in",
    })
    .to(
      flyer,
      {
        autoAlpha: 0,
        scale: 0.08,
        duration: 0.1,
        ease: "power2.in",
      },
      "-=0.06",
    )
    .add(() => pulseCartButton(cartButton), "-=0.14");
}

export function handleAddToCartClick(
  event: { currentTarget: EventTarget | null },
  productId: string,
) {
  addProductsToCart(productId);

  const source = event.currentTarget;
  if (!(source instanceof HTMLElement)) {
    return;
  }

  gsap.fromTo(
    source,
    { scale: 1 },
    {
      scale: 0.94,
      duration: 0.08,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    },
  );

  animateAddToCart(source);
}

export function attachCartResize(element: HTMLElement, axis: "x" | "y") {
  const property = axis === "x" ? "width" : "height";
  const reduced = prefersReducedMotion();
  const follow = reduced
    ? (value: number) => {
        gsap.set(element, { [property]: value });
      }
    : gsap.quickTo(element, property, {
        duration: 0.18,
        ease: "power3.out",
        overwrite: true,
      });

  return {
    set(value: number) {
      follow(value);
    },
    to(value: number) {
      gsap.to(element, {
        [property]: value,
        duration: reduced ? 0 : 0.28,
        ease: "power3.out",
        overwrite: true,
      });
    },
    kill() {
      gsap.killTweensOf(element);
    },
  };
}

