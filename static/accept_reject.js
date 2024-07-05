const acceptButton = document.querySelector('#accept-task');
const rejectButton = document.querySelector('#reject-task');
const buttonDiv = document.querySelector('#accept-reject-button')
const url = buttonDiv.getAttribute('url')
const user = document.querySelector('#accept-reject-button').getAttribute('cur_user')
const taskUid = document.querySelector('#accept-reject-button').getAttribute('task_uid')
const users = document.querySelector('#assigned-users')


function buildLink(username) {
    return `<a href="/profile/${username}">${username}</a>`
}

function accept() {
    acceptButton.classList.add('visually-hidden')
    rejectButton.classList.remove('disabled')
    rejectButton.classList.remove('visually-hidden')
    // x => x.textContent
    let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    usernames.push(buildLink(user))
    usernames = usernames.join(', &nbsp').trim()
    // if (usernames) {
    //     users.innerHTML = 'Assigned to: &nbsp' + usernames
    // } else {
    //     users.innerHTML = 'Assigned to: &nbsp' + buildLink(user)
    // }
    users.innerHTML = 'Assigned to: &nbsp' + usernames

    // userLinks.forEach(link => {
    //     if (link.textContent === user) {
    //         link.remove()
    //     }
    // })
    // if (userList) {
    //     // users.innerHTML = users.innerHTML + `, &nbsp <a href="/profile/${user}">${user}</a>`
    //     users.innerHTML = userList
    // }
    // else{
    //     users.innerHTML = `Assigned to: &nbsp<a href="/profile/${user}">${user}</a>`
    // }
    // users.innerHTML = userLinks
}

function reject() {
    rejectButton.classList.add('visually-hidden')
    acceptButton.classList.remove('disabled')
    acceptButton.classList.remove('visually-hidden')
    let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    usernames = usernames.splice(usernames.indexOf(user), 1).join(', &nbsp').trim()
    if (usernames.trim()) {
        users.innerHTML = 'Assigned to: &nbsp' + usernames
    } else {
        users.innerHTML = 'No one does this task'
    }
}

function showInfo(success, message) {
    const color = success ? 'green' : 'red'
    const msg = document.querySelector('#info-message')
    if (msg) {
        msg.innerHTML = message
        msg.style.color = color
        return
    }
    const infoMessage = document.createElement('span')
    infoMessage.setAttribute('id', 'info-message')
    infoMessage.innerHTML = message
    infoMessage.style.color = color
    infoMessage.style.fontSize = '14px'
    infoMessage.style.alignSelf = 'center'
    infoMessage.style.marginLeft = '10px'
    buttonDiv.append(infoMessage)
}

function action(button) {
    button.classList.add('disabled')
    const requestMethod = button === acceptButton ? 'POST' : 'DELETE'
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
                    accept()

                } else {
                    reject()
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