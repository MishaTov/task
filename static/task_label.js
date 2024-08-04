function buildLink(username) {
    return `<a class="link-underline link-underline-opacity-0" href="/profile/${username}">${username}</a>`
}

function updateLabel(data){
    const label = document.querySelector('#task-label')
    const color = document.querySelector('#color-label')
    const users = document.querySelector('#assigned-users')
    let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    if (label.textContent !== data.label) {
        label.textContent = data.label
        color.style.color = data.color
    }
    if (usernames.length && !data.users.length) {
        users.innerHTML = 'No one does this task'
    } else if ((!usernames.length && data.users.length) || (!usernames.every(username => data.users.includes(username)) && data.users)) {
        users.innerHTML = 'Assigned to: &nbsp' + data.users.map(x => buildLink(x)).join(', &nbsp')
    }
}

const taskUid = document.querySelector('#task-info').getAttribute('task_uid')
const socket = io()
socket.emit('get_label', taskUid)
socket.on('label', updateLabel)
