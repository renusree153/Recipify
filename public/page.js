'use strict';

(function() {

  const LESSTHAN3 = 3;
  const LESSTHAN5 = 5;
  window.addEventListener('load', init);

  function init() {
    getFoodItems();
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
      filterPrice(LESSTHAN3);
    });
    document.getElementById("lessThan5").addEventListener('click', function() {
      filterPrice(LESSTHAN5);
    });
    document.getElementById('all').addEventListener('click', function() {
      getConfirmation(true, null);
    });
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('cart').addEventListener('click', toggleView);
    checkCart();
  }

  function getFoodItems() {
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
  }

  function checkCart() {
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
    checkStatus(card, desc, div);
    let btn = document.createElement('button');
    let btn2 = document.createElement("button");
    btn.textContent = "ADD TO CART";
    btn2.textContent = "VIEW INFORMATION/RECIPES";
    btn2.id = "infoBtn";
    btnFunc(btn, card, card.name, window.localStorage.getItem('user'));
    btn2.addEventListener("click", function() {
      createRecipeCard(card.name);
    });
    div.appendChild(img);
    appendChildren(div, p1, p2, desc, btn, btn2);
    document.getElementById('grocery-board').appendChild(div);
  }

  function checkStatus(card, desc, div) {
    if (card.vegan === 1) {
      desc.textContent += "VEGAN ";
      div.classList.add('vegan');
    }
    if (card.vegetarian === 1) {
      desc.textContent += "VEGETARIAN ";
      div.classList.add('vegetarian');
    }
  }

  function btnFunc(btn, card, item, user) {
    btn.addEventListener('click', function() {
      let bodyData = new FormData();
      bodyData.append("item", item);
      bodyData.append('id', user);
      addCart(card);
    });
  }

  function appendChildren(div, p1, p2, desc, btn, btn2) {
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(desc);
    div.appendChild(btn);
    div.appendChild(btn2);
  }

  function addCart(card) {
    let item = card.name;
    let bodyData = new FormData();
    bodyData.append("item", item);
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
  }

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

  function purchase(id) {
    let bodyData = new FormData();
    bodyData.append("id", id);
    fetch('/purchase', {method: "post", body: bodyData})
      .then(statusCheck)
      .catch(err => {
        handleError(err);
      });
    document.getElementById(id).remove();
  }

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

  function purchaseAll() {
    let user = window.localStorage.getItem('user');
    let bodyData = new FormData();
    bodyData.append('user', user);
    fetch('/checkCart', {method: "post", body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        res.forEach(function(element) {
          purchase(element.id);
        });
      })
      .catch(err => {
        handleError(err);
      });
  }

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

  function createRecipeCard(name) {
    let itemPrice = document.createElement("p");
    itemPrice.textContent = "The price of this item is $" + res[0].price;
    let availability = document.createElement('p');
    if (res[0].stock > 0) {
      availability.textContent = "In Stock";
    } else {
      availability.textContent = "out of Stock";
    }
    let div = document.createElement('div');
    div.id = name + "recipes";
    let p1 = document.createElement('h2');
    p1.textContent = "Here is some information about " + name + " including recipes and item availabiliy";
    div.appendChild(p1);
    div.classList.add("shortRecipes");
    document.querySelector("main").appendChild(div);
    let recipeInfo = document.createElement("h4");
    recipeInfo.textContent = "Listed below are some recipes you can make!";
    getItemInfo(name);
    div.appendChild(itemPrice);
    div.appendChild(availability);
    getRecipes(name);
    div.appendChild(recipeInfo);
  }

  function getItemInfo(name) {
    let availability = document.createElement('p');
    let itemPrice = document.createElement("p");
    let bodyData = new FormData();
    bodyData.append("item", name);
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
  }

  function getRecipes(name, div) {
    let bodyData = new FormData();
    bodyData.append("item", name);
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
  }

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

  function filter(restriction) {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      if (element.classList.contains(restriction)) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    });
  }

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

  function reset() {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      element.style.display = "inline";
    });
  }

  function toggleView() {
    let cartPage = document.getElementById('cart-page');
    let mainPage = document.getElementById('main-page');
    cartPage.classList.toggle('hidden');
    mainPage.classList.toggle('hidden');
    document.getElementById('all').classList.toggle('hidden');
  }

  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  function handleError(err) {
    let p1 = document.createElement("p");
    p1.textContent = "There has been an error retrieving your data. Please try again" +
      "Here is the error: " + err;
    document.getElementById("main").appendChild(p1);
  }
})();