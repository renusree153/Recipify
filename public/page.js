'use strict';
(function() {

  const ITEMS = ["Bok Choy", "Cabbage", "Carrot", "Chicken", "Eggs",
                 "Green Onion", "Lettuce", "Milk", "Peanut", "Potato",
                 "Red Onion", "Yellow Onion"];
  const NONVEGAN = ["Chicken", "Eggs", "Milk"];
  const NONVEGETARIAN = ["Chicken"];

  let cartList = {};

  window.addEventListener('load', init);

  function init() {
    ITEMS.forEach(createCard);
    document.getElementById("switchView").addEventListener("click", function() {
      document.getElementById("grocery-board").classList.toggle("grid-view");
      document.getElementById("grocery-board").classList.toggle("list-view");
    })
    document.getElementById('search-btn').addEventListener('click', search);
    document.getElementById('vegan').addEventListener('click', function() {
      filter("vegan");
    });
    document.getElementById('vegetarian').addEventListener('click', function() {
      filter("vegetarian");
    });
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('cart').addEventListener('click', toggleView);
  }

  function createCard(name) {
    let div = document.createElement('div');
    div.id = name;
    let img = document.createElement('img');
    img.src = "images/items/" + name + ".jpg";
    img.alt = "image of grocery item";
    let p = document.createElement('p');
    let desc = document.createElement('p');
    p.textContent = name;
    if (!NONVEGAN.includes(name)) {
      desc.textContent += "VEGAN "
      div.classList.add('vegan');
    }
    if (!NONVEGETARIAN.includes(name)) {
      desc.textContent += "VEGETARIAN "
      div.classList.add('vegetarian');
    }
    if (NONVEGETARIAN.includes(name)) {
      desc.textContent = "NON-VEGETARIAN"

    }
    let btn = document.createElement('button');
    let btn2 = document.createElement("button");
    btn.textContent = "ADD TO CART";
    btn2.textContent = "VIEW RECIPES";
    btn.addEventListener('click', function() {
      let item = name;
      if (cartList[item] == null) {
        cartList[item] = 0;
      }
      cartList[item] = cartList[item] + 1;
      createCartCard(item, img.src);
    })
    btn2.addEventListener("click", function() {
      createRecipeCard(name);
    })
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(desc);
    div.appendChild(btn);
    div.appendChild(btn2);
    document.getElementById('grocery-board').appendChild(div);
  }

  function createCartCard(item, img) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.id = "nameItem";
    let price = document.createElement("p");
    price.id = "priceItem";
    p.textContent = item;
    let img2 = document.createElement("img");
    img2.src = img;
    img2.classList.add(".cartImg");
    div.appendChild(img2);
    div.appendChild(p);
    document.querySelector("main").appendChild(div);
    document.getElementById("cart-page").appendChild(div);
  }

  function createRecipeCard(name) {
    let div = document.createElement('div');
    div.id = name + "recipes";
    let p = document.createElement('p');
    p.textContent = "Here are some recipes you can make with " + name;
    div.appendChild(p);
    div.classList.add("shortRecipes");
    document.querySelector("main").appendChild(div);
    let button = document.createElement("button");
    button.textContent = "Close out"
    div.appendChild(button);
    button.addEventListener("click", () => {
      div.style.display = "none";
    })
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

  function reset() {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      element.style.display = "inline";
    });
    console.log(cartList);
  }

  function toggleView() {
    let cartPage = document.getElementById('cart-page');
    let mainPage = document.getElementById('main-page');
    if (cartPage.classList.contains('hidden')) {
      //printList();
    }
    cartPage.classList.toggle('hidden');
    mainPage.classList.toggle('hidden');
    console.log("in cart view");
  }

  function printList() {
    document.getElementById('cart-list').innerHTML = "";
    for (const [key, value] of Object.entries(cartList)) {
      let li = document.createElement('li');
      li.textContent = key + " x" + value;
      document.getElementById('cart-list').appendChild(li);
    }
  }
})();