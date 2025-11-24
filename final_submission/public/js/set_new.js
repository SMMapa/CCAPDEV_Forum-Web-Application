document.addEventListener("DOMContentLoaded", function () {
  const sendPwsBtn = document.querySelector("#sendPwsBtn");
    const errorBox = document.querySelector("#errorm");
    const inputForm = document.querySelector("#res-form");
    const boxContainer = document.querySelector(".login-input-container");
  sendPwsBtn.addEventListener("click", async function (e) {
      e.preventDefault();

       if (errorBox) errorBox.textContent = "";

        const formData = new FormData(inputForm);

        const oldpw = formData.get("oldpassword");
        const newpw = formData.get("newpassword");
        const confirm = formData.get("confirm");
      // Perform basic validation
        if (!validateField(oldpw) || !validateField(newpw) || !validateField(confirm)) {
            inputForm.reset();
            showError("Missing one or more inputs");
            return;
        }

        if(comparePWs(oldpw,newpw)) {
            inputForm.reset();
            showError("You may not reuse your old password");
            return;
        }

        if(!comparePWs(newpw,confirm)) {
            inputForm.reset();
            showError("Passwords do not match");
            return;
        }
        
        sendCredentialsToServer(oldpw,newpw,confirm);

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


    function comparePWs(newpw,confirm) {
        return (confirm === newpw);
    }

  async function sendCredentialsToServer(oldpw,newpw,confirm) {

      let pws = {
        o: oldpw,
        n: newpw,
        c: confirm
      }
      const response = await fetch('/set_new_pw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pws)
      })
      if(response.status === 403) {
        inputForm.remove();
        const blockt = document.createElement("div");
        const node = document.createTextNode("Incorrect password/s.");
        const go_back = document.createElement("a");
        let gbtext = document.createTextNode("\nReturn to homepage");
        go_back.appendChild(gbtext);
        go_back.href = "/home";
        blockt.appendChild(node);
        blockt.appendChild(go_back);
        boxContainer.appendChild(blockt);
      } else if(response.status === 200) {
        inputForm.remove();
        const blockt = document.createElement("div");
        const node = document.createTextNode("Password successfully changed.");
        const go_back = document.createElement("a");
        let gbtext = document.createTextNode("\nLogin");
        go_back.appendChild(gbtext);
        go_back.href = "/login";
        blockt.appendChild(node);
        blockt.appendChild(go_back);
        boxContainer.appendChild(blockt);
      }
      
  }

});
