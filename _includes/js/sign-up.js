const signup = document.querySelector(".sign-up");
const signup_button = document.querySelector(".sign-up__btn");

signup_button &&
  signup_button.addEventListener("click", async function onSubmitSignUp() {
    Sparkle.start({
      className: "body",
      animationDuration: "3s",
      particles: 50,
    });
  });
