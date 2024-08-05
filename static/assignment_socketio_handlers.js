let socketio = io()


socketio.on('change assignment label', (data) => {
    console.log(data)
    const taskLabel = document.getElementById(`task-label-${data.task_uid}`)
    const colorLabel = document.getElementById(`color-label-${data.task_uid}`)
    taskLabel.innerHTML = data.label
    colorLabel.style.color = data.color
})

socketio.on('edit assignment page', (data) => {
    const subject = document.getElementById(`task-subject-${data.task_uid}`)
    const deadline = document.getElementById(`task-deadline-${data.task_uid}`)
    subject.innerHTML = data.subject
    deadline.innerHTML = data.deadline
})