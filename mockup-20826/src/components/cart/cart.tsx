import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  CART_UPDATED_EVENT,
  addProductsToCart,
  getGroupedCartProducts,
  removeAllProductsFromCart,
  removeProductsFromCart,
  type GroupedCartProduct,
} from "./cart.ts";

const DESKTOP_QUERY = "(min-width: 768px)";
const DESKTOP_WIDTH = 420;
const DESKTOP_MIN_WIDTH = 320;
const MOBILE_HEIGHT_RATIO = 0.72;

const parsePrice = (price: string) =>
  Number.parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function defaultPanelSize(isDesktop: boolean) {
  if (isDesktop) {
    return DESKTOP_WIDTH;
  }

  return Math.round(window.innerHeight * MOBILE_HEIGHT_RATIO);
}

export default function Cart() {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState(() => getGroupedCartProducts());
  const [panelSize, setPanelSize] = useState(() => defaultPanelSize(isDesktop));

  const syncCart = () => {
    setGroups(getGroupedCartProducts());
  };

  useEffect(() => {
    const handleCartUpdated = () => syncCart();

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    setPanelSize(defaultPanelSize(isDesktop));
  }, [isDesktop]);

  const unitCount = groups.reduce((sum, group) => sum + group.quantity, 0);
  const totalPrice = groups.reduce(
    (sum, group) => sum + parsePrice(group.price) * group.quantity,
    0,
  );

  const increaseQuantity = (productId: string) => {
    addProductsToCart(productId);
  };

  const decreaseQuantity = (group: GroupedCartProduct) => {
    const lastIndex = group.cartIndexes[group.cartIndexes.length - 1];
    if (lastIndex === undefined) {
      return;
    }

    removeProductsFromCart(lastIndex);
  };

  const removeLine = (productId: string) => {
    removeAllProductsFromCart(productId);
  };

  const onResizePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    const handle = event.currentTarget;
    const pointerId = event.pointerId;
    const start = isDesktop ? event.clientX : event.clientY;
    const startSize = panelSize;

    handle.setPointerCapture(pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      if (isDesktop) {
        const maxWidth = Math.min(640, window.innerWidth - 16);
        setPanelSize(
          clamp(startSize + (start - moveEvent.clientX), DESKTOP_MIN_WIDTH, maxWidth),
        );
        return;
      }

      const maxHeight = window.innerHeight * 0.92;
      const minHeight = Math.min(280, window.innerHeight * 0.4);
      setPanelSize(
        clamp(startSize + (start - moveEvent.clientY), minHeight, maxHeight),
      );
    };

    const onUp = () => {
      handle.releasePointerCapture(pointerId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          syncCart();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          id="cart-button"
          variant="outline"
          size="icon"
          aria-label="Open cart"
          className="relative"
        >
          <ShoppingCart className="size-4" />

          {unitCount > 0 ? (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1.5"
              aria-label={`${unitCount} items in cart`}
            >
              {unitCount}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        showCloseButton={false}
        style={
          isDesktop
            ? { width: panelSize, maxWidth: "100vw" }
            : { height: panelSize }
        }
        className={
          isDesktop
            ? "w-auto max-w-none p-0"
            : "rounded-t-xl p-0 md:rounded-none"
        }
      >
        <div
          role="separator"
          aria-orientation={isDesktop ? "vertical" : "horizontal"}
          aria-label="Resize cart"
          tabIndex={0}
          onPointerDown={onResizePointerDown}
          onKeyDown={(event) => {
            const step = 24;
            if (isDesktop && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
              event.preventDefault();
              const delta = event.key === "ArrowLeft" ? step : -step;
              setPanelSize((size) =>
                clamp(size + delta, DESKTOP_MIN_WIDTH, Math.min(640, window.innerWidth - 16)),
              );
            }
            if (!isDesktop && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
              event.preventDefault();
              const delta = event.key === "ArrowUp" ? step : -step;
              setPanelSize((size) =>
                clamp(
                  size + delta,
                  Math.min(280, window.innerHeight * 0.4),
                  window.innerHeight * 0.92,
                ),
              );
            }
          }}
          className={
            isDesktop
              ? "absolute inset-y-0 left-0 z-10 w-2 cursor-ew-resize touch-none hover:bg-foreground/10"
              : "absolute inset-x-0 top-0 z-10 flex h-5 cursor-ns-resize touch-none items-center justify-center"
          }
        >
          {isDesktop ? null : (
            <span className="bg-border h-1 w-10 rounded-full" />
          )}
        </div>

        <SheetHeader className={isDesktop ? "pr-4 pl-5" : "pt-6 pr-4 pl-4"}>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {unitCount} item{unitCount === 1 ? "" : "s"}
            {groups.length > 0
              ? ` · ${groups.length} product${groups.length === 1 ? "" : "s"}`
              : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          {groups.length === 0 ? (
            <div className="text-muted-foreground flex h-full min-h-40 flex-col items-center justify-center gap-2">
              <ShoppingCart className="size-6" />
              <p className="text-sm">No items in cart.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li
                  key={group.id}
                  className="flex items-center gap-3 rounded-lg border p-2 transition-colors duration-150 hover:bg-muted/50"
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className="bg-secondary size-14 shrink-0 rounded-md border object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {group.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {group.price}
                      {group.quantity > 1 ? (
                        <span>
                          {" "}
                          · ${(parsePrice(group.price) * group.quantity).toFixed(2)}
                        </span>
                      ) : null}
                    </p>

                    <div className="mt-2 inline-flex items-center rounded-lg border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="md:size-6 size-8"
                        aria-label={`Decrease ${group.name} quantity`}
                        onClick={() => decreaseQuantity(group)}
                      >
                        <Minus />
                      </Button>
                      <span
                        className="min-w-6 px-1 text-center text-sm tabular-nums"
                        aria-label={`${group.quantity} in cart`}
                      >
                        {group.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="md:size-6 size-8"
                        aria-label={`Increase ${group.name} quantity`}
                        onClick={() => increaseQuantity(group.id)}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="md:size-7 size-9"
                    aria-label={`Remove ${group.name} from cart`}
                    onClick={() => removeLine(group.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Subtotal</p>
            <p className="text-foreground text-sm font-medium">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
