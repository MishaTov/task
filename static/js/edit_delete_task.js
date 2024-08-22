const taskInfo = document.querySelector('.task-info');
const deleteButton = document.getElementById('delete-task');
const taskUid = taskInfo.getAttribute('id');

const removeFileButtons = document.querySelectorAll('.remove-file-button');

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


function removeFile() {
    this.parentNode.remove();
}


function validateForm() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                form.classList.add('');
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    })
}

window.onload = function () {
    document.getElementById('edit-task-form').reset();
};

validateForm();
deleteButton.addEventListener('click', deleteTask);
removeFileButtons.forEach((button) => {
    button.addEventListener('click', removeFile);
})
