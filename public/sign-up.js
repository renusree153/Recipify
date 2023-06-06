'use strict';
(function() {
    window.addEventListener("load", init);
    function init() {
        document.getElementById("submitBtn").addEventListener("click", addUser)
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
        .then(res => res.json())
        .then(res => {
            if (res.error == "Username already exists") {
                document.getElementById("dupUser").classList.remove("hidden");
            } else {
                window.location.href = "page.html";
            }
        });
    }

    // once Theo modifies database to have email too, append that as well, need id for this table as well

    async function statusCheck(response) {
        if(!response.ok) {
            throw new Error(await response.text());
        }
        return response;
    }
})();