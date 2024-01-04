window.onload = function() {
    fetch('http://localhost:8081/api/carts')
      .then(response => response.json())
      .then(data => procesarDatos(data.payload))
      .catch(error => console.error(error));
  };

const carts = document.getElementById("carts");

function procesarDatos(data) {
    let html = data.map( (data) => {
        let respon =  
        `<div class="product-info container">
          <h3>Carito con Id ${data._id}</h3>
          <div class="container">
          <button class="btn btn-dark"><a class="text-decoration-none text-light" href='/cart/${data._id}'>Product details</a></button>
          </div>
        </div>`;
        return respon;
    
      })
      carts.innerHTML = html.join('');    
}

