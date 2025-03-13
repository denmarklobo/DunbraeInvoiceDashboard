const ctx = document.getElementById('progressChart').getContext('2d');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [65, 35], // 65% progress
            backgroundColor: ['#193F75', '#e0e0e0'],
            borderWidth: 0,
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('barChart').getContext('2d');
    
    // Define fiscal year months (July to June)
    const fiscalMonths = [
        "July", "August", "September", "October", "November", "December",
        "January", "February", "March", "April", "May", "June"
    ];

    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fiscalMonths, // Update labels to months
            datasets: [{
                label: 'Total Invoice for Fiscal Year',
                data: Array.from({length: 12}, () => Math.floor(Math.random() * 50000) + 10000),
                backgroundColor: '#193F75'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Ensure it fills the container
            scales: {
                x: {
                    display: true,
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
});

// Automatically set the current year
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
});

// Function to update the current month dynamically
document.addEventListener("DOMContentLoaded", function() {
    // Define fiscal year months (July starts the year)
    const monthNames = [
        "July", "August", "September", "October", "November", "December",
        "January", "February", "March", "April", "May", "June"
    ];

    // Get the current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();
    const calendarMonthIndex = today.getMonth(); // 0-based index (Jan = 0)
    
    // Adjust for fiscal year (shift 6 months forward)
    const fiscalMonthIndex = (calendarMonthIndex + 6) % 12;
    const currentMonth = monthNames[fiscalMonthIndex];

    // Update month, date, and year in the HTML
    document.querySelector(".highlight").textContent = `${currentMonth} ${currentYear}`;
    document.querySelector(".overview").textContent = `As of ${currentDate} ${currentMonth} ${currentYear}`;
    document.querySelector(".big-number").textContent = `${currentMonth} ${currentDate}`;
    document.querySelector(".year").textContent = `Year ${currentYear}`;
});
