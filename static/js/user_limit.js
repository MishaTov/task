const value = document.getElementById("user-count");
const input = document.getElementById("user-limit");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});
