import { useState } from "react";
// types
import type { Product_Data } from "./types";
// ui
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import CartAdd from "./cartAdd";

const ProductVisualizer = (Product: Product_Data) => {
  const [quantiy, setQuanity] = useState("");

  return (
    <Card className="flex-col max-w-45 gap-3 p-2">
      <h1>{Product.productName}</h1>
      <h2>{Product.productPrice}</h2>
      <div className="flex gap-2">
        <Label>Product-Quantity:</Label>
        <Input
          value={quantiy}
          onChange={(e) => setQuanity(e.target.value)}
          type="number"
        ></Input>
      </div>
      <CartAdd
        productCode={Product.productCode}
        productQuantity={Number(quantiy)}
      />
    </Card>
  );
};

export default ProductVisualizer;
