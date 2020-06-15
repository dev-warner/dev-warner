const signup = document.querySelector(".sign-up");
const signup_button = document.querySelector(".sign-up__btn");

signup_button &&
  signup_button.addEventListener("click", async function onSubmitSignUp(e) {
    e.preventDefault();

    const formData = new FormData(signup);

    formData.append("form-name", "newsletter");

    const res = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!res.ok) {
      return console.error("oops");
    }

    console.log("yay");
  });
