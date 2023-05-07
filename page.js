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
    let btn = document.createElement('button');
    btn.textContent = "ADD TO CART";
    btn.addEventListener('click', function() {
      let item = name;
      if (cartList[item] == null) {
        cartList[item] = 0;
      }
      cartList[item] = cartList[item] + 1;
    })
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(desc);
    div.appendChild(btn);
    document.getElementById('grocery-board').appendChild(div);
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
      printList();
    }
    cartPage.classList.toggle('hidden');
    mainPage.classList.toggle('hidden');
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