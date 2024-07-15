const editButton = document.querySelector('#edit-task')
const deleteButton = document.querySelector('#delete-task')
const saveChangesButton = document.querySelector('#save-changes')
const cancelChangesButton = document.querySelector('#cancel-changes')
const editForm = document.querySelector('#edit-task-form')
const acceptRejectEl = document.querySelector('#accept-reject-button')


function resizeField() {
    this.style.width = `${this.textContent.length}`
    this.style.width = this.scrollWidth + 'px'
}

function editSubject() {
    const subject = editForm.querySelector('#task-subject')
    const formSubject = editForm.querySelector('#form-subject')
    formSubject.style.border = 'none'
    formSubject.style.borderBottom = '2px solid blue'
    formSubject.style.outline = 'none'
    formSubject.style.width = formSubject.scrollWidth +'px'
    formSubject.style.padding = '0px'
    formSubject.addEventListener('input', resizeField)
    subject.classList.add('visually-hidden')
    formSubject.classList.remove('visually-hidden')
    return [subject, formSubject]
}

function cancelSubject(subject, formSubject){
    formSubject.classList.add('visually-hidden')
    subject.classList.remove('visually-hidden')
}

function editDescription(){
    const description = editForm.querySelector('#task-description')
    description.setAttribute('contenteditable', 'true')
    description.style.border = 'none'
    description.style.borderBottom = '2px solid blue'
    description.style.outline = 'none'
    description.style.padding = '0px'
    return description
}

function cancelDescription(description){
    description.removeAttribute('contenteditable')
}

function editDeadline(){
    const deadline = editForm.querySelector('#task-deadline')
    const formDeadline = editForm.querySelector('#form-deadline')
    deadline.classList.add('visually-hidden')
    formDeadline.classList.remove('visually-hidden')
    return [deadline, formDeadline]
}

function cancelDeadline(deadline, formDeadline){
    formDeadline.classList.add('visually-hidden')
    deadline.classList.remove('visually-hidden')
}

function editAttachments(){
    const formFiles = editForm.querySelector('#form-files')
    formFiles.classList.remove('visually-hidden')
    return formFiles
}

function cancelAttachments(formAttachments){
    formAttachments.classList.add('visually-hidden')
}

function editTask() {
    acceptRejectEl.classList.add('visually-hidden')
    editSubject()
    editDescription()
    editDeadline()
    editAttachments()
    showEditButtons()
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

function saveChanges(){
    cancelChanges()
}

function cancelChanges(){
    cancelSubject(editSubject()[0], editSubject()[1])
    cancelDescription(editDescription())
    cancelDeadline(editDeadline()[0], editDeadline()[1])
    cancelAttachments(editAttachments())
    hideEditButtons()
}

function showEditButtons(){
    editButton.classList.add('visually-hidden')
    deleteButton.classList.add('visually-hidden')
    saveChangesButton.classList.remove('visually-hidden')
    cancelChangesButton.classList.remove('visually-hidden')
}

function hideEditButtons(){
    saveChangesButton.classList.add('visually-hidden')
    cancelChangesButton.classList.add('visually-hidden')
    editButton.classList.remove('visually-hidden')
    deleteButton.classList.remove('visually-hidden')
}

editButton.addEventListener('click', editTask)
deleteButton.addEventListener('click', deleteTask)
saveChangesButton.addEventListener('click', saveChanges)
cancelChangesButton.addEventListener('click', cancelChanges)