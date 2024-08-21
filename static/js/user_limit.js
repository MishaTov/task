const value = document.querySelector("#user-count");
const input = document.querySelector("#user-limit");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});
