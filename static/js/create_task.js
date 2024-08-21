function checkForm() {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
          } else {
              form.classList.add('was-validated');
              sessionStorage.removeItem('startPage');
          }
      }, false);
  });
}

if (!sessionStorage.getItem('startPage')) {
    sessionStorage.setItem('startPage', document.referrer);
}

window.onpopstate = function (event) {
    event.preventDefault();
    const startPage = sessionStorage.getItem('startPage');
    if (startPage) {
        window.location.href = startPage;
    }
};

window.onload = function () {
    window.history.replaceState(null, null, window.location.href);
}

checkForm();
