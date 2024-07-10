const editButton = document.querySelector('#edit-task')
const deletebutton = document.querySelector('#delete-task')
const editForm = document.querySelector('#edit-task-form')


function resizeField() {
    this.style.width = this.value.length + 'ch'
}


function editSubject() {
    const subject = editForm.querySelector('#task-subject')
    const editSubject = editForm.querySelector('#edit-task-subject')
    const formSubject = editForm.querySelector('#form-subject')
    subject.classList.add('visually-hidden')
    editSubject.classList.remove('visually-hidden')
    formSubject.addEventListener('input', resizeField)
    resizeField.call(formSubject)
}

function editTask() {
    editSubject()
}


function deleteTask() {
    const taskInfo = document.querySelector('#task-info')
    const descriptionUrl = taskInfo.getAttribute('description_url')
    const assignmentUrl = taskInfo.getAttribute('assignment_url')
    const taskUid = taskInfo.getAttribute('task_uid')
    fetch(descriptionUrl, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({task_uid: taskUid})
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('task del msg', data.message)
            window.location.href = assignmentUrl
            fetch(assignmentUrl).catch(error => console.log(error))
        })
        .catch(error => console.log(error))

}

editButton.addEventListener('click', editTask)
deletebutton.addEventListener('click', deleteTask)