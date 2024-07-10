window.addEventListener('load', () => {
    const delMessage = localStorage.getItem('task del msg')
    if (delMessage){
        showTaskDelMessage(delMessage)
    }
    localStorage.removeItem('task del msg')
})

function showTaskDelMessage(delMessage){
    const pageDiv = document.querySelector('#page-div')

    const parentDiv = document.createElement('div')
    parentDiv.classList.add('toast')
    parentDiv.classList.add('position-absolute')
    parentDiv.classList.add('bottom-0')
    parentDiv.classList.add('end-0')
    parentDiv.classList.add('m-3')
    parentDiv.setAttribute('role', 'alert')
    parentDiv.setAttribute('aria-live', 'assertlive')
    parentDiv.setAttribute('aria-atomic', 'true')

    const childDivHeader = document.createElement('div')
    childDivHeader.classList.add('toast-header')

    const img = document.createElement('img')
    img.src = 'static/img/del_task_label.png'
    img.style.borderRadius = '25%'
    img.style.height = '20px'
    img.style.width = '20px'
    img.style.marginRight = '5px'
    img.alt = ''

    const strong = document.createElement('strong')
    strong.classList.add('me-auto')
    strong.innerHTML = 'Task deleted'

    const small = document.createElement('small')
    small.innerText = 'just now'

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.classList.add('btn-close')
    closeButton.setAttribute('data-bs-dismiss', 'toast')
    closeButton.setAttribute('aria-label', 'Close')

    const childDivBody = document.createElement('div')
    childDivBody.classList.add('toast-body')
    childDivBody.innerHTML = delMessage

    childDivHeader.appendChild(img)
    childDivHeader.appendChild(strong)
    childDivHeader.appendChild(small)
    childDivHeader.appendChild(closeButton)

    parentDiv.appendChild(childDivHeader)
    parentDiv.appendChild(childDivBody)

    pageDiv.append(parentDiv)

    const toast = new bootstrap.Toast(parentDiv)
    toast.show()
}