/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is the sign-up.js file which contains information
 * about verifying if a given user's credentials are in the
 * database and adding a new user when the sign up button
 * is chosen
 */

'use strict';
(function() {
  window.addEventListener("load", init);

  /**
   * This is our init function which calls the addUser function
   * when the submit button is clicked in order to add a new user
   * to the database.
   */
  function init() {
    document.getElementById("submitBtn").addEventListener("click", addUser);
  }

  /**
   * This is the addUser function which retrieves the username and
   * password values from the text box and appends those values
   * to the database given that the username does not already exist.
   * It makes a fetch call to the /addUser endpoint in order to
   * post the data there.
   */
  function addUser() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let bodyData = new FormData();
    bodyData.append("username", username);
    bodyData.append("password", password);
    bodyData.append("email", email);
    fetch("/addUser", {
      method: "POST",
      body: bodyData
    })
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        if (res.error == "Username already exists") {
          document.getElementById("dupUser").classList.remove("hidden");
        } else {
          window.location.href = "page.html";
        }
      })
      .catch(err => {
        handleError(err);
      });
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