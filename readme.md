# Cart System Component

    Using Shadcn for componets
    Main Files: cart.tsx, add-to-cart.tsx

This is just a template you need to upgrade validations functions  
Template without UI (shadcn default white theme)

# Basic logic

- We have a list of items:
  - Every item has a button "add-to-cart"
- Button: "add-to-cart" adds the item id to the localstorage
- Dialog: "cart" shows the list of items that are in localstorage

#### Data of an item: Id, Name, Price, Image

- Id: is used to store the item in the local storage

### Button : add-to-cart.tsx

    Imagine that this file represents one item

- In main.tsx its called for every item in the list of items
- What id does:
  - Inserts a new array with that item to he localstorage
    **Or**
  - Inserts a new id to the array of items already in localstorage

### Popover : cart.tsx

    this file is the cart
    ONCLICK: "opens and shows the items"

- Only after the onclick: it syncs the products from the localstorage and stores them into a useState(setCartsIds)
- (cartItems) Use memo will fetch all the products from the products passed from the parameters of the cart and will store on a new array the current product and its index
- TotalPrice is calculated from the cartItems
- (removeCartItem) only removes the item by its index
