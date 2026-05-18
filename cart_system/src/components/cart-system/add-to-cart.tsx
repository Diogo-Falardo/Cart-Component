import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

type AddToCartProps = {
  productId: string;
};

const CART_ITEMS_KEY = "cart-items";

export default function AddToCart({ productId }: AddToCartProps) {
  const handleAddToCart = () => {
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
