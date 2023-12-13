async function authenticate() {
    const loginId = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;

    const response = await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "login_id": loginId,
            "password": password
        })
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    alert('Authenticated successfully!');
}

async function createCustomer() {
    const token = localStorage.getItem('token');
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const customerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone
    };

    const jsonData = JSON.stringify(customerData);

    const response = await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        
        body: jsonData
    })
    .then(response => response.json())
    .then(data => {
        if (data.statusCode === 201) {
            console.log('Successfully Created');
        } else {
            console.log('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    alert(await response.text());
}

async function getCustomerList() {
    const token = localStorage.getItem('token');
    const response = await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const customers = await response.json();
    const table = document.getElementById('customerTable');
    table.innerHTML = '<tr><th>First Name</th><th>Last Name</th></tr>';
    customers.forEach(customer => {
        table.innerHTML += `<tr><td>${customer.first_name}</td><td>${customer.last_name}</td></tr>`;
    });
}

async function deleteCustomer() {
    const token = localStorage.getItem('token');
    const uuid = document.getElementById('uuid').value;
    const response = await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ "cmd": "delete", "uuid": uuid })
    });

    alert(await response.text());
}

async function updateCustomer() {
    const token = localStorage.getItem('token');
    const uuid = document.getElementById('uuid').value;
    const response = await fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            "cmd": "update",
            "uuid": uuid,
            "first_name": "Jane",
            "last_name": "Doe",
            "street": "Elvnu Street",
            "address": "H no 2 ",
            "city": "Delhi",
            "state": "Delhi",
            "email": "sam@gmail.com",
            "phone": "12345678"
        })
    });

    alert(await response.text());
}