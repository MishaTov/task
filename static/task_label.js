function checkLabel(){
    const label = document.querySelector('#task-label')
    const color = document.querySelector('#color-label')
    const time = document.querySelector('#time-left')
    const url = document.querySelector('#time-label').getAttribute('url')
    const taskUid = document.querySelector('#accept-reject-button').getAttribute('task_uid')
    const users = document.querySelector('#assigned-users')
    const acceptButton = document.querySelector('#accept-task')
    const rejectButton = document.querySelector('#reject-task')
    fetch(url)
        .then(response => response.json())
        .then(data => {

        })
        .then(error => console.log(error))
}