import { socketio } from "./socket.js";

function updateLabel(data) {
        const label = document.querySelector(`#task-label-${taskUid}`);
        const color = document.querySelector(`#color-label-${taskUid}`);
        if (label.textContent !== data.label) {
            label.textContent = data.label;
            color.style.color = data.color;
        }
}

function requestLabelUpdate(){
    const uidList = Array.from(document.querySelectorAll('#task-uid')).map(x => x.getAttribute('task_uid'));
    uidList.forEach((taskUid) => {
    socketio.emit('get_label', taskUid);
    });
}

socketio.on('label', updateLabel);
