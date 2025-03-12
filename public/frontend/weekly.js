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
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: 32}, (_, i) => `${i + 1}`),
            datasets: [{
                label: 'Total Invoice for week',
                data: Array.from({length: 32}, () => Math.floor(Math.random() * 50000) + 10000),
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

document.addEventListener("DOMContentLoaded", function() {
    const monthNames = [
        "July", "August", "September", "October", "November", "December",
        "January", "February", "March", "April", "May", "June"
    ];

    const currentMonthIndex = new Date().getMonth();
    let fiscalMonthIndex = (currentMonthIndex + 6) % 12;

    document.getElementById("currentMonth").textContent = monthNames[fiscalMonthIndex];
});