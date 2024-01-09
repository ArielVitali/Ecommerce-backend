const form = document.getElementById("loginForm");
const respuesta = document.getElementById("respuesta");
const productsLink = document.getElementById("productsLink");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  const url = "/api/auth/passwordUpdate";
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";
  const body = JSON.stringify(obj);

  fetch(url, {
    headers,
    method,
    body,
  })
    .then((response) => response.json())
    .then((data) => procesarDatos(data))
    .catch((err) => console.log(err));
  setTimeout(() => {
    productsLink.click();
  }, 2000);
});

function procesarDatos(data) {
  console.log(data);
  respuesta.innerHTML = `<h1>Mensaje: ${data.mesagge}</h1>`;
}
