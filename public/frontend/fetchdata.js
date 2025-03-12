document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    let name = document.getElementById('name').value;

    fetch('http://127.0.0.1:8000/api/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});