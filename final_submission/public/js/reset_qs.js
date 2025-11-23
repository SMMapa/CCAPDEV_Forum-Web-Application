document.addEventListener("DOMContentLoaded", function () {
  const resetEmailBtn = document.querySelector("#resetSendEmailBtn");

  resetEmailBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      // Get input values
      const email = document.getElementById("email").value;


      // Perform basic validation
        if (!validateEmail(email)) {
            showError("Please enter a valid email address.");
            return;
        }
        else {
            sendCredentialsToServer(email);
        }

  });



  async function sendCredentialsToServer(email) {

      const response = await fetch('/reset-send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email})
      })
      if(response.status === 403) {
        alert("Invalid email");
      }
      
  }

    function validateEmail(email) {
        if (!email) return false;
        const emailStr = email.toString().trim();
        // generic RFC-ish pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailStr);
    }
});
