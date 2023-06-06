'use strict';

//const { stat } = require("fs");

(function() {
  window.addEventListener("load", init);
  function init() {
    setUsername();
    document.getElementById("submitBtn").addEventListener("click", submitFunc);
  }
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
          let showMsg = document.getElementById("creds").classList.remove("hidden");
        }
      })
      .catch(err => {
        handleError(err);
      })
    }

    function setUsername() {
      let username = localStorage.getItem("username");
      if (username) {
        document.getElementById("username").value = username;
      }
    }

    async function statusCheck(response) {
      if(!response.ok) {
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