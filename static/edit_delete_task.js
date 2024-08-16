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


function removeFile() {
    this.parentNode.remove()
}


function validateForm() {
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                form.classList.add('')
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
}

window.addEventListener('pageshow', function (event) {
    let form = document.getElementById('edit-task-form');
    if (event.persisted) {
        form.reset();
        form.classList.remove('was-validated');
    }
});

window.onload = function () {
    document.getElementById('edit-task-form').reset();
};

function dynamicUserLimit() {
    const value = document.querySelector("#edit-form-user-count");
    const input = document.querySelector("#edit-form-user-limit");
    value.textContent = input.value;
    input.addEventListener("input", (event) => {
        value.textContent = event.target.value;
    });
}


dynamicUserLimit()
validateForm()
deleteButton.addEventListener('click', deleteTask)
removeFileButtons.forEach((button) => {
    button.addEventListener('click', removeFile)
})