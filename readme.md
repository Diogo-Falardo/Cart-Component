# Cart System Component

    Using Shadcn for componets
    Main Files: Cart, Cart Add

This is just a template you need to upgrade validations functions  
Template without UI (shadcn default white theme)

# Basic logic

- Receives an item
- Add the item to a list of items
- Send the list to an api

#### Data of an item: Name, Price, Quantity, Code.

- Code: is used to store the item in the local storage

### FILE : Product Visualizer

    this file represents one item

- in main.tsx its called for every item in json "const"  
  JSON: FAKE_PRODUCTS

### FILE : Cart Add

    this file is basicly a button.

- receives an id passed on something (ex.: "Displayer")
- receives the number of items (quantity)
- adds the id of the item and the corresponding quantity to the LocalStorage

### FILE : Cart

    this file is the cart
    "sidebar that opens and shows the items and have a checkout button"

- gets the items stored in the localstorage
- display them on a sheet ("sidebar")
- sends the data to an api
