window.onload = function () {
  fetch("/api/products")
    .then((response) => response.json())
    .then((data) => procesarDatos(data.payload))
    .catch((error) => console.error(error));
};

const productos = document.getElementById("productos");
const cartel = document.getElementById("cartel");

function procesarDatos(data) {
  let html = data.playload.map((data) => {
    let respon = `<div class="product-info container">
            <h2>${data.title}</h2>
            <p>Owner: ${data.owner}</p>
            <img src="${data.thumbnail[0]}" alt="img"  width="200" height="150">
            <div class="container">
            <button id="deleteProductButton" class="btn btn-dark deleteProduct" value=${data._id}>Delete Product</button>
            </div>
          </div>`;
    return respon;
  });
  productos.innerHTML = html.join("");
}

document.addEventListener("click", (e) => {
  const actionBtn = e.target;
  if (actionBtn.className.includes("deleteProduct")) {
    fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: actionBtn.value }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
    setTimeout(function () {
      location.reload();
    }, 1000);
  }
});
