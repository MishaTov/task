const taskInfo = document.querySelector('#task-info')

const editButton = document.querySelector('#edit-task')
const deleteButton = document.querySelector('#delete-task')
const deleteTaskButton = document.querySelector('#delete-task-button')
const saveChangesButton = document.querySelector('#save-changes')
const cancelChangesButton = document.querySelector('#cancel-changes')
const editForm = document.querySelector('#edit-task-form')
const acceptRejectEl = document.querySelector('#accept-reject-button')


const taskUid = taskInfo.getAttribute('task_uid')
const subject = editForm.querySelector('#task-subject')
const formSubject = editForm.querySelector('#form-subject')
const description = editForm.querySelector('#task-description')
const currentDescription = description.textContent
const deadline = editForm.querySelector('#task-deadline')
const formDeadline = editForm.querySelector('#form-deadline')
//const attachments = editForm.querySelector('#task-attachments')
const formAttachments = editForm.querySelector('#form-attachments')
const userLimitEl = editForm.querySelector('#task-user-limit')
const userLimit = userLimitEl.getAttribute('user_limit')
const formUserLimit = editForm.querySelector('#user-limit')


// function resizeField() {
//     this.style.width = `${this.textContent.length}`
//     this.style.width = this.scrollWidth + 'px'
// }
//
// function editSubject() {
//     formSubject.style.border = 'none'
//     formSubject.style.borderBottom = '2px solid blue'
//     formSubject.style.outline = 'none'
//     formSubject.style.width = formSubject.scrollWidth + 'px'
//     formSubject.style.padding = '0px'
//     formSubject.addEventListener('input', resizeField)
//     subject.classList.add('visually-hidden')
//     formSubject.classList.remove('visually-hidden')
// }
//
// function editDescription() {
//     description.setAttribute('contenteditable', 'true')
//     description.style.border = 'none'
//     description.style.borderBottom = '2px solid blue'
//     description.style.outline = 'none'
//     description.style.padding = '0px'
//     return description.textContent
// }
//
// function editDeadline() {
//     deadline.classList.add('visually-hidden')
//     formDeadline.classList.remove('visually-hidden')
// }
//
// function editAttachments() {
//     formAttachments.classList.remove('visually-hidden')
// }
//
// function editUserLimit(){
//     userLimitEl.classList.remove('visually-hidden')
//     const input = document.querySelector("#user-limit")
//     const value = document.querySelector("#user-count")
//     value.textContent = input.value
//     input.addEventListener("input", (event) => {
//         value.textContent = event.target.value
//     })
// }
//
// function cancelEditSubject() {
//     formSubject.classList.add('visually-hidden')
//     subject.classList.remove('visually-hidden')
// }
//
// function cancelEditDeadline() {
//     formDeadline.classList.add('visually-hidden')
//     deadline.classList.remove('visually-hidden')
// }
//
// function cancelEditDescription() {
//     description.removeAttribute('contenteditable')
//     description.attributeStyleMap.clear()
// }
//
// function cancelEditAttachments() {
//     formAttachments.classList.add('visually-hidden')
// }
//
// function cancelEditUserLimit(){
//     userLimitEl.classList.add('visually-hidden')
// }
//
// function editTask() {
//     acceptRejectEl.classList.add('visually-hidden')
//     showEditButtons()
//     editSubject()
//     editDescription()
//     editDeadline()
//     editAttachments()
//     editUserLimit()
// }

function deleteTask() {
    const descriptionUrl = taskInfo.getAttribute('description_url')
    const assignmentUrl = taskInfo.getAttribute('assignment_url')
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

// function saveChanges() {
//     const data = new FormData()
//     if (subject.textContent !== formSubject.value) {
//         subject.textContent = formSubject.value
//         data.append('subject', subject.textContent)
//     }
//     if (new Date(deadline.textContent).getTime() !== new Date(formDeadline.value).getTime()) {
//         deadline.textContent = formDeadline.value
//         data.append('deadline', deadline.textContent)
//     }
//     if (currentDescription !== description.textContent) {
//         data.append('description', description.textContent)
//     }
//     if (formAttachments.files.length !== 0) {
//         for (let i = 0; i < formAttachments.files.length; i++) {
//             data.append('files', formAttachments.files[i])
//         }
//     }
//     if (userLimit !== formUserLimit.value) {
//         data.append('user_limit', formUserLimit.value)
//     }
//     else{
//         data.append('user_limit', null)
//     }
//     console.log(taskUid)
//     // console.log(JSON.stringify(data))
//     fetch(taskInfo.getAttribute('description_url'), {
//         method: 'PATCH',
//         headers: {
//             'task_uid': taskUid
//         },
//         body: data
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 successEditingMessage()
//             }
//         })
//         .catch(error => console.log(error))
//     cancelChanges()
//     hideEditButtons()
//     acceptRejectEl.classList.remove('visually-hidden')
// }

// function cancelChanges() {
//     cancelEditSubject()
//     cancelEditDeadline()
//     cancelEditDescription()
//     cancelEditAttachments()
//     cancelEditUserLimit()
//     hideEditButtons()
//     acceptRejectEl.classList.remove('visually-hidden')
// }

// function showEditButtons() {
//     editButton.classList.add('visually-hidden')
//     deleteTaskButton.classList.add('visually-hidden')
//     saveChangesButton.classList.remove('visually-hidden')
//     cancelChangesButton.classList.remove('visually-hidden')
// }

function hideEditButtons() {
    saveChangesButton.classList.add('visually-hidden')
    cancelChangesButton.classList.add('visually-hidden')
    editButton.classList.remove('visually-hidden')
    deleteTaskButton.classList.remove('visually-hidden')
}

// function successEditingMessage() {
//
// }

// editButton.addEventListener('click', editTask)
deleteButton.onclick = deleteTask
// saveChangesButton.addEventListener('click', saveChanges)
// cancelChangesButton.addEventListener('click', cancelChanges)