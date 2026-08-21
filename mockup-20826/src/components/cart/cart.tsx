import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type CartProps = {
  products: Product[];
};

const CART_ITEMS_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart:updated";

const parsePrice = (price: string) =>
  Number.parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

const readCartIds = () => {
  try {
    const raw = localStorage.getItem(CART_ITEMS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

export default function Cart({ products }: CartProps) {
  const [cartIds, setCartIds] = useState<string[]>(() => readCartIds());

  const syncCartFromStorage = () => {
    setCartIds(readCartIds());
  };

  useEffect(() => {
    const handleCartUpdated = () => syncCartFromStorage();

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);

  const cartItems = useMemo(
    () =>
      cartIds
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
        .filter(
          (item): item is Product & { cartIndex: number } => item !== null,
        ),
    [cartIds, products],
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price),
    0,
  );

  const removeCartItem = (targetIndex: number) => {
    const nextIds = cartIds.filter((_, index) => index !== targetIndex);
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(nextIds));
    setCartIds(nextIds);
  };

  return (
    <Popover onOpenChange={(open) => open && syncCartFromStorage()}>
      <PopoverTrigger asChild>
        <Button
          id="cart-button"
          variant="outline"
          size="icon"
          aria-label="Open cart"
          className="relative"
        >
          <ShoppingCart className="size-4" />

          {cartIds.length > 0 ? (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1.5"
              aria-label={`${cartIds.length} items in cart`}
            >
              {cartIds.length}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[min(92vw,28rem)] p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-foreground text-base font-semibold">Cart</h2>
            <p className="text-muted-foreground text-sm">
              {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
            </p>
          </div>
          <p className="text-foreground text-sm font-medium">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items in cart.</p>
          ) : (
            cartItems.map((item) => (
              <article
                key={`${item.id}-${item.cartIndex}`}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="bg-secondary h-14 w-14 rounded-md border object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-sm">{item.price}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeCartItem(item.cartIndex)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </article>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
