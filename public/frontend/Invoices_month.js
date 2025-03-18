function openMonthlyModal() {
    document.getElementById("mothlyModal").style.display = "flex";
    // Focus on the invoice input field
    document.getElementById("invoice-month-inputt").focus();
}

function closeMonthlyModal() {
    document.getElementById("mothlyModal").style.display = "none";
}

// Close modal if user clicks outside the content
window.onclick = function(event) {
    const modal = document.getElementById("mothlyModal");
    if (event.target === modal) {
        closeModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data once the DOM is loaded for monthly data
    fetchInvoiceAndTargetData();

    // Attach the saveMonthlyInvoice function to the Save Monthly Invoice button
    document.querySelector('.save-month').addEventListener('click', saveMonthlyInvoice);
});

function saveMonthSum() {
    const invoiceAmount = document.getElementById('invoice-month-input').value;

    if (!invoiceAmount) {
            alert("Invoice amount is required.");
            return;
    }

    const data = {
        month_total: parseFloat(invoiceAmount) // Ensure the correct field name
    };

    console.log('Sending data:', data);  // Debugging log to check request payload

    axios.post('http://127.0.0.1:8000/api/v1/monthly-invoices/sum', data, {
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

function fetchInvoiceAndTargetData() {
    // Fetch Monthly Latest Data (e.g., invoice data)
    axios.get('http://127.0.0.1:8000/api/v1/monthly-latest')
        .then(response => {
            console.log('Monthly Latest Data:', response.data);
            if (response.data.latest_month_total) {
                const formattedTotal = Number(response.data.latest_month_total).toLocaleString();
                document.getElementById('month-invoice-value').innerText = `$${formattedTotal}`;
            } else {
                console.error('Error: latest_month_total not found in response.');
            }
        })
        .catch(error => {
            console.error('Error fetching monthly latest data:', error);
        });

    // Fetch Monthly Target Data
    axios.get('http://127.0.0.1:8000/api/v1/monthly-target')
        .then(response => {
            console.log('Monthly Target Data:', response.data);
            if (response.data.latest_month_target) {
                const formattedTarget = Number(response.data.latest_month_target).toLocaleString();
                document.getElementById('month-target-value').innerText = `$${formattedTarget}`;
            } else {
                console.error('Error: latest_month_target not found in response.');
            }
        })
        .catch(error => {
            console.error('Error fetching monthly target data:', error);
        });
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', fetchInvoiceAndTargetData);


function saveMonthlyInvoice() {
    const invoiceAmount = document.getElementById('invoice-month-input').value;



    console.log('Sending data:', data); 

    axios.post('http://127.0.0.1:8000/api/v1/monthly-invoices/sum', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Monthly invoice updated successfully:', response.data);
        closeModal();
        fetchInvoiceAndTargetData();
    })
    .catch(error => {
        console.error('Error updating monthly invoice:', error.response);
        if (error.response && error.response.data.errors) {
            alert('Error: ' + Object.values(error.response.data.errors).flat().join(', '));
        }
    });
}


function saveMonth() {
    // Retrieve the input elements for invoice and target values
    const invoiceInput = document.getElementById('edit-invoiced-week');
    const targetInput = document.getElementById('edit-target-week');

    // Parse the values; if not provided, default to 0
    const invoiceAmount = invoiceInput ? parseFloat(invoiceInput.value) || 0 : 0;
    const targetAmount = targetInput ? parseFloat(targetInput.value) || 0 : 0;

    console.log('Invoice Amount:', invoiceAmount);
    console.log('Target Amount:', targetAmount);

    // Prepare data for the POST request
    const data = {
        month_total: invoiceAmount,
        month_target: targetAmount
    };

    // Send POST request using Axios
    axios.post('http://127.0.0.1:8000/api/v1/monthly-invoices', data)
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

// Initial fetch and chart creation on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart();
});

document.querySelector('.save-month').addEventListener('click', saveMonthlyInvoice);
document.querySelector('.save').addEventListener('click', saveMonth);

