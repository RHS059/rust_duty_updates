(() => {
  const panel = document.querySelector("#project-status-panel");
  const mobile = matchMedia("(max-width: 900px)");
  const syncPanel = () => { panel.open = !mobile.matches; };
  syncPanel();
  mobile.addEventListener("change", syncPanel);

  const loginButton = document.querySelector("#gallery-login");
  const loginDialog = document.querySelector("#login-dialog");
  const loginForm = document.querySelector("#login-form");
  const loginMessage = document.querySelector("#login-message");
  loginButton.addEventListener("click", () => {
    loginMessage.textContent = "";
    loginDialog.showModal();
  });
  loginDialog.querySelector("[data-close]").addEventListener("click", () => loginDialog.close());
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginForm.elements.password.value = "";
    loginMessage.textContent = "This static replica does not accept logins, uploads, or status posts.";
  });

  document.querySelectorAll(".comment-compose").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.parentElement.querySelector(".comment-message");
      message.textContent = "Comments stay on this page only and are not saved.";
    });
  });
})();
