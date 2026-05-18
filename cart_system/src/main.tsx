import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShoppingCart } from "lucide-react";
import "./styles/globals.css";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

const products = [
  {
    id: "p-001",
    name: "Everyday Tee",
    price: "$29.00",
    image: "https://placehold.co/640x480?text=Item+01",
  },
  {
    id: "p-002",
    name: "Stone Sneakers",
    price: "$74.00",
    image: "https://placehold.co/640x480?text=Item+02",
  },
  {
    id: "p-003",
    name: "Compact Backpack",
    price: "$52.00",
    image: "https://placehold.co/640x480?text=Item+03",
  },
  {
    id: "p-004",
    name: "Minimal Watch",
    price: "$119.00",
    image: "https://placehold.co/640x480?text=Item+04",
  },
  {
    id: "p-005",
    name: "Daily Bottle",
    price: "$18.00",
    image: "https://placehold.co/640x480?text=Item+05",
  },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-end">
            <Button variant="outline" size="icon" aria-label="Open cart">
              <ShoppingCart className="size-4" />
            </Button>
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
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  </StrictMode>,
);
