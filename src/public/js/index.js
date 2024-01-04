
window.onload = function() {
  fetch('http://localhost:8081/api/realTimeProducts')
    .then(response => response.json())
    .then(data => procesarDatos(data.payload))
    .catch(error => console.error(error));
};

const productos = document.getElementById("notliveProducts");

function procesarDatos(data) {
  let html = data.docs.map( (data) => {
      let respon =  
      `<div class="product-info">
      <h2>${data.title}</h2>
      <img src="${data.thumbnail[0]}" alt="img"  width="200" height="150">
      <p>description: ${data.description}</p>
      <p>price: ${data.price}</p>
      <p>code: ${data.code}</p>
      <p>stock: ${data.stock}</p>
      <p>status: ${data.status}</p>
      <p>category: ${data.category}</p>
      <p>id: ${data._id}</p>
    </div>`;
      return respon;
  
    })
    productos.innerHTML = html.join('');    
}



const socket = io();

const liveProducts = document.getElementById("liveProducts");

socket.on('statusProductsList', (data) => {
  document.getElementById("notliveProducts").innerHTML = "";
  let html = data.docs.map( (data) => {
    let respon =  
    `<div class="product-info">
      <h2>${data.title}</h2>
      <img src="${data.thumbnail[0]}" alt="img"  width="200" height="150">
      <p>description: ${data.description}</p>
      <p>price: ${data.price}</p>
      <p>code: ${data.code}</p>
      <p>stock: ${data.stock}</p>
      <p>status: ${data.status}</p>
      <p>category: ${data.category}</p>
      <p>id: ${data._id}</p>
    </div>`;
    return respon;

  })
  liveProducts.innerHTML = html.join(''); 
});

socket.on('error', (error) => {
  console.error(error);
});