const signup = document.querySelector(".sign-up__form");

signup &&
  signup.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    formData.append("form-name", "newsletter");

    const res = await fetch("/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return console.log("oops: somethings wrong.");
    }

    signup.innerHTML = `<div class="info">Almost there! Check your inbox for a confirmation e-mail 🚀</div>`;
  });
