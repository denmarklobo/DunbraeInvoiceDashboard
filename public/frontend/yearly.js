document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded, starting API calls...");

    // URLs for fetching data
    const latestUrl = "http://127.0.0.1:8000/api/v1/yearly-latest";
    const targetUrl = "http://127.0.0.1:8000/api/v1/yearly-target";
    const chartUrl = "http://127.0.0.1:8000/api/v1/yearly-bargraph";

    // Show loading message while fetching data
    document.getElementById("loadingMessage").style.display = "block";
    document.getElementById("dashboardContent").style.display = "none";

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

        // Hide loading message and show dashboard content
        document.getElementById("loadingMessage").style.display = "none";
        document.getElementById("dashboardContent").style.display = "block";

        /*** UPDATE DOUGHNUT CHART ***/
        const ctx = document.getElementById('progressChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        latestData.latest_year_total || 0,  // Actual progress
                        (targetData.latest_year_target || 0) - (latestData.latest_year_total || 0) // Remaining to reach target
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
        const yearOrder = [2024, 2025]; // Correct year order: 2020 to 2025
        chartData.sort((a, b) => yearOrder.indexOf(a.year) - yearOrder.indexOf(b.year));

        const labels = yearOrder.map(year => year.toString());
        const values = yearOrder.map(year => {
            const found = chartData.find(item => item.year === year);
            return found ? found.total : 0;  // Use "total" instead of "year_total"
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
        document.getElementById("amountInvoiced").textContent = `$${parseFloat(latestData.latest_year_total || 0).toLocaleString()}`;
        document.getElementById("yearTarget").textContent = `$${parseFloat(targetData.latest_year_target || 0).toLocaleString()}`;

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("loadingMessage").textContent = "Failed to load data. Please try again later.";
    }
});
