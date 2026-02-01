import type { Cart_Data } from "./types";
// ui
import { Button } from "./components/ui/button";

const CartAdd = ({ productCode, productQuantity }: Cart_Data) => {
  // code | quantiy
  const addItemToStorage = () => {
    console.log(productCode, productQuantity);
    localStorage.setItem("cart-item:" + productCode, String(productQuantity));
  };

  return (
    <Button variant={"outline"} onClick={() => addItemToStorage()}>
      add
    </Button>
  );
};

export default CartAdd;
