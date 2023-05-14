EndPoint: sitename/api/recipes

Request format: api/recipes?filter=all
Description: First request type of "all" returns list of
             objects representing all recipes
Return type: JSON
Example response:
  {
    "recipes": [
      {
        "name": "Pad Thai",
        "allergies": ["fish", "shellfish", "wheat"],
        "rating": 5
      },
      {
        "name": "Fettuccine Pasta",
        "allergies": ["wheat", "dairy"],
        "rating": 4
      }
    ]
  }
Possible errors: None?

Request format: api/recipes?filter={item name}
Description: Second request type returns lsit of
             objects filtered for any that contain
             the item name
Return type: JSON
Example Response/Request:
  api/recipes?filter=fish
  {
    "recipes": [
      {
        "name": "Fettuccine Pasta",
        "allergies": ["wheat", "dairy"],
        "rating": 4
      }
    ]
  }
Possible errors: Invalid item name

Request format: api/recipes?filter={item 1 name} & {item 2 name}
Description: Third request type returns list of
             objects filtered for any that contain
             either item 1 or item 2
return type: JSON
Example Response,Request:
  api/recipes?filter=fish&dairy
  {
    "recipes": [
    ]
  }
Possible errors: Invalid item name


EndPoint: https:sitename/api/groceries

Request format: api/groceries?item=all
Description: First request type of "all" returns a list of
             objects representing each item that the user can
             purchase
Method: get
Return type: Json
Example response:
  sitename/api/groceries?item=all
  {
    "groceries": [
      {
        "item": "apple",
        "price": "2.99"
        "inStock": true,
        "image": Don't know if pictures will be online.png
      },
      {
        "item": "eggs",
        "price": "8.00",
        "inStock": false,
        "image": Online somewhere or not
      }
    ]
  }

Possible errors: None

Request format: api/grocieries?item={item name}
Description: Second request type returns the data
             of the object representing the user given
             item
Method: Get
Return type: JSON
Example response/request:
  sitename/api/groceries?item=eggs
  {
    "item": "eggs",
    "price": "8.00",
    "inStock": false,
    "image": Online somewhere or not
  }
Possible errors: Invalid item name

EndPoint: sitename/api/login

Request format: sitename/api/login?user=something&&pw=something
Description: The two parameters represent the username
             and password the user entered in the login
             screen. This implementation is bad security wise
             but I was unsure on what the request would look like
Method: Post
Return type: Boolean?
Example response/request:
  sitename/api/login
  false for incorrect info
  true for correct
Possible errors: Invalid item name

EndPoint: sitename/api/checkout

Request format: sitename/api/checkout
Description: No parameters and calls the API
             to order the grocery items. Returns
             a boolean on whether or not the order
             was successful
Method: Post
Return type: Boolean
Example response/request:
sitename/api/checkout
  true if the order went through
  false if declined somewhere?
Possible errors: None

Endpoint: sitename/api/cart

Request format: sitename/api/cart
Description: No parameters and returns a list of
             objects that show how many of each item
             is in the user's cart
Method: Get
Return type: JSON
Example reponse/request:
  sitename/api/cart
  {
    "cart": [
      {
        "item": "apple",
        "price": "2.99"
        "image": Don't know if pictures will be online.png,
        "quantity": 2
      },
      {
        "item": "cucumber",
        "price": "8.00",
        "image": Online somewhere or not
        "quantity": 3
      }
    ]
  }
Possible errors: None