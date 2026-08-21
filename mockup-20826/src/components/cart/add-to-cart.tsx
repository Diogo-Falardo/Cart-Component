import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { addProductsToCart } from "./cart.ts";

type AddToCartProps = {
  productId: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // button id
};

export default function AddToCart({ productId, onClick }: AddToCartProps) {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addProductsToCart(productId);
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
