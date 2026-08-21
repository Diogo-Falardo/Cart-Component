import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import AddToCart from "./components/cart/add-to-cart.tsx";
import Cart from "./components/cart/cart.tsx";
import { products } from "./data/products.db.table";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-end">
            <Cart />
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
                  <AddToCart productId={product.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  </StrictMode>,
);
