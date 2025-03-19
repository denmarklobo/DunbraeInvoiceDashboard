const ctxBar = document.getElementById("revenueChart").getContext("2d");

document.addEventListener("DOMContentLoaded", function() {
    fetchDataAndUpdateChart();
    fetchMonthlyRevenue();
});

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the data from the API using Axios
    axios.get('http://127.0.0.1:8000/api/v1/monthly-latest')
      .then(response => {
        // Assuming the API returns an object with a 'totalRevenue' field
        const totalRevenue = response.data.totalRevenue || 0; // Default to 0 if no value is returned
  
        // Update the totalRevenue element with the fetched data
        document.getElementById("totalRevenue").textContent = `$${totalRevenue}`;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error gracefully, maybe show an error message
      });
  });

// Fetch data using Axios
axios.get("http://127.0.0.1:8000/api/v1/monthly-chart")
    .then(response => {
        let apiData = response.data;

        // Ensure month order follows the expected format
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        // Sort the data based on the predefined order
        apiData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        
        // Extract labels and data
        const labels = monthOrder.map(month => month.substring(0, 3)); // Convert to "Jan", "Feb", etc.
        const data = apiData.map(item => parseFloat(item.month_total) || 0); // Convert values to numbers
        
        // Create chart
        new Chart(ctxBar, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Revenue",
                    data: data,
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
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });


    function createDoughnutChart(monthTotal, monthTarget) {
        const ctx = document.getElementById('salesChart').getContext('2d');
        console.log('Creating chart with data:', monthTotal, monthTarget);
    
        if (window.salesChart instanceof Chart) {
            window.salesChart.destroy();
        }
    
        // Calculate remaining target amount
        const remaining = Math.max(monthTarget - monthTotal, 0); // Ensure no negative values
    
        window.salesChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Achieved', 'Remaining'],
                datasets: [{
                    label: '', // Remove the label
                    data: [monthTotal, remaining],
                    backgroundColor: ['#ffffff', '#193F75'], // White for progress, blue for remaining
                    borderWidth: 0 // Remove the border
                }]
            },
            options: {
                responsive: true,
                cutout: '65%', // Creates a semi-donut effect
                plugins: {
                    legend: {
                        display: false, // Hide the legend
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return '$' + tooltipItem.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
// Fetch data from API and update the chart
function fetchDataAndUpdateChart() {
    // Make Axios GET requests to both API endpoints
    axios.get('http://127.0.0.1:8000/api/v1/monthly-latest')
    .then(response => {
        const monthTotal = parseFloat(response.data.latest_month_total) || 0; // Extract the value correctly
        console.log('Month Total:', monthTotal); // Log the month total

        return axios.get('http://127.0.0.1:8000/api/v1/monthly-target')
            .then(response => {
                const monthTarget = parseFloat(response.data.latest_month_target) || 0; // Extract the value correctly
                console.log('Month Target:', monthTarget); // Log the month target
                createDoughnutChart(monthTotal, monthTarget);
            });
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
        createDoughnutChart(0, 0); // Fallback to 0 values
    });
}



document.querySelector('.save-month').addEventListener('click', saveMonthlyInvoice);
document.querySelector('.save').addEventListener('click', saveMonth);

axios.get('http://127.0.0.1:8000/api/v1/monthly-latest')
   .then(response => {
     const totalRevenue = response.data.totalRevenue || 0;
     console.log('Total Revenue:', totalRevenue); // Debugging line
     document.getElementById("totalRevenue").textContent = `$${totalRevenue}`;
   })
   .catch(error => {
     console.error('Error fetching data:', error);
   });

// Update revenue chart
function updateRevenueChart(data) {
    const ctx = document.getElementById("revenueChart").getContext("2d");

    // Extract month names and revenue totals
    const labels = data.map(item => item.month); // Assumes API returns month names
    const revenues = data.map(item => item.month_total); // Assumes API returns month_total

    // Update total revenue display
    const totalRevenue = revenues.reduce((sum, value) => sum + value, 0);
    document.getElementById("totalRevenue").textContent = `$${totalRevenue.toLocaleString()}`;

    // Create the bar chart
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Revenue ($)",
                data: revenues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}