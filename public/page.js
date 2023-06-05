'use strict';
(function() {

  window.addEventListener('load', init);

  function init() {
    fetch("/getFoodItems")
      .then(res => res.json())
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          createCard(res[i]);
        }
      })
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
    document.getElementById("lessThan3").addEventListener("click", function() {
      filterPrice(3);
    })
    document.getElementById("lessThan5").addEventListener('click', function() {
      filterPrice(5);
    })

    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('cart').addEventListener('click', toggleView);
  }

  function createCard(card) {
    let div = document.createElement('div');
    div.id = card.name + " " + card.price;
    let img = document.createElement('img');
    img.src = "images/items/" + card.name.toLowerCase() + ".jpg";
    img.alt = "image of grocery item";
    let p = document.createElement('p');
    let desc = document.createElement('p');
    p.textContent = card.name;
    let p2 = document.createElement('p');
    p2.textContent = card.price;
    if (card.vegan == 1) {
      desc.textContent += "VEGAN "
      div.classList.add('vegan');
    }
    if (card.vegetarian == 1) {
      desc.textContent += "VEGETARIAN "
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
        .catch(console.error);
    })
    btn2.addEventListener("click", function() {
      createRecipeCard(card.name);
    })
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(p2);
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
    let p = document.createElement('h2');
    p.textContent = "Here is some information about " + name + " including recipes and item availabiliy";
    div.appendChild(p);
    div.classList.add("shortRecipes");
    document.querySelector("main").appendChild(div);
    let bodyData = new FormData();
    bodyData.append("item", name);
    let recipeInfo = document.createElement("h4");
    recipeInfo.textContent = "Listed below are some recipes you can make!";
    let itemPrice = document.createElement("p");
    let availability = document.createElement('p');
    fetch("/getItemInfo", {method: "POST", body: bodyData})
      .then(res => res.json())
      .then(res => {
        //console.log(res[0].price);
        //itemPrice.id = "itemPrice";
        itemPrice.textContent = "The price of this item is $" + res[0].price;
        if (res[0].stock > 0) {
          availability.textContent = "In Stock";
        } else {
          availability.textContent = "out of Stock";
        }
      });
    div.appendChild(itemPrice);
    div.appendChild(availability);
    fetch("/getRecipes", {method: "POST", body: bodyData})
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
        })
      })
      .catch(err => {
        console.error(err);
      })
      div.appendChild(recipeInfo);

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
      console.log(element);
      if (element.classList.contains(restriction)) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    });
  }

  function filterPrice (price) {
    document.querySelectorAll('#grocery-board div').forEach(function(element) {
      let itemPrice = element.id.substring(element.id.lastIndexOf(" ") + 1);
      console.log(itemPrice);
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
    console.log(cartList);
  }

  function toggleView() {
    let cartPage = document.getElementById('cart-page');
    let mainPage = document.getElementById('main-page');
    cartPage.classList.toggle('hidden');
    mainPage.classList.toggle('hidden');
    if (!(cartPage.classList.contains('hidden'))) {
    }
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