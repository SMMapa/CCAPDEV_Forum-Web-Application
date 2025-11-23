const User = function (name, email, password, username,sq_1,a1,sq_2,a2) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.sq_1 = sq_1;
    this.a1 = a1;
    this.sq_2 = sq_2;
    this.a2 = a2;
};

const users = [];

document.addEventListener("DOMContentLoaded", function () {
    console.log("Test");
    const userForm = document.querySelector("#register-form");
    const userInput = document.querySelector("#registerBtn");
    const errorBox = document.querySelector("#errorm");

    userInput?.addEventListener("click", async function (e) {
        e.preventDefault();

        if (errorBox) errorBox.textContent = "";

        const formData = new FormData(userForm);

        const realName = formData.get("realname");
        const email    = formData.get("email");
        const password = formData.get("password");
        const username = formData.get("username");
        const sq_1 = formData.get("sq1");
        const an_1 = formData.get("a1");
        const sq_2 = formData.get("sq2");
        const an_2 = formData.get("a2");

        // ----- Client-side validation -----
        if (!validateField(realName)) {
            showError("Name is required.");
            return;
        }

        if (!validateField(username)) {
            showError("Username is required.");
            return;
        }

        if (!validateEmail(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            // Message is also in validatePassword, but in case you want a generic one:
            showError(
              "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }

        if(!validateSQAnswer(an_1) || !validateSQAnswer(an_2)) {
            showError(
              "Answers are required for both security questions."
            );
            return;
        }

        // If all validations pass, build the object
        let u = new User(realName, email, password, username,sq_1,an_1,sq_2,an_2);

        let registerobject = {
            name: u.name,
            email: u.email,
            password: u.password,
            username: u.username,
            sq_1: u.sq_1,
            a1: u.a1,
            sq_2: u.sq_2,
            a2: u.a2
        };

        let rgstring = JSON.stringify(registerobject);
        console.log(rgstring);

        try {
            const response = await fetch("/make-user", {
                method: "POST",
                body: rgstring,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                window.location = '/login';
            } else if (response.status === 403) {
                showError("Error: user already exists!");
            } else {
                showError("Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            showError("A network error occurred. Please try again.");
        }
    });

    function validateField(value) {
        if (value == null) return false;
        return value.toString().trim() !== "";
    }

    function validateEmail(email) {
        if (!email) return false;
        const emailStr = email.toString().trim();
        // generic RFC-ish pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailStr);
    }

    function validateSQAnswer(answer) {
        if(!answer) return false;
    }

    // Enforce password length + complexity (v & vi in your checklist)
    function validatePassword(password) {
        if (!password) return false;
        const pwd = password.toString();

        // Length requirement (adjust if your policy says 8 instead of 12)
        const MIN_LENGTH = 12;
        if (pwd.length < MIN_LENGTH) {
            console.warn("Password too short");
            return false;
        }

        // Complexity:
        //  - at least one lowercase
        //  - at least one uppercase
        //  - at least one digit
        //  - at least one special character
        const complexityRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

        const isValid = complexityRegex.test(pwd);
        if (!isValid) {
            console.warn("Password does not meet complexity requirements");
        }
        return isValid;
    }

    function showError(msg) {
        if (!errorBox) {
            alert(msg); 
            return;
        }
        errorBox.textContent = msg;
    }
});
