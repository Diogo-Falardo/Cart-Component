type productCode_ = {
  productCode: string;
};

const cartAdd = ({ productCode }: productCode_) => {
  const addItemToStorage = () => {
    localStorage.setItem("cart", productCode);
  };

  return <button onClick={() => addItemToStorage()}>add</button>;
};

export default cartAdd;
