import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// data
import { FAKE_PRODUCTS } from "./types";
import type { Product_Data } from "./types";
// ui
import Cart from "./cart";
import ProductVisualizer from "./ProductVisualizer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="w-full min-h-screen flex flex-col justify-center items-center">
      {/* products displayer */}
      <div className="grid grid-cols-4 row-auto gap-2">
        {FAKE_PRODUCTS.map(
          ({ productName, productCode, productPrice }: Product_Data) => (
            <ProductVisualizer
              key={productCode}
              productName={productName}
              productPrice={productPrice}
              productCode={productCode}
            />
          ),
        )}
      </div>
      {/* cart */}
    </main>
  </StrictMode>,
);
