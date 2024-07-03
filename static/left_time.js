function updateTimeLeft() {
    const timeLeftElements = document.querySelectorAll('.time-left');
    timeLeftElements.forEach(el => {
        const deadline = new Date(el.getAttribute('data-deadline'));
        const now = new Date();
        const timeDiff = deadline - now;
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            let timeParts = [];
            let foundNonZero = false;

            if (days > 0) {
                timeParts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
                foundNonZero = true;
            }
            if (hours > 0 || foundNonZero) {
                timeParts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
                foundNonZero = true;
            }
            if (minutes > 0 || foundNonZero) {
                timeParts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
                foundNonZero = true;
            }
            timeParts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

            el.innerHTML = timeParts.join(' ');
        } else {
            el.innerHTML = 'Time is over';
        }
    });
}
setInterval(updateTimeLeft, 1000);
document.addEventListener('DOMContentLoaded', updateTimeLeft);
