'use strict';
(function() {
    window.addEventListener("load", init);
    function init() {
        setUsername();
        document.getElementById("submitBtn").addEventListener("click", submitFunc);
        let map = {}
    }
    function submitFunc() {
        console.log("in submit func");
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let bodyData = new FormData();
        localStorage.setItem("username", username);
        bodyData.append("username", username);
        bodyData.append("password", password);
        fetch("/checkUser", {method: "POST", body: bodyData})
            .then(res => res.json())
            .then(res => {
                if (res.length > 0) {
                    window.location.href = "page.html";
                } else {
                    let showMsg = document.getElementById("creds").classList.remove("hidden");
                }
            })
            .catch(err => {
                console.error(err);
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
})();