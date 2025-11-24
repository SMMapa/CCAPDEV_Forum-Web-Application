document.addEventListener("DOMContentLoaded", function () {
  const resetSendAnswersBtn = document.querySelector("#resetSendAnswersBtn");
    const errorBox = document.querySelector("#errorm");
    const inputForm = document.querySelector("#answer-form");
    const boxContainer = document.querySelector(".login-input-container");
  resetSendAnswersBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      // Get input values
      //const a1 = document.getElementById("ans1").value;
      //const a2 = document.getElementById("ans2").value;

        const formData = new FormData(inputForm);

        const a1 = formData.get("ans1");
        const a2 = formData.get("ans2");
        console.log(a1);
      // Perform basic validation
        if (validateField(a1) && validateField(a2)) {
            sendCredentialsToServer(a1,a2);
        }
        else {
            showError("Please provide answers to both security questions.");
            return;
        }

  });


    function validateField(value) {
      return value.trim() !== "";
  }


  function showError(msg) {
        if (!errorBox) {
            alert(msg); 
            return;
        }
        errorBox.textContent = msg;
    }


  async function sendCredentialsToServer(a_1,a_2) {

      let answers = {
        a1: a_1,
        a2: a_2
      }
      const response = await fetch('/reset_send_answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      })
      if(response.status === 403) {
        alert("Invalid answer/s");
        inputForm.remove();
        const blockt = document.createElement("div");
        const node = document.createTextNode("Invalid answer/s.");
        const go_back = document.createElement("a");
        let gbtext = document.createTextNode("\nReturn to homepage");
        go_back.appendChild(gbtext);
        go_back.href = "/home";
        blockt.appendChild(node);
        blockt.appendChild(go_back);
        boxContainer.appendChild(blockt);
      } else if(response.status === 200) {
        window.location = "/set_new";
      }
      
  }

});
