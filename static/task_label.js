function buildLink(username) {
    return `<a class="link-underline link-underline-opacity-0" href="/profile/${username}">${username}</a>`
}

function checkLabel() {
    const label = document.querySelector('#task-label')
    const color = document.querySelector('#color-label')
    const url = document.querySelector('#time-label').getAttribute('url')
    const users = document.querySelector('#assigned-users')
    let usernames = Array.from(users.querySelectorAll('a')).map(x => buildLink(x.textContent))
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (label.textContent !== data.label) {
                label.textContent = data.label
                color.style.color = data.color
            }
            if (usernames.length && !data.users.length) {
                users.innerHTML = 'No one does this task'
                color.style.color = data.color
            } else if ((!usernames.length && data.users.length) || (!usernames.every(username => data.users.includes(username)) && data.users)) {
                users.innerHTML = 'Assigned to: &nbsp' + data.users.map(x => buildLink(x)).join(', &nbsp')
                color.style.color = data.color
            }
        })
        .catch(error => console.log(error))
}

setInterval(checkLabel, 1000)