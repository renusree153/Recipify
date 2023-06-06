'use strict';
(function() {

  window.addEventListener('load', init);

  function init() {
    fillPurchases(window.localStorage.getItem('user'));
  }

  function fillPurchases(name) {
    let bodyData = new FormData();
    bodyData.append("name", name);
    fetch("/getPurchases", {method: 'POST', body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
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
          appendChildren(newDiv, img, itemDes, purchaseId, purchaseDate);
          document.getElementById("purchases-items").appendChild(newDiv);
        });
      })
      .catch(err => {
        handleError(err);
      });
  }

  function appendChildren(newDiv, img, itemDes, purchaseId, purchaseDate) {
    newDiv.appendChild(img);
    newDiv.appendChild(itemDes);
    newDiv.appendChild(purchaseId);
    newDiv.appendChild(purchaseDate);
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