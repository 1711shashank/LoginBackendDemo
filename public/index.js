
var form = document.querySelector('#form');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    var name = e.target.name.value;
    var email = e.target.email.value;
    var password = e.target.password.value;
  
    var obj = { 
        name,email,password
    };

    fetch('http://localhost:3000/signup', {
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({name,email,password})
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        window.location.href = 'C:\Users\krsha\Desktop\LoginPage\public\signup_success.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
})

