function openModal() {
    document.getElementById("invoiceModal").style.display = "flex";
    // Focus on the invoice input field
    document.getElementById("add-invoice-input").focus();
}

function closeModal() {
    document.getElementById("invoiceModal").style.display = "none";
}

// Close modal if user clicks outside the content       
window.onclick = function(event) {
    const modal = document.getElementById("invoiceModal");
    if (event.target === modal) {
        closeModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data once the DOM is loaded
    fetchInvoiceAndTargetData();

    // Attach the saveWeek function to the Save Changes button
    // Ensure that your button has the class 'save-week' in the HTML
    document.querySelector('.save-week').addEventListener('click', saveWeek);
});


function fetchInvoiceAndTargetData() {
    // Fetch Weekly Latest Data (e.g., invoice data)
    axios.get('http://127.0.0.1:8000/api/v1/weekly-latest')
        .then(response => {
            console.log('Weekly Latest Data:', response.data);
            const formattedTotal = Number(response.data.latest_week_total).toLocaleString();
            document.getElementById('week-invoice').innerText = `$${formattedTotal}`;
        })
        .catch(error => {
            console.error('Error fetching weekly latest data:', error);
        });

    // Fetch Weekly Target Data
    axios.get('http://127.0.0.1:8000/api/v1/weekly-target')
        .then(response => {
            console.log('Weekly Target Data:', response.data);
            const formattedTarget = Number(response.data.latest_week_target).toLocaleString();
            document.getElementById('week-target').innerText = `$${formattedTarget}`;
        })
        .catch(error => { 
            console.error('Error fetching weekly target data:', error);
        });
}

function saveSum() {
    const invoiceAmount = document.getElementById('add-invoice-input').value;

    if (!invoiceAmount) {
            alert("Invoice amount is required.");
            return;
    }

    const data = {
        week_total: parseFloat(invoiceAmount)
    };

    console.log('Sending data:', data);

    axios.post('http://127.0.0.1:8000/api/v1/weekly-invoices/sum', data, {
        headers: {
            'Content-Type': 'application/json'  
        }
    })
    .then(response => {
        console.log('Invoice updated successfully:', response.data);
        closeModal();
    })
    .catch(error => {
        console.error('Error updating invoice:', error.response);
        if (error.response && error.response.data.errors) {
            alert('Error: ' + Object.values(error.response.data.errors).flat().join(', '));
        }
    });  
}

function saveWeek() {
    // Retrieve the input elements for invoice and target values
    const invoiceInput = document.getElementById('invoice-input');
    const targetInput = document.getElementById('target-input');

    // Parse the values; if not provided, default to 0
    const invoiceAmount = invoiceInput ? parseFloat(invoiceInput.value) || 0 : 0;
    const targetAmount = targetInput ? parseFloat(targetInput.value) || 0 : 0;

    console.log('Invoice Amount:', invoiceAmount);
    console.log('Target Amount:', targetAmount);

    // Prepare data for the POST request
    const data = {
        week_total: invoiceAmount,
        week_target: targetAmount
    };

    // Send POST request using Axios
    axios.post('http://127.0.0.1:8000/api/v1/weekly-invoices', data)
        .then(response => {
            console.log('Invoice added successfully:', response.data);
            closeModal();
        })
        .catch(error => {
            console.error('Error adding invoice:', error.response.data);
            if (error.response.data.errors) {
                alert('Error: ' + Object.values(error.response.data.errors).flat().join(', '));
            }
        });
}

// CHART
function createDoughnutChart(weekTotal, weekTarget) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    console.log('Creating chart with data:', weekTotal, weekTarget);

    if (window.salesChart instanceof Chart) {
        window.salesChart.destroy();
    }

    // Calculate remaining target amount
    const remaining = Math.max(weekTarget - weekTotal, 0); // Ensure no negative values

    window.salesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Achieved', 'Remaining'],
            datasets: [{
                label: '', // Remove the label
                data: [weekTotal, remaining],
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
    axios.get('http://127.0.0.1:8000/api/v1/weekly-latest')
    .then(response => {
        const weekTotal = parseFloat(response.data.latest_week_total) || 0; // Extract the value correctly
        console.log('Week Total:', weekTotal); // Log the week total

        return axios.get('http://127.0.0.1:8000/api/v1/weekly-target')
            .then(response => {
                const weekTarget = parseFloat(response.data.latest_week_target) || 0; // Extract the value correctly
                console.log('Week Target:', weekTarget); // Log the week target
                createDoughnutChart(weekTotal, weekTarget);
            });
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
        createDoughnutChart(0, 0); // Fallback to 0 values
    });
}

// Initial fetch and chart creation on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart();
});





