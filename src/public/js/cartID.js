const url = window.location.href; // obtener la URL actual
const parts = url.split('/'); // separar la URL por "/"
const id = parts[parts.length - 1]; // obtener la última parte de la URL, que es el ID del producto

window.onload = function() {
  fetch(`http://localhost:8081/api/carts/${id}`)
    .then(response => response.json())
    .then(data => procesarDatos(data.payload))
    .catch(error => console.error(error));
};

const cart = document.getElementById("cart");
const cartel = document.getElementById("cartel");

function procesarDatos(data) {
  let html = data.products.map( (data) => {
    let respon =  
    `<div class="product-info container">
      <h2>${data.product.title}</h2>
      <p>price: ${data.product.price}</p>
      <p>id: ${data.product._id}</p>
      <p>quantity: ${data.quantity}</p>
    </div>`;
    return respon;

  })
  cart.innerHTML = html.join('');   
  cartel.innerHTML = `<div class="container">
  <button class="btn btn-dark"><a class="text-decoration-none text-light" href='/products'>Go to Products</a></button>
  <button class="btn btn-dark"><a class="text-decoration-none text-light" href='/carts'>Go to Carts</a></button>
  </div>`;
}

