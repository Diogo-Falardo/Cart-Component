import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Cart from "./cart";
import CartAdd from "./cartAdd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartAdd productCode="1" />

    <Cart />
  </StrictMode>,
);
