function updateTime() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${formattedDate} | ${hours}:${minutes} ${ampm}`;
    document.getElementById('current-time').textContent = formattedTime;
}

// Call updateTime once and then update every minute
updateTime();
setInterval(updateTime, 60000);
