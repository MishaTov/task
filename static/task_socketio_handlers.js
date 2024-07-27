const taskLabel = document.getElementById('task-label')
const colorLabel = document.getElementById('color-label')
const taskUsers = document.getElementById('assigned-users')

const taskSubject = document.getElementById('task-subject')
const taskDescription = document.getElementById('task-description')
const taskDeadline = document.getElementById('task-deadline')
const taskUserLimit = document.getElementById('task-user-limit')
const taskAttachments = document.getElementById('task-attachments')

const uidTask = document.getElementById('task-info').getAttribute('task_uid')


let socketio = io()

function checkUid(uid) {
    const taskUid = document.getElementById('task-info').getAttribute('task_uid')
    return taskUid === uid
}


function buildLink(username) {
    return `<a class="link-underline link-underline-opacity-0" href="/profile/${username}">${username}</a>`
}


socketio.on(`change task label ${uidTask}`, (data) => {
    taskLabel.innerHTML = data.label
    colorLabel.style.color = data.color
})

socketio.on(`update users list ${uidTask}`, (data) => {
    if (data.users.length) {
        taskUsers.innerHTML = 'Assigned to: &nbsp' + data.users.map(x => buildLink(x)).join(', &nbsp')
    } else {
        taskUsers.innerHTML = 'No one does this task'
    }
})

socketio.on(`edit task page ${uidTask}`, (data) => {
    taskSubject.innerHTML = data.subject
    taskDescription.innerHTML = data.description
    taskDeadline.innerHTML = data.deadline
    taskUserLimit.innerHTML = data.user_limit
    taskAttachments.innerHTML = data.files
})