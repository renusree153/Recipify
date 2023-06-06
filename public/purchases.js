/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is the purchases.js file which contains information
 * about displaying the past purchases for a user to the website.
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * This is our init function which calls the fillPurchases
   * function in order to populate the website with all the past
   * purchases a given user has made.
   */
  function init() {
    fillPurchases(window.localStorage.getItem('user'));
  }

  /**
   * This is our fillPurchases function which makes a
   * fetch request to the /getPurchases endpoint
   * and retrieves the purchaseID, date of purchase,
   * among other information for a given user.
   * @param {name} name - name is the user's name
   * which is passed in as a parameter to retrieve
   * purchase history for them
   */
  function fillPurchases(name) {
    console.log(name);
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

  /**
   * This is our appendChildren function which
   * takes in the different elements on the page and appends
   * them onto the main element in order for it to be displayed
   * to the user.
   * @param {newDiv} newDiv - this is the main element in which
   * we will be appening the other elements onto
   * @param {img} img - this is the image of the item that is
   * purchased
   * @param {itemDes} itemDes - this is a description of the item
   * that is going to be shown with the purchase history
   * @param {purchaseId} purchaseId - this is the ID of the purchase
   * which is also going to be shown to the user
   * @param {purchaseDate} purchaseDate - this is the date in which
   * each purchase was made by the user
   */
  function appendChildren(newDiv, img, itemDes, purchaseId, purchaseDate) {
    newDiv.appendChild(img);
    newDiv.appendChild(itemDes);
    newDiv.appendChild(purchaseId);
    newDiv.appendChild(purchaseDate);
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