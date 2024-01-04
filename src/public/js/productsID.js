const url = window.location.href; // obtener la URL actual
const parts = url.split('/'); // separar la URL por "/"
const id = parts[parts.length - 1]; // obtener la última parte de la URL, que es el ID del producto

window.onload = function() {
  fetch(`http://localhost:8081/api/products/${id}`)
    .then(response => response.json())
    .then(data => procesarDatos(data.payload))
    .catch(error => console.error(error));
};

const products = document.getElementById("products");
const cartel = document.getElementById("cartel");

function procesarDatos(data) {
  products.innerHTML =   
  `<div class="product-info container">
    <h2>${data.title}</h2>
    <img src="${data.thumbnail[0]}" alt="img"  width="400" height="350">
    <p>description: ${data.description}</p>
    <p>category: ${data.category}</p>
    <p>code: ${data.code}</p>
    <p>status: ${data.status}</p>
    <p>stock: ${data.stock}</p>
    <p>_id: ${data._id}</p>
    <p>price: ${data.price}</p>
    <div class="container">
          <button class="btn btn-dark"><a class="text-decoration-none text-light" href='/products'>Go to Product</a></button>
          <button class="btn btn-dark">Add to card</button>
          </div>
  </div>`;
 
}