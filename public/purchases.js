'use strict';
(function() {

  window.addEventListener('load', init);

  function init() {
    fillPurchases(window.localStorage.getItem('user')); 
  }

  function fillPurchases(name) {
    let bodyData = new FormData();
    bodyData.append("name", name)
    fetch("/getPurchases", {method:'POST', body: bodyData})
      .then(res => res.json())
      .then(res => {
        console.log(res);
        res.forEach(resObj => {
          let newDiv = document.createElement("div");
          let img = document.createElement("img");
          img.src = "/images/items/" + resObj.name + ".jpg";
          img.class = "imgSize";
          newDiv.id = "purchaseDiv";
          let itemDes = document.createElement("p");
          itemDes.textContent = "Item name is: " + resObj.name;
          let purchaseId = document.createElement("p");
          purchaseId.textContent = "The purchase ID of this order is: " + resObj.id;
          purchaseId.id = "purchaseID";
          let purchaseDate = document.createElement("p");
          purchaseDate.textContent = "The date of this purchase is: " + resObj.date;
          newDiv.appendChild(img);
          newDiv.appendChild(itemDes);
          newDiv.appendChild(purchaseId);
          newDiv.appendChild(purchaseDate);
          document.getElementById("purchases-items").appendChild(newDiv);
        })
      });   
  }

  function createPurchaseCard(item, img, id) {
    let div = document.createElement("div");
    div.id = id;
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
    //document.querySelector("main").appendChild(div);
    document.getElementById("cart-page").appendChild(div);
    let btn = document.createElement('button');
    let btn2 = document.createElement('button');
    btn.textContent = "Purchase";
    btn2.textContent = "Remove";
    btn.addEventListener('click', function() {
      purchase(id);
    });
    btn2.addEventListener('click', function() {
      removeCart(id);
    });
    div.append(btn, btn2);
  }

  function purchase(id) {
    let bodyData = new FormData();
    bodyData.append("id", id);
    fetch('/purchase', {method: "post", body: bodyData}).catch(console.error);
    document.getElementById(id).remove();
  }

})();