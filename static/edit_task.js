const editButton = document.querySelector('#edit-task')
const editForm = document.querySelector('#edit-task-form')


function resizeField(){
        this.style.width = this.value.length + 'ch'
    }


function editSubject(){
    const subject = editForm.querySelector('#task-subject')
    const editSubject = editForm.querySelector('#edit-task-subject')
    const formSubject = editForm.querySelector('#form-subject')
    subject.classList.add('visually-hidden')
    editSubject.classList.remove('visually-hidden')
    formSubject.addEventListener('input', resizeField)
    resizeField.call(formSubject)
}

function editTask(){
    editSubject()
}

editButton.addEventListener('click', editTask)
