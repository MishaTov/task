const taskInfo = document.querySelector('#task-info')

const editButton = document.querySelector('#edit-task')
const deleteButton = document.querySelector('#delete-task')
const deleteTaskButton = document.querySelector('#delete-task-button')


const taskUid = taskInfo.getAttribute('task_uid')

const removeFileButtons = document.querySelectorAll('.remove-file')

function deleteTask() {
    const descriptionUrl = taskInfo.getAttribute('description_url')
    const assignmentUrl = taskInfo.getAttribute('assignment_url')
    fetch(descriptionUrl, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: 'task',
            task_uid: taskUid
        })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('task del msg', data.message)
            window.location.href = assignmentUrl
            fetch(assignmentUrl).catch(error => console.log(error))
        })
        .catch(error => console.log(error))

}


function removeFile(){
    this.parentNode.remove()
}


function hideEditButtons() {
    editButton.classList.remove('visually-hidden')
    deleteTaskButton.classList.remove('visually-hidden')
}

deleteButton.addEventListener('click', deleteTask)

removeFileButtons.forEach((button) => {
    button.addEventListener('click', removeFile)
})