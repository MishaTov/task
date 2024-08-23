const taskInfo = document.querySelector('.task-info');
const deleteButton = document.getElementById('delete-task');
const taskUid = taskInfo.getAttribute('id');

const removeFileButtons = document.querySelectorAll('.remove-file-button');

const saveChanges = document.getElementById('edit-save-changes');


const currentSubject = document.getElementById('edit-form-subject').value;
const currentDescription = document.getElementById('edit-form-description').value;
const currentDeadline = document.getElementById('edit-form-deadline').value;
const currentUserLimit = document.getElementById('user-limit').value;


function deleteTask() {
    const descriptionUrl = taskInfo.getAttribute('description_url');
    const assignmentUrl = taskInfo.getAttribute('assignment_url');
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
            localStorage.setItem('task del msg', data.message);
            window.location.href = assignmentUrl;
            fetch(assignmentUrl).catch(error => console.log(error));
        })
        .catch(error => console.log(error));
}

function getCurrentFilesId() {
    const currentFiles = document.querySelectorAll('.file-element');
    const currentFilesId = [];
    for (const file of currentFiles) {
        currentFilesId.push(file.getAttribute('id').replaceAll('file-', ''));
    }
    return currentFilesId;
}

function editTask() {
    const newSubject = document.getElementById('edit-form-subject').value;
    const newDescription = document.getElementById('edit-form-description').value;
    const newDeadline = document.getElementById('edit-form-deadline').value;
    const newUserLimit = document.getElementById('user-limit').value;

    const newFiles = Array.from(document.getElementById('edit-form-attachments').files);
    const oldFilesId = getCurrentFilesId();

    const dataToEdit = {new_files: newFiles, old_files: oldFilesId}
    if (newSubject !== currentSubject) {
        dataToEdit.subject = newSubject;
    }
    if (newDescription !== currentDescription) {
        dataToEdit.description = newDescription;
    }
    if (newDeadline !== currentDeadline) {
        dataToEdit.deadline = newDeadline;
    }
    if (newUserLimit !== currentUserLimit) {
        dataToEdit.user_limit = newUserLimit;
    }

    // console.log('current subject: ', currentSubject);
    // console.log('current description: ', currentDescription);
    // console.log('current deadline: ', currentDeadline);
    // console.log('current user limit: ', currentUserLimit);
    //
    // console.log('new subject: ', newSubject);
    // console.log('new description: ', newDescription);
    // console.log('new deadline: ', newDeadline);
    // console.log('new user limit: ', newUserLimit);
}

function removeFile() {
    this.parentNode.remove();
}


function validateForm() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    })
}

validateForm()

window.onload = function () {
    document.getElementById('edit-task-form').reset();
};

deleteButton.addEventListener('click', deleteTask);
removeFileButtons.forEach((button) => {
    button.addEventListener('click', removeFile);
})

saveChanges.addEventListener('click', editTask);
