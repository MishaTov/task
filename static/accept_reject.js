const acceptButton = document.querySelector('#accept-task');
const rejectButton = document.querySelector('#reject-task');

const buttonDiv = document.querySelector('#accept-reject-button')
const url = buttonDiv.getAttribute('url')

const user = document.querySelector('#accept-reject-button').getAttribute('cur_user')
const taskUid = document.querySelector('#accept-reject-button').getAttribute('task_uid')

function accept() {
    acceptButton.classList.add('visually-hidden')
    rejectButton.classList.remove('disabled')
    rejectButton.classList.remove('visually-hidden')
}

function reject() {
    rejectButton.classList.add('visually-hidden')
    acceptButton.classList.remove('disabled')
    acceptButton.classList.remove('visually-hidden')
}

function showInfo(success, message){
    const color = success ? 'green' : 'red'
    const infoMessage = document.createElement('span')
    infoMessage.setAttribute('id', 'info_message')
    infoMessage.innerHTML = message
    infoMessage.style.color = color
    infoMessage.style.fontSize = '14px'
    infoMessage.style.alignSelf = 'center'
    infoMessage.style.marginLeft = '10px'
    const showedMessage = document.querySelector('#info_message')
    if (showedMessage){
        showedMessage.replaceWith(infoMessage)
    }
    buttonDiv.append(infoMessage)
}

function action(button){
    button.classList.add('disabled')
    const requestMethod = button === acceptButton ? 'POST' : 'DELETE'
    fetch(url,{
        method: requestMethod,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username: user, task_uid: taskUid})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                if (button === acceptButton){
                    accept()

                }
                else{
                    reject()
                }
            }
            else{
                button.classList.remove('disabled')
            }
            showInfo(data.success, data.message)
        })
        .then(error => console.log(error))
}

acceptButton.addEventListener('click', () => action(acceptButton))
rejectButton.addEventListener('click', () => action(rejectButton))