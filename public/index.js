/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is the index.js file which contains the logic behind retrieving
 * the username from past login sessions, and logging in the user
 * given that they have provided the correct username and password.
 */

'use strict';
(function() {
  window.addEventListener("load", init);

  /**
   * This is my init function which calls the setUsername function
   * in order to retrieve the last used username from local storage.
   * It also calls the submitFunc function which further verifies
   * if a given username and password are correct or not.
   */
  function init() {
    setUsername();
    document.getElementById("submit-btn").addEventListener("click", submitFunc);
  }

  /**
   * This is my submitFunc function which makes a makes a fetch call to the
   * /checkUser endpoint in order
   * to check whether or not the passed in credentials were accurate.
   * If they are accurate, the user is logged in and if not, they are
   * shown an error message
   */
  function submitFunc() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let bodyData = new FormData();
    localStorage.setItem("username", username);
    bodyData.append("username", username);
    bodyData.append("password", password);
    fetch("/checkUser", {method: "POST", body: bodyData})
      .then(statusCheck)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          window.location.href = "page.html";
          window.localStorage.setItem('user', username);
        } else {
          document.getElementById("creds").classList.remove("hidden");
        }
      })
      .catch(err => {
        handleError(err);
      });
  }

  /**
   * This is my setUsername function which retrieves the value
   * of the last user who signed in from local storage and
   * assigns the username textbox value to that user, if they exist.
   */
  function setUsername() {
    let username = localStorage.getItem("username");
    if (username) {
      document.getElementById("username").value = username;
    }
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