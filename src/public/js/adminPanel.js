document.addEventListener("click", (e) => {
  const actionBtn = e.target;

  if (actionBtn.className == "changeRole") {
    console.log(actionBtn.value);
    fetch("/api/users/premium", {
      method: "PUT",
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

  if (actionBtn.className == "deleteUser") {
    fetch("/api/users/deleteOne", {
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
