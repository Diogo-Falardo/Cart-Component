import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

type AddToCartProps = {
  productId: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const CART_ITEMS_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart:updated";

export default function AddToCart({ productId, onClick }: AddToCartProps) {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    /**
     * Try Catch:
     *
     * it tryes to read an existing cart and parse it to an array
     * if fails: creates an new fresh array with the item id
     */

    try {
      const rawItems = localStorage.getItem(CART_ITEMS_KEY);
      const items: Array<string> = rawItems ? JSON.parse(rawItems) : [];

      // Keep duplicates intentionally so the cart can render repeated items.
      items.push(productId);

      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    } catch {
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify([productId]));
    }

    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));

    if (onClick) onClick(e);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={`Add ${productId} to cart`}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="size-4" />
    </Button>
  );
}
