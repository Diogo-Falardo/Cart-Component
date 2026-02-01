import type { Cart_Data } from "./types";

const cartAdd = ({ productCode, productQuantity }: Cart_Data) => {
  // code | quantiy
  const addItemToStorage = () => {
    localStorage.setItem(productCode, String(productQuantity));
  };

  return <button onClick={() => addItemToStorage()}>add</button>;
};

export default cartAdd;
