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
  {
    productName: "Wireless Mouse",
    productPrice: 19.99,
    productQuantity: 45,
    productCode: 100001,
  },
  {
    productName: "Mechanical Keyboard",
    productPrice: 79.99,
    productQuantity: 20,
    productCode: 100002,
  },
  {
    productName: "USB-C Charger 65W",
    productPrice: 29.99,
    productQuantity: 60,
    productCode: 100003,
  },
  {
    productName: "Bluetooth Headphones",
    productPrice: 59.99,
    productQuantity: 35,
    productCode: 100004,
  },
  {
    productName: "Laptop Stand",
    productPrice: 24.99,
    productQuantity: 50,
    productCode: 100005,
  },
  {
    productName: "Portable SSD 1TB",
    productPrice: 99.99,
    productQuantity: 15,
    productCode: 100006,
  },
  {
    productName: "Webcam 1080p",
    productPrice: 39.99,
    productQuantity: 28,
    productCode: 100007,
  },
  {
    productName: "Monitor 27-inch",
    productPrice: 189.99,
    productQuantity: 12,
    productCode: 100008,
  },
  {
    productName: "HDMI Cable 2m",
    productPrice: 8.99,
    productQuantity: 150,
    productCode: 100009,
  },
  {
    productName: "Desk Lamp LED",
    productPrice: 17.49,
    productQuantity: 40,
    productCode: 100010,
  },
];
