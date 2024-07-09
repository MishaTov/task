function checkLabel() {
    const uidList = Array.from(document.querySelectorAll('#task-uid')).map(x => x.getAttribute('task_uid'))
    uidList.forEach((uid) => {
        const label = document.querySelector(`#task-label-${uid}`)
        const color = document.querySelector(`#color-label-${uid}`)
        const url = document.querySelector(`#time-label-${uid}`).getAttribute('url')
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log()
                if (label.textContent !== data.label) {
                    label.textContent = data.label
                    color.style.color = data.color
                }
            })
            .catch(error => console.log(error))
    })
}

setInterval(checkLabel, 1000)
