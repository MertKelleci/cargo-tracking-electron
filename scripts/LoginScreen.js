const electron = require("electron");
const { ipcRenderer } = electron;

const signup = document.querySelector("#signupButton");
const login = document.querySelector("#loginButton");

signup.addEventListener("click", function () {
  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;

  ipcRenderer.send("signup", { email, password });

  email = "";
  password = "";
});

login.addEventListener("click", function () {
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  ipcRenderer.send("login", { email, password });

  document.querySelector("#loginEmail").value = "";
  document.querySelector("#loginPassword").value = "";
});

ipcRenderer.on("login:error", function () {
  const loginError = document.querySelector("#loginError");
  if (!loginError.hasChildNodes()) {
    const p = document.createElement("p");
    p.className = "text-muted";
    p.innerText = "Hatalı giriş yaptınız, lütfen tekrar deneyin!";

    loginError.appendChild(p);
  }
});
