window.onload = function () {
  fetch("/api/products")
    .then((response) => response.json())
    .then((data) => procesarDatos(data.payload))
    .catch((error) => console.error(error));
};

const productos = document.getElementById("productos");
const cartel = document.getElementById("cartel");
let pid;
let cid;

function procesarDatos(data) {
  console.log(data);
  if (data.user.cart._id == undefined) {
    cid = data.user.cart;
  } else {
    cid = data.user.cart._id;
  }

  cartel.innerHTML = `<h1>¡Bienvenido/a ${data.user.first_name} ${data.user.last_name}!</h1> <h3>Eres: ${data.user.role}</h3>`;
  let html = data.playload.map((data) => {
    let respon = `<div class="product-info container">
        <h2>${data.title}</h2>
        <p>description: ${data.description}</p>
        <p>stock: ${data.stock}</p>
        <p>price: ${data.price}</p>
        <img src="${data.thumbnail[0]}" alt="img"  width="200" height="150">
        <div class="container">
        <button class="btn btn-dark"><a class="text-decoration-none text-light" href='/products/${data._id}'>Product details</a></button>
        <button class="btn btn-dark aadProduct" value=${data._id}>Add to card</button>
        </div>
      </div>`;
    return respon;
  });
  productos.innerHTML = html.join("");
}

document.addEventListener("click", (e) => {
  const actionBtn = e.target;
  pid = actionBtn.value;
  if (actionBtn.className.includes("aadProduct")) {
    console.log(pid);
    console.log(cid);
    fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: actionBtn.value }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }
});
