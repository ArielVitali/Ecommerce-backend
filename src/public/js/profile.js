window.onload = function() {
  fetch(`http://localhost:8081/api/sessions/current`)
    .then(response => response.json())
    .then(data => procesarDatos(data.payload))
    .catch(error => console.error(error));
};

const profile = document.getElementById("profile");
const cartel = document.getElementById("cartel");

function procesarDatos(data) {
    profile.innerHTML =   
    `<h2>Profile</h2>
    <p>Name: ${data.first_name} ${data.last_name}</p>
    <p>Age: ${data.age}</p>
    <p>Email: ${data.email}</p>
    <p>Role: ${data.role}</p>`;
 
}