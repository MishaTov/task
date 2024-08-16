let startPage
let historyLength

function checkForm() {
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
}

function dynamicUserLimit(){
    const value = document.querySelector("#workers_count")
    const input = document.querySelector("#workers")
    value.textContent = input.value
    input.addEventListener("input", (event) => {
      value.textContent = event.target.value
    })
}



window.onload = function() {
    window.history.replaceState(null, null, window.location.href)
    console.log(document.referrer)
    console.log(window.location.href)
    if (!window.localStorage.getItem('history length')){
        window.localStorage.setItem('history length', '0')
    }
    if (document.referrer === window.location.href){
        historyLength = Number(window.localStorage.getItem('history length'))
        historyLength += 1
        window.localStorage.setItem('history length', String(historyLength))
        console.log(historyLength)
    }
}

window.onpopstate = () => {
    console.log(historyLength)
    window.history.go(-historyLength)
    window.localStorage.removeItem('history length')
}


checkForm()
dynamicUserLimit()
