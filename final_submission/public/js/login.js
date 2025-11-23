document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector("#loginBtn");

  loginBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      // Get input values
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Perform basic validation
      if (validateField(username) && validateField(password)) {
          // Send the credentials to the server for further validation
          sendCredentialsToServer(username, password);
      } else {
          alert("Please enter valid credentials.");
      }
  });

  function validateField(value) {
      return value.trim() !== "";
  }

  async function sendCredentialsToServer(username, password) {

      const response = await fetch('/go-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,password})
      })
      if(response.status === 200) {
        window.location.href = "/home";
      }
      else if (response.status === 423) {
        alert("Account temporarily locked. Try again later."); 
      } 
      else if (response.status === 401) {
        alert("Invalid username and/or password.");
    }
    else {
        alert("Something went wrong. Please try again later.");
    }
  }
});
