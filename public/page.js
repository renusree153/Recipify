/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is our page.js file which contains the functionality required
 * to display the grocery items to our users as well as allow them
 * to filter down the groceries based on a specific attribute.
 */

'use strict';

(function() {
  window.addEventListener('load', init);

  /**
   * This is our init function which makes a fetch request to the
   * /getFoodItems API in order to retrieve all the different grocery
   * items and create a card for them to dispaly to the user. This
   * function also allows user to switch between different views
   * and toggle between different ways to see the screen.
   */
  function init() {
    fetch("/getFoodItems")
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          createCard(res[i]);
        }
      })
      .catch(err => {
        handleError(err);
      });
    document.getElementById("switchView").addEventListener("click", function() {
      document.getElementById("grocery-board").classList.toggle("grid-view");
      document.getElementById("grocery-board").classList.toggle("list-view");
    });
    document.getElementById('search-btn').addEventListener('click', search);
    document.getElementById('vegan').addEventListener('click', function() {
      filter("vegan");
    });
    document.getElementById('vegetarian').addEventListener('click', function() {
      filter("vegetarian");
    });
    document.getElementById("lessThan3").addEventListener("click", function() {
      filterPrice(3);
    });
    document.getElementById("lessThan5").addEventListener('click', function() {
      filterPrice(5);
    });
    document.getElementById('all').addEventListener('click', function() {
      getConfirmation(true, null);
    });
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('cart').addEventListener('click', toggleView);
    let bodyData = new FormData();
    bodyData.append('user', window.localStorage.getItem('user'));
    fetch('/checkCart', {method: 'post', body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        res.forEach(function(item) {
          createCartCard(item.name, "images/items/" + item.name + ".jpg", item.id);
        });
      })
      .catch(err => {
        handleError(err);
      });
  }

  /**
   * This is our createCard function which styles the card
   * that we are using to display the grocery item and the image
   * as well as its attributes to the user
   * @param {card} card - takes in a card parameter which is the
   * object that is displayed to the user and styled.
   */
  function createCard(card) {
    let div = document.createElement('div');
    div.id = card.name + " " + card.price;
    let img = document.createElement('img');
    img.src = "images/items/" + card.name.toLowerCase() + ".jpg";
    img.alt = "image of grocery item";
    let p1 = document.createElement('p');
    let desc = document.createElement('p');
    p1.textContent = card.name;
    let p2 = document.createElement('p');
    p2.textContent = card.price;
    if (card.vegan === 1) {
      desc.textContent += "VEGAN ";
      div.classList.add('vegan');
    }
    if (card.vegetarian === 1) {
      desc.textContent += "VEGETARIAN ";
      div.classList.add('vegetarian');
    }
    let btn = document.createElement('button');
    let btn2 = document.createElement("button");
    btn.textContent = "ADD TO CART";
    btn2.textContent = "VIEW INFORMATION/RECIPES";
    btn2.id = "infoBtn";
    btn.addEventListener('click', function() {
      let item = card.name;
      let user = window.localStorage.getItem('user');
      let bodyData = new FormData();
      bodyData.append("item", item);
      bodyData.append('id', user);
      fetch('/addToCart', {method: 'POST', body: bodyData})
        .then(statusCheck)
        .then(res => res.json())
        .then(function(res) {
          let id = res;
          createCartCard(item, "images/items/" + item + ".jpg", id);
        })
        .catch(err => {
          handleError(err);
        });
    });
    btn2.addEventListener("click", function() {
      createRecipeCard(card.name);
    });
    div.appendChild(img);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(desc);
    div.appendChild(btn);
    div.appendChild(btn2);
    document.getElementById('grocery-board').appendChild(div);
  }

  /**
   * This is our createCartCard function which creates a card
   * containing information about the grocery item to display
   * to the user when the item is in the cart.
   * @param {item} item - this is the grocery item that we
   * are looking at currently
   * @param {img} img - this is the image of the given grocery
   * item that we display to the user
   * @param {id} id - this is the id of the grocery item which
   * is used for styling
   */
  function createCartCard(item, img, id) {
    let div = document.createElement("div");
    div.id = id;
    let p1 = document.createElement("p");
    p1.id = "nameItem";
    let price = document.createElement("p");
    price.id = "priceItem";
    p1.textContent = item;
    let img2 = document.createElement("img");
    img2.src = img;
    img2.classList.add(".cartImg");
    div.appendChild(img2);
    div.appendChild(p1);
    document.querySelector("main").appendChild(div);
    document.getElementById("cart-page").appendChild(div);
    let btn = document.createElement('button');
    let btn2 = document.createElement('button');
    btn.textContent = "Purchase";
    btn2.textContent = "Remove";
    btn.addEventListener('click', function() {
      getConfirmation(false, id);
    });
    btn2.addEventListener('click', function() {
      removeCart(id);
    });
    div.append(btn, btn2);
  }

  /**
   * This is our purchase function which makes a fetch
   * call to the /checkCart API in order to purchase
   * the given item if it is in the cart. This function
   * also checks to make sure all items in the cart
   * are in stock before purchase.
   * @param {id} id - takes in an id of the grocery item
   * in order to check if it is available. 
   */
  async function purchase(id) {
    let bodyData = new FormData();
    bodyData.append("id", id);
    let response = await fetch('checkAvailable', {method: 'post', body:bodyData});
    let data = await response.json();
    let inStock = data;
    if (inStock) {
      fetch('/checkCart', {method: "post", body:bodyData})
        .then(res => res.json())
        .then(function(res) {
          res.forEach(function(element) {
            purchase(element.id);
          });
        })
      fetch('/purchaseID', {method: 'post', body:bodyData})
        .catch(err => {
          handleError(err);
        });
    } else {
      noStock();
    }
    fetch('/purchase', {method: "post", body: bodyData})
      .catch(err => {
        handleError(err);
      });
    document.getElementById(id).remove();
  }

  /**
   * This is our removeCart function which makes a fetch
   * call to the /remove API in order to remove the given
   * grocery item from the cart.
   * @param {id} id - this is the id of the grocery item
   * we want to remove
   */
  function removeCart(id) {
    let bodyData = new FormData();
    bodyData.append("id", id);
    fetch('/remove', {method: "post", body: bodyData})
      .then(statusCheck)
      .catch(err => {
        handleError(err);
      });
    document.getElementById(id).remove();
  }

  /**
   * This is our purchaseAll function which checks
   * if all the groceries in the cart are in stock
   * and if they are, it proceeds with purchasing them all.
   */
  async function purchaseAll() {
    let inStock = true;
    let user = window.localStorage.getItem('user');
    let bodyData = new FormData();
    bodyData.append('user', user);
    let response = await fetch('checkAvailable', {method: 'post', body:bodyData});
    let data = await response.json();
    inStock = data;
    if (inStock) {
      fetch('/checkCart', {method: "post", body:bodyData})
        .then(statusCheck)
        .then(res => res.json())
        .then(function(res) {
          res.forEach(function(element) {
            purchase(element.id);
          });
        })
      fetch('/purchaseID', {method: 'post', body:bodyData}).catch(console.error);
    } else {
      noStock();
    }
  }

  /**
   * This is our noStock function which
   * tells the user that one or more of the items
   * in cart may not be in stock when they try to purchase
   * their items from cart.
   */
  function noStock() {
    let div = document.createElement('div');
    div.id = 'noStock';
    let ptag = document.createElement('p');
    ptag.textContent = "Items in cart not in stock";
    div.append(ptag);
    document.querySelector('main').prepend(div);
    setTimeout(() => {
      const div = document.getElementById('noStock');
      if (div) {
        div.remove();
      }
    }, 3000);
  }

  /**
   * This is our getConfirmation function which
   * asks the user if they want to confirm their
   * transaction as a final call before making the
   * purchase.
   * @param {all} all - this is the all parameter
   * which determines if they want to purchase
   * all items or not 
   * @param {id} id  - this is the id of the item
   * that they want to purchase
   */
  function getConfirmation(all, id) {
    let div = document.createElement('div');
    div.id = 'confirmation';
    let ptag = document.createElement('p');
    ptag.textContent = "Confirm your transaction";
    let article = document.createElement('article');
    let btn = document.createElement('button');
    btn.textContent = "Confirm";
    btn.addEventListener('click', function() {
      if (all) {
        purchaseAll();
      } else {
        purchase(id);
      }
      document.getElementById('confirmation').remove();
    });
    let btn2 = document.createElement('button');
    btn2.addEventListener('click', function() {
      document.getElementById('confirmation').remove();
    });
    btn2.textContent = "Decline";
    article.append(btn, btn2);
    div.append(ptag, article);
    document.querySelector('main').prepend(div);
  }

  /**
   * This is our createRecipeCard function which creates the
   * card associated with displaying the recipes for a given grocery
   * item.
   * @param {name} name - it takes in one parameter the name
   * of the grocery item and retrieves informatio about this item
   * including its price, availability and the recipes you can make with it.
   */
  function createRecipeCard(name) {
    let div = document.createElement('div');
    div.id = name + "recipes";
    let p1 = document.createElement('h2');
    p1.textContent = "Here is some information about " + name + " including recipes and item availabiliy";
    div.appendChild(p1);
    div.classList.add("shortRecipes");
    document.querySelector("main").appendChild(div);
    let bodyData = new FormData();
    bodyData.append("item", name);
    let recipeInfo = document.createElement("h4");
    recipeInfo.textContent = "Listed below are some recipes you can make!";
    let itemPrice = document.createElement("p");
    let availability = document.createElement('p');
    fetch("/getItemInfo", {method: "POST", body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        itemPrice.textContent = "The price of this item is $" + res[0].price;
        if (res[0].stock > 0) {
          availability.textContent = "In Stock";
        } else {
          availability.textContent = "out of Stock";
        }
      })
      .catch(err => {
        handleError(err);
      });
    div.appendChild(itemPrice);
    div.appendChild(availability);
    fetch("/getRecipes", {method: "POST", body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          let newRec = document.createElement("p");
          newRec.textContent = "- " + res[i].recipe;
          div.appendChild(newRec);
        }
        let button = document.createElement("button");
        button.textContent = "Close out";
        div.appendChild(button);
        button.addEventListener("click", () => {
          div.remove();
        });
      })
      .catch(err => {
        handleError(err);
      });
    div.appendChild(recipeInfo);
  }

  /**
   * This is our search function which works to
   * filter based on the user's preference. For example,
   * if they specify that they want to see vegetarian
   * groceries, this function will search for those groceries
   * and display it to them
   */
  function search() {
    let keyword = document.getElementById('search-input').value;
    document.querySelectorAll("#grocery-board div").forEach(function(element) {
      let lkey = keyword.toLowerCase();
      let lid = element.id.toLowerCase();
      if (!lid.includes(lkey)) {
        element.style.display = "none";
      } else {
        element.style.display = "inline";
      }
    });
  }

  /**
   * This is our filter function which filters down the
   * grocery items to the desired choice of the user based
   * on the restriction that they have passed in.
   * @param {restriction} restriction - this is the condition
   * in which the user wants to filter their groceries by.
   */
  function filter(restriction) {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      if (element.classList.contains(restriction)) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    });
  }

  /**
   * This is our filterPrice function which filters the groceries
   * based on the numerical value of the price of the given grocery
   * item.
   * @param {price} price - this is the price that the user has defined
   * they want to filter by.
   */
  function filterPrice(price) {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      let itemPrice = element.id.substring(element.id.lastIndexOf(" ") + 1);
      if (parseFloat(itemPrice) < price) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    });
  }

  /**
   * This is our reset function which resets the view of the page
   * to contain all the groceries after some filtering has been done.
   */
  function reset() {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      element.style.display = "inline";
    });
  }

  /**
   * This is our toggleView function which allows the users to
   * toggle between the main state and the cart state to display
   * to the user
   */
  function toggleView() {
    let cartPage = document.getElementById('cart-page');
    let mainPage = document.getElementById('main-page');
    cartPage.classList.toggle('hidden');
    mainPage.classList.toggle('hidden');
    document.getElementById('all').classList.toggle('hidden');
  }

  /**
   * This is my statusCheck function which checks
   * whether or not the response from the endpoint
   * was successful or not.
   * @param {response} response takes in response
   * as a parameter which is the status code received
   * from the fetch request and checks if it is valid or not
   * @returns {response} response - returns a response
   * object that shows whether the fetch was successful or not.
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * This is my handle error function which takes in
   * the error message receivd from the fetch call and
   * append a paragraph onto the webpage stating that
   * there was an error.
   * @param {err} err  - takes in an error object
   * that is retrived from the fetch call.
   */
  function handleError(err) {
    let p1 = document.createElement("p");
    p1.textContent = "There has been an error retrieving your data. Please try again" +
      "Here is the error: " + err;
    document.getElementById("main").appendChild(p1);
  }
})();
