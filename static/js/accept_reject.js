import { socketio } from "./socket.js";

const acceptButton = document.getElementById('accept-task');
const rejectButton = document.getElementById('reject-task');
const buttonDiv = document.getElementById('accept-reject-button');
const user = buttonDiv.getAttribute('cur_user');

function accept() {
    acceptButton.classList.add('visually-hidden');
    rejectButton.classList.remove('disabled');
    rejectButton.classList.remove('visually-hidden');
}

function reject() {
    rejectButton.classList.add('visually-hidden');
    acceptButton.classList.remove('disabled');
    acceptButton.classList.remove('visually-hidden');
}

function showInfo(success, message, action) {
    const toastContainer = document.getElementById('toast-messages-container');
    let color, headerText;
    if (success) {
        color = action === 'Accept' ? '#9eff00' : '#ff006d';
        headerText = action === 'Accept' ? 'Task accepted' : 'Task rejected';
    } else {
        color = 'red';
        headerText = 'Something went wrong';
    }
    const toastEl = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div class="toast-header">
                                    <div style="width: 20px; height: 20px; margin-right: 5px; background-color: ${color}; border-radius: 25%"></div>
                                    <strong class="me-auto">${headerText}</strong>
                                    <small>just now</small>
                                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div class="toast-body">${message}</div>
                            </div>`;
    const temp = document.createElement('div');
    temp.innerHTML = toastEl.trim();
    const newToast = temp.firstChild;
    const toast = new bootstrap.Toast(newToast);
    toastContainer.appendChild(newToast);
    toast.show();
}

function action(button) {
    button.classList.add('disabled');
    const requestMethod = button === acceptButton ? 'POST' : 'DELETE';
    const url = buttonDiv.getAttribute('url');
    const taskUid = document.querySelector('.task-info').getAttribute('id');
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
                    acceptButton.classList.add('disabled');
                    setTimeout(accept, 1000);
                } else {
                    rejectButton.classList.add('disabled');
                    setTimeout(reject, 1000);
                }
                socketio.emit('accept reject event', taskUid);
            } else {
                button.classList.remove('disabled');
            }
            showInfo(data.success, data.message, data.action);
        })
        .catch(error => console.log(error));
}

acceptButton.addEventListener('click', () => action(acceptButton));
rejectButton.addEventListener('click', () => action(rejectButton));