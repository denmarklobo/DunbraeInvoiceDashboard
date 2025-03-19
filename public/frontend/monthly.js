document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded, starting API calls...");

    const latestUrl = "http://127.0.0.1:8000/api/v1/monthly-latest";
    const targetUrl = "http://127.0.0.1:8000/api/v1/monthly-target";
    const chartUrl = "http://127.0.0.1:8000/api/v1/monthly-chart";

    try {
        // Fetch all required data at once
        const [latestRes, targetRes, chartRes] = await Promise.all([
            axios.get(latestUrl),
            axios.get(targetUrl),
            axios.get(chartUrl)
        ]);

        const latestData = latestRes.data;
        const targetData = targetRes.data;
        const chartData = chartRes.data;

        /*** UPDATE DOUGHNUT CHART ***/
        const ctx = document.getElementById('progressChart').getContext('3d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        latestData.latest_month_total || 0,  // Actual progress
                        (targetData.latest_month_target || 0) - (latestData.latest_month_total || 0) // Remaining to reach target
                    ],
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

        /*** UPDATE BAR CHART ***/
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        chartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        const labels = monthOrder.map(month => month.substring(0, 3)); // "Jan", "Feb", etc.
        const values = monthOrder.map(month => {
            const found = chartData.find(item => item.month === month);
            return found ? parseFloat(found.month_total) || 0 : 0;
        });

        const ctxBar = document.getElementById("barChart").getContext("2d");
        new Chart(ctxBar, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Revenue",
                    data: values,
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

        /*** UPDATE TEXT DATA ***/
        document.getElementById("amountInvoiced").textContent = `$${parseFloat(latestData.latest_month_total || 0).toLocaleString()}`;
        document.getElementById("weekTarget").textContent = `$${parseFloat(targetData.latest_month_target || 0).toLocaleString()}`;

    } catch (error) {
        console.error("Error fetching data:", error);
    }
});