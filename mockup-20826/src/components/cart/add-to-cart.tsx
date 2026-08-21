import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { handleAddToCartClick } from "./cart.ts";

type AddToCartProps = {
  productId: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // button id
};

export default function AddToCart({ productId, onClick }: AddToCartProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAddToCartClick(e, productId);
    if (onClick) onClick(e);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={`Add ${productId} to cart`}
      onClick={handleClick}
    >
      <ShoppingCart className="size-4" />
    </Button>
  );
}
