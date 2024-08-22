import {socketio} from "./socket.js";


function createNewTask(data) {
    const newTaskLink = document.createElement('a');
    newTaskLink.classList.add('task-info')
    newTaskLink.href = `/assignment/${data.task_uid}`;
    newTaskLink.setAttribute('id', `${data.task_uid}`);

    const newTaskElement = document.createElement('div');
    newTaskElement.classList.add('task-link');

    const newTaskSubjectElement = document.createElement('div');
    newTaskSubjectElement.classList.add('task-subject-div');

    const newTaskSubject = document.createElement('div');
    newTaskSubject.classList.add('task-subject');
    newTaskSubject.setAttribute('id', `task-subject-${data.task_uid}`);
    newTaskSubject.innerHTML = data.subject;

    const newTaskLabelElement = document.createElement('div');
    newTaskLabelElement.classList.add('task-label-element');

    const newTaskLabel = document.createElement('div');
    newTaskLabel.classList.add('task-label');
    newTaskLabel.setAttribute('id', `task-label-${data.task_uid}`);
    newTaskLabel.innerHTML = data.label;

    const newTaskColorLabel = document.createElement('span');
    newTaskColorLabel.classList.add('task-color-label');
    newTaskColorLabel.setAttribute('id', `color-label-${data.task_uid}`);
    newTaskColorLabel.style.color = data.color;
    newTaskColorLabel.innerHTML = '●';

    const newTaskTimeLabelElement = document.createElement('div');
    newTaskTimeLabelElement.classList.add('time-label');
    newTaskTimeLabelElement.setAttribute('id', `time-label-${data.task_uid}`);

    const newTaskDeadlineElement = document.createElement('div');
    newTaskDeadlineElement.setAttribute('id', `task-deadline-${data.task_uid}`);
    newTaskDeadlineElement.innerHTML = `<strong>Due to: </strong>${data.deadline}`;

    const newTaskTimeRemaining = document.createElement('strong');
    newTaskTimeRemaining.innerHTML = 'Time remaining: ';

    const newTaskTimeLeft = document.createElement('span');
    newTaskTimeLeft.classList.add('time-left')
    newTaskTimeLeft.setAttribute('data-deadline', `data-deadline-${data.deadline}`);

    newTaskLabelElement.appendChild(newTaskLabel);
    newTaskLabelElement.appendChild(newTaskColorLabel);

    newTaskSubjectElement.appendChild(newTaskSubject);
    newTaskSubjectElement.appendChild(newTaskLabelElement);

    newTaskTimeLabelElement.appendChild(newTaskDeadlineElement);
    newTaskTimeLabelElement.appendChild(newTaskTimeRemaining);
    newTaskTimeLabelElement.appendChild(newTaskTimeLeft);

    newTaskElement.appendChild(newTaskSubjectElement);
    newTaskElement.appendChild(newTaskTimeLabelElement);

    newTaskLink.appendChild(newTaskElement);

    const taskList = document.getElementById('tasks');
    taskList.prepend(newTaskLink);
}

socketio.on('new task', (data) => {
    createNewTask(data);
});

socketio.on('delete task', (data) => {
    const task  = document.getElementById(`${data.task_uid}`)
    console.log(task)
    task.remove()
});

socketio.on('change assignment label', (data) => {
    const taskLabel = document.getElementById(`task-label-${data.task_uid}`);
    const colorLabel = document.getElementById(`color-label-${data.task_uid}`);
    taskLabel.innerHTML = data.label;
    colorLabel.style.color = data.color;
});

socketio.on('edit assignment page', (data) => {
    const subject = document.getElementById(`task-subject-${data.task_uid}`);
    const deadline = document.getElementById(`task-deadline-${data.task_uid}`);
    subject.innerHTML = data.subject;
    deadline.innerHTML = data.deadline;
});
