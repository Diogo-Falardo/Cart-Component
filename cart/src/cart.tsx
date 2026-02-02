import { useState } from "react";
// ui
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { Description } from "@radix-ui/react-dialog";
import { FAKE_PRODUCTS } from "./types";
import { Card } from "./components/ui/card";
// types
type StoredItem = {
  productCode: string;
  productQuantity: number;
};

// the prefix of the cart
// cart-item: + {productCode}
const CART_PREFIX = "cart-item:";

// function to get all the items from localstorage
function getItemFromStorage(): StoredItem[] {
  const stored: StoredItem[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(CART_PREFIX)) continue;

    // product key
    const productCode = key.slice(CART_PREFIX.length);

    const value = localStorage.getItem(key);
    if (!value || Number(value) === 0) continue;

    // quantity
    const productQuantity = Number(value);

    stored.push({ productCode, productQuantity });
  }

  return stored;
}

const Cart = () => {
  const [stored, setStored] = useState<StoredItem[]>(() =>
    getItemFromStorage(),
  );

  // refreshes the cart everytime the user opens it
  const refreshCart = () => setStored(getItemFromStorage());

  // gets the full item
  const cartProducts = stored
    .map((item) => {
      const product = FAKE_PRODUCTS.find(
        (p) => p.productCode === item.productCode,
      );
      if (!product) return null;

      return {
        ...product,
        productQuantity: item.productQuantity,
        total: product.productPrice * item.productQuantity,
      };
    })
    .filter(Boolean);

  // total of the all items in the cart
  const total = cartProducts.reduce((sum, item) => {
    if (!item) return sum;
    return sum + item.productQuantity * item.productPrice;
  }, 0);

  return (
    <Sheet onOpenChange={(open) => open && refreshCart()}>
      <SheetTrigger asChild>
        <Button variant={"outline"}>Open Cart</Button>
      </SheetTrigger>
      <SheetContent className="p-2">
        {cartProducts.length > 0 ? (
          <div>
            <SheetHeader>
              <SheetTitle>Products in Cart:</SheetTitle>
              <Description>{total ? `${total.toFixed(2)}€` : ""}</Description>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {cartProducts.map((item) => (
                <Card key={item?.productCode} className="p-2">
                  <h1>{item?.productName}</h1>
                  <h1 className="flex gap-4">
                    {item?.productPrice}
                    <span>
                      <span>Quantity:</span>
                      {item?.productQuantity}
                    </span>
                  </h1>
                  <h2>
                    Total: <span>{item?.total}</span>
                  </h2>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No products</div>
        )}
        <Button>Checkout</Button>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
