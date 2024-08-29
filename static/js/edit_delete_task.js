const mainMenu = document.querySelector('.main-menu');
const taskTab = document.querySelector('.task-tab');
const editTaskTab = document.querySelector('.edit-task-tab')

const taskInfo = document.querySelector('.task-info');
const deleteButton = document.getElementById('delete-task');
const editButton = document.getElementById('edit-task-button');
const taskUid = taskInfo.getAttribute('id');

const removeFileButtons = document.querySelectorAll('.remove-file-button');

const saveChangesButton = document.getElementById('edit-save-changes');
const cancelChangesButton = document.getElementById('edit-cancel-changes');


const editSubjectField = document.getElementById('edit-form-subject');
const editDescriptionField = document.getElementById('edit-form-description');
const editDeadlineField = document.getElementById('edit-form-deadline');
const editUserLimitField = document.getElementById('user-limit');

const currentSubject = editSubjectField.value;
const currentDescription = editDescriptionField.value;
const currentDeadline = editDeadlineField.value;
const currentUserLimit = editUserLimitField.value;


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

function getRemovedFiles() {
    const currentFiles = document.querySelectorAll('.file-element.hidden');
    const currentFilesId = [];
    for (const file of currentFiles) {
        currentFilesId.push(file.getAttribute('id').replaceAll('file-', ''));
    }
    return currentFilesId;
}

function saveChanges() {
    validateForm();
    const newSubject = document.getElementById('edit-form-subject').value;
    const newDescription = document.getElementById('edit-form-description').value;
    const newDeadline = document.getElementById('edit-form-deadline').value;
    const newUserLimit = document.getElementById('user-limit').value;

    const newFiles = Array.from(document.getElementById('edit-form-attachments').files);
    const removedFilesId = getRemovedFiles();

    const dataToEdit = {new_files: newFiles, removed_files: removedFilesId};
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
    // console.log(dataToEdit);
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
    this.parentNode.classList.add('hidden');
}

function showEditTaskTab() {
    taskTab.classList.add('hidden');
    mainMenu.classList.add('hidden');
    editTaskTab.classList.remove('hidden');
}

function cancelChanges() {
    resetForm();
    editTaskTab.classList.add('hidden');
    taskTab.classList.remove('hidden');
    mainMenu.classList.remove('hidden');
}

function resetForm() {
    editSubjectField.value = currentSubject;
    editDescriptionField.value = currentDescription;
    editDeadlineField.value = currentDeadline;
    editUserLimitField.value = currentUserLimit;
    const removedFiles = document.querySelectorAll('.file-element.hidden');
    removedFiles.forEach((file) => {
        file.classList.remove('hidden');
    })
}

function validateForm() {
    const forms = document.querySelectorAll('.needs-validation');
    console.log(forms);
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

deleteButton.addEventListener('click', deleteTask);
removeFileButtons.forEach((button) => {
    button.addEventListener('click', removeFile);
})

editButton.addEventListener('click', showEditTaskTab);
saveChangesButton.addEventListener('click', saveChanges);
cancelChangesButton.addEventListener('click', cancelChanges);
