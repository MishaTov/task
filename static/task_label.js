function buildLink(username) {
    return `<a class="link-underline link-underline-opacity-0" href="/profile/${username}">${username}</a>`
}

function checkLabel(){
    const label = document.querySelector('#task-label')
    const color = document.querySelector('#color-label')
    //const time = document.querySelector('#time-left')
    const url = document.querySelector('#time-label').getAttribute('url')
    //const taskUid = document.querySelector('#accept-reject-button').getAttribute('task_uid')
    const users = document.querySelector('#assigned-users')
    //const acceptButton = document.querySelector('#accept-task')
    //const rejectButton = document.querySelector('#reject-task')
    let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (label.textContent !== data.label) {
                label.textContent = data.label
                color.listStyle.color = data.color
            }
            if (usernames && !data.users) {
                users.innerHTML = 'No one does this task'
                color.listStyle.color = data.color
            }else if ((!usernames && data.users) || (usernames.sort() !== data.users.sort())){
                users.innerHTML = data.users.map(x => buildLink(x))
                color.listStyle.color = data.color
            }
        })
        .then(error => console.log(error))
}
setInterval(checkLabel, 1000)