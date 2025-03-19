// Open Yearly Modal
function openYearlyModal() {
    document.getElementById("yearlyModal").style.display = "flex";
    document.getElementById("invoice-yearly").focus();
}

// Close Yearly Modal
function closeYearlyModal() {
    document.getElementById("yearlyModal").style.display = "none";
}

// Close modal if user clicks outside the content (specific to year modal)
window.onclick = function(event) {
    const yearlyModal = document.getElementById("yearlyModal");
    if (event.target === yearlyModal) {
        closeYearlyModal();  // Close the yearly modal
    }
    
    const invoiceModal = document.getElementById("invoiceModal");
    if (event.target === invoiceModal) {
        closeModal();  // Close the invoice modal
    }
};

// Fetch and display data when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data for both weekly and yearly data
    fetchInvoiceAndTargetData();
    fetchYearlyInvoiceAndTargetData();

    // Attach event listeners to buttons
    document.querySelector('.save-week').addEventListener('click', saveWeek);
    document.querySelector('.save-year').addEventListener('click', saveYear);
});

// Fetch Weekly and Yearly Data
function fetchInvoiceAndTargetData() {
    axios.get('http://127.0.0.1:8000/api/v1/weekly-latest')
        .then(response => {
            console.log('Weekly Latest Data:', response.data);
            const formattedTotal = Number(response.data.latest_week_total).toLocaleString();
            document.getElementById('week-invoice').innerText = `$${formattedTotal}`;
        })
        .catch(error => console.error('Error fetching weekly latest data:', error));

    axios.get('http://127.0.0.1:8000/api/v1/weekly-target')
        .then(response => {
            console.log('Weekly Target Data:', response.data);
            const formattedTarget = Number(response.data.latest_week_target).toLocaleString();
            document.getElementById('week-target').innerText = `$${formattedTarget}`;
        })
        .catch(error => console.error('Error fetching weekly target data:', error));
}

// Fetch Yearly Data
function fetchYearlyInvoiceAndTargetData() {
    axios.get('http://127.0.0.1:8000/api/v1/yearly-latest')
        .then(response => {
            console.log('Yearly Latest Data:', response.data);
            const formattedTotal = Number(response.data.latest_year_total).toLocaleString();
            document.getElementById('year-invoice').innerText = `$${formattedTotal}`;
        })
        .catch(error => console.error('Error fetching yearly latest data:', error));

    axios.get('http://127.0.0.1:8000/api/v1/yearly-target')
        .then(response => {
            console.log('Yearly Target Data:', response.data);
            const formattedTarget = Number(response.data.latest_year_target).toLocaleString();
            document.getElementById('year-target').innerText = `$${formattedTarget}`;
        })
        .catch(error => console.error('Error fetching yearly target data:', error));
}



function saveYearSum() {
    const invoiceAmount = document.getElementById('edit-invoiced-year').value;

    if (!invoiceAmount) {
            alert("Invoice amount is required.");
            return;
    }

    const data = {
        year_total: parseFloat(invoiceAmount) // Ensure it's a number
    };

    console.log('Sending data:', data);  // Debugging log to check request payload

    axios.post('http://127.0.0.1:8000/api/v1/yearly-invoices/sum', data, {
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

// Save Yearly Changes
function saveYear() {
    const invoiceAmount = document.getElementById('invoice-yearly').value; // Corrected id
    const targetAmount = document.getElementById('edit-target-year').value;

    console.log('Invoice Amount:', invoiceAmount);
    console.log('Target Amount:', targetAmount);

    if (!invoiceAmount || !targetAmount) {
        alert('Please provide both the invoice amount and target amount.');
        return;
    }

    const data = {
        year_total: invoiceAmount,
        year_target: targetAmount
    };

    axios.post('http://127.0.0.1:8000/api/v1/yearly-invoices', data)
        .then(response => {
            console.log('Yearly invoice added successfully:', response.data);
            closeYearlyModal();
        })
        .catch(error => {
            console.error('Error adding yearly invoice:', error.response.data);
            if (error.response.data.errors) {
                alert('Error: ' + Object.values(error.response.data.errors).flat().join(', '));
            }
        });
}

// Create Yearly Doughnut Chart
function createYearlyDoughnutChart(yearTotal, yearTarget) {
    const ctx = document.getElementById('salesChartYear').getContext('2d');
    console.log('Creating chart with data:', yearTotal, yearTarget);

    if (window.salesChartYear instanceof Chart) {
        window.salesChartYear.destroy();
    }

    const remaining = Math.max(yearTarget - yearTotal, 0);

    window.salesChartYear = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Achieved', 'Remaining'],
            datasets: [{
                label: '', // Remove the label
                data: [yearTotal, remaining],
                backgroundColor: ['#ffffff', '#193F75'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '65%',
            plugins: {
                legend: { display: false },
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

function fetchDataAndUpdateChart() {
    // Make Axios GET requests to both API endpoints for yearly data
    axios.get('http://127.0.0.1:8000/api/v1/yearly-latest')
    .then(response => {
        const yearTotal = parseFloat(response.data.latest_year_total) || 0; // Extract the value correctly
        console.log('Year Total:', yearTotal); // Log the year total

        return axios.get('http://127.0.0.1:8000/api/v1/yearly-target')
            .then(response => {
                const yearTarget = parseFloat(response.data.latest_year_target) || 0; // Extract the value correctly
                console.log('Year Target:', yearTarget); // Log the year target
                createYearlyDoughnutChart(yearTotal, yearTarget);
            });
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
        createYearlyDoughnutChart(0, 0); // Fallback to 0 values
    });
}

// Initial fetch and chart creation on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateChart();
});
