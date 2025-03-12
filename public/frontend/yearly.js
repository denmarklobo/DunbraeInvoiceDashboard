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


// Set fiscal year format
document.addEventListener("DOMContentLoaded", function() {
    // Get the current date
    const today = new Date();
    let currentYear = today.getFullYear();
    let nextYear = currentYear + 1;

    // If before July, use the previous fiscal year
    let fiscalStartYear = today.getMonth() < 6 ? currentYear - 1 : currentYear;
    let fiscalEndYear = fiscalStartYear + 1;

    // Set fiscal year format ('25 - 26')
    const fiscalYearText = `'${String(fiscalStartYear).slice(-2)} - ${String(fiscalEndYear).slice(-2)}'`;

    // Update elements dynamically
    document.querySelector(".highlight").textContent = fiscalYearText;
    document.querySelector(".overview").textContent = `July ${fiscalStartYear} - June ${fiscalEndYear}`;
    
    // Update all YEAR elements
    document.querySelectorAll(".big-number, .week-text").forEach(el => {
        el.innerHTML = el.innerHTML.replace(/\d{4}/g, currentYear);
    });
});
