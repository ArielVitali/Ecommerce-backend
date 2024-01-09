let userId;
let cartId;
let quantityActual;
let totalUnitario;
let totalAcumulado = [];
const profile = document.getElementById("profile");
const mensaje = document.getElementById("mensaje");
const cart = document.getElementById("cart");
const cartel = document.getElementById("cartel2");
const mensaje2 = document.getElementById("mensaje2");
const form = document.getElementById("form");
const logoutLink = document.getElementById("logoutLink");

window.onload = async function () {
  await fetch(`/api/sessions/current`)
    .then((response) => response.json())
    .then((data) => procesarDatos(data.payload))
    .catch((error) => console.error(error));
  let resultFinal;
  async function hacerSolicitud() {
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });
      const result = await response.json();
      resultFinal = result.payload.response;
      cartId = result.payload.cart;
      if (resultFinal) {
        mensaje.innerHTML = `<h4>Carrito creado</h4>`;
      } else if (resultFinal == 0) {
        mensaje.innerHTML = `<h4>Carrito ya existente</h4>`;
        await fetch(`/api/carts/${cartId}`)
          .then((response) => response.json())
          .then((data) => procesarDatos2(data.payload))
          .catch((error) => console.error(error));
      }
    } catch (err) {
      console.log(err);
    }
  }
  hacerSolicitud();
};

function procesarDatos(data) {
  userId = data._id;
}

function procesarDatos2(data) {
  let html = data.products.map((data) => {
    totalUnitario = parseInt(data.quantity) * parseInt(data.product.price);
    totalAcumulado.push(parseInt(totalUnitario));
    let respon = `<div>
      <h2>${data.product.title}</h2>
      <p>stock: ${data.product.stock}</p>
      <p>Precio: ${data.product.price}</p>
      <p id="q${data.product._id}">Cantidad: ${data.quantity}</p>
      </div>
      <div>
        <label for="">
            Actualizar cantidad
            <input id="${data.product._id}" type="text" name="quantity">
            <button class="btn btn-dark my-2 updateCart" value=${data.product._id}>Actualizar</button>
            <button class="btn btn-dark my-2 deleteItemCart" value=${data.product._id}>Borrar</button>
            </label>
      </div>`;
    return respon;
  });
  let suma = totalAcumulado.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );
  cart.innerHTML = html.join("");
  cartel.innerHTML = `<button class="btn btn-dark my-2 buyCart">Comprar = ${suma}</button>
  <button class="btn btn-dark my-2 deleteCart" id="deleteCartID">Borrar Carrito</button>
  <button class="btn btn-dark my-2"><a class="text-decoration-none text-light" href='/products'>Go to Products</a></button>`;
}

function procesarDatos3(data) {
  console.log(data);
}

document.addEventListener("click", (e) => {
  const actionBtn = e.target;
  if (actionBtn.className.includes("updateCart")) {
    let inputElement = document.getElementById(`${actionBtn.value}`);
    quantityActual = document.getElementById(`q${actionBtn.value}`);
    let value = inputElement.value;

    if (value != 0 && value != quantityActual) {
      fetch(`/api/carts/${cartId}/products/${actionBtn.value}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: value }),
      })
        .then((response) => response.json())
        .catch((err) => console.log(err));
      setTimeout(function () {
        location.reload();
      }, 1000);
    }
  }

  if (actionBtn.className.includes("deleteCart")) {
    fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        procesarDatos3(data.payload);
        setTimeout(() => {
          logoutLink.click();
        }, 1000);
      })
      .catch((err) => console.log(err));
  }

  if (actionBtn.className.includes("deleteItemCart")) {
    fetch(`/api/carts/${cartId}/products/${actionBtn.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
    setTimeout(function () {
      location.reload();
    }, 1000);
  }

  if (actionBtn.className.includes("buyCart")) {
    fetch(`/api/carts/${cartId}/purchase`)
      .then((response) => response.json())
      .then((data) => {
        procesarDatos3(data.payload);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se creo una orden con exito",
        });
      })
      .catch((error) => console.error(error));
    let deleteCart = document.getElementById(`deleteCartID`);
    setTimeout(() => {
      deleteCart.click();
    }, 1000);
  }
});
