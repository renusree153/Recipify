'use strict';
(function() {
  window.addEventListener("load", init);
  function init() {
    document.getElementById("submitBtn").addEventListener("click", addUser);
  }
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