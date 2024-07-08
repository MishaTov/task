const acceptButton = document.querySelector('#accept-task');
const rejectButton = document.querySelector('#reject-task');
const buttonDiv = document.querySelector('#accept-reject-button')
const user = buttonDiv.getAttribute('cur_user')
const users = document.querySelector('#assigned-users')
let hideTimeout

function buildLink(username) {
    return `<a class="link-underline link-underline-opacity-0" href="/profile/${username}">${username}</a>`
}

function accept() {
    acceptButton.classList.add('visually-hidden')
    rejectButton.classList.remove('disabled')
    rejectButton.classList.remove('visually-hidden')
    // let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    // if (usernames) {
    //     usernames.push(buildLink(user))
    //     users.innerHTML = 'Assigned to: &nbsp' + usernames.join(', &nbsp')
    // } else {
    //     users.innerHTML = 'Assigned to: &nbsp' + buildLink(user)
    // }
}

function reject() {
    rejectButton.classList.add('visually-hidden')
    acceptButton.classList.remove('disabled')
    acceptButton.classList.remove('visually-hidden')
    // let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    // usernames.splice(usernames.indexOf(user), 1)
    // usernames = usernames.join(', &nbsp').trim()
    // if (usernames) {
    //     users.innerHTML = 'Assigned to: &nbsp' + usernames
    // } else {
    //     users.innerHTML = 'No one does this task'
    // }
}

function showInfo(success, message) {
    clearTimeout(hideTimeout)
    const color = success ? 'green' : 'red'
    const msg = document.querySelector('#info-message')
    if (msg) {
        msg.innerHTML = message
        msg.style.color = color
        msg.classList.remove('visually-hidden')
    } else {
        const infoMessage = document.createElement('span')
        infoMessage.setAttribute('id', 'info-message')
        infoMessage.innerHTML = message
        infoMessage.style.color = color
        infoMessage.style.fontSize = '14px'
        infoMessage.style.alignSelf = 'center'
        infoMessage.style.marginLeft = '10px'
        buttonDiv.append(infoMessage)
    }
    hideTimeout = setTimeout(() => {
        const msg = document.querySelector('#info-message')
        msg.classList.add('visually-hidden')
    }, 3000)
}

function action(button) {
    button.classList.add('disabled')
    const requestMethod = button === acceptButton ? 'POST' : 'DELETE'
    const url = buttonDiv.getAttribute('url')
    const taskUid = buttonDiv.getAttribute('task_uid')
    fetch(url, {
        method: requestMethod,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username: user, task_uid: taskUid})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (button === acceptButton) {
                    acceptButton.classList.add('disabled')
                    setTimeout(accept, 1000)
                } else {
                    rejectButton.classList.add('disabled')
                    setTimeout(reject, 1000)
                }
            } else {
                button.classList.remove('disabled')
            }
            showInfo(data.success, data.message)
        })
        .then(error => console.log(error))
}

acceptButton.addEventListener('click', () => action(acceptButton))
rejectButton.addEventListener('click', () => action(rejectButton))