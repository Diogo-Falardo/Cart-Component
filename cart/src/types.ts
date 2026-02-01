export type Cart_Data = {
  productCode: string;
  productQuantity: number;
};

export type Product_Data = {
  productName: string;
  productPrice: number;
  productCode: string;
};

export const FAKE_PRODUCTS: Product_Data[] = [
  { productName: "product_1", productPrice: 19.99, productCode: "1" },
  { productName: "product_2", productPrice: 79.99, productCode: "2" },
  { productName: "product_3", productPrice: 29.99, productCode: "3" },
  { productName: "product_4", productPrice: 59.99, productCode: "4" },
  { productName: "product_5", productPrice: 24.99, productCode: "5" },
  { productName: "product_6", productPrice: 99.99, productCode: "6" },
  { productName: "product_7", productPrice: 39.99, productCode: "7" },
  { productName: "product_8", productPrice: 189.99, productCode: "8" },
  { productName: "product_9", productPrice: 8.99, productCode: "9" },
  { productName: "product_10", productPrice: 17.49, productCode: "10" },
];
