import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { MouseEvent } from "react";
import "./styles/globals.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import AddToCart from "./components/cart/add-to-cart";
import Cart from "./components/cart/cart";
import { gsap } from "gsap";
import { products } from "./lib/data";

function handleAddToCartClick(
  event: MouseEvent<HTMLButtonElement>,
  _productId: string,
) {
  const cartButton = document.getElementById("cart-button");
  if (!cartButton) return;

  const fromRect = event.currentTarget.getBoundingClientRect();
  const toRect = cartButton.getBoundingClientRect();

  const flyer = document.createElement("div");
  flyer.className =
    "pointer-events-none fixed z-50 h-3 w-3 rounded-sm border bg-primary";
  flyer.style.left = `${fromRect.left + fromRect.width / 2 - 6}px`;
  flyer.style.top = `${fromRect.top + fromRect.height / 2 - 6}px`;
  document.body.appendChild(flyer);

  const deltaX = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
  const deltaY = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

  const timeline = gsap.timeline({
    onComplete: () => flyer.remove(),
  });

  timeline
    .to(flyer, {
      x: deltaX,
      y: deltaY,
      scale: 0.2,
      rotate: 135,
      duration: 0.55,
      ease: "power2.inOut",
    })
    .to(
      cartButton,
      {
        scale: 1.08,
        duration: 0.12,
        ease: "power1.out",
      },
      "-=0.1",
    )
    .to(cartButton, {
      scale: 1,
      duration: 0.16,
      ease: "power1.in",
    });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-end">
            <Cart products={products} />
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="gap-4 py-4">
                <CardContent className="px-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="bg-secondary aspect-4/3 w-full rounded-xl border object-cover"
                  />
                </CardContent>
                <CardHeader className="gap-1 px-4">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="text-foreground">
                    {product.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end px-4">
                  <AddToCart
                    productId={product.id}
                    onClick={(e) => handleAddToCartClick(e, product.id)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  </StrictMode>,
);
