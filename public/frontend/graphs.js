const ctxBar = document.getElementById("revenueChart").getContext("2d");
new Chart(ctxBar, {
    type: "bar",
    data: {
        labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "Revenue",
            data: [12000, 19000, 30000, 50000, 24000, 32000, 12000, 19000, 30000, 24000, 32000, 32000],
            backgroundColor: "#193F75",
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


const ctxPie = document.getElementById("salesChart").getContext("2d");
new Chart(ctxPie, {
    type: "doughnut",
    data: {
        datasets: [{
            data: [75],
            backgroundColor: ["#ffffff"],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%"
    }
});
