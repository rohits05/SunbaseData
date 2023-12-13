let authenticateToken;

function authenticateUser() {
    const loginId = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login_id: loginId,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        return response.json();
    })
    .then(data => {
        authenticateToken = data.token;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('customerList').style.display = 'block';
        document.getElementById('createCustomerForm').style.display = 'block';
        document.getElementById('deleteCustomerForm').style.display = 'block';
        document.getElementById('updateCustomerForm').style.display = 'block';
    })
    .catch(error => {
        alert('Authentication failed. Please check your credentials.');
    });
}

function createCustomer() {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authenticateToken}`,
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
        }),
    })
    .then(response => {
        if (response.status === 201) {
            alert('Customer created successfully');
        } else if (response.status === 400) {
            throw new Error('First Name or Last Name is missing');
        } else {
            throw new Error('Failed to create customer');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function getCustomerList() {
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authenticateToken}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customer list');
        }
        return response.json();
    })
    .then(data => {
        displayCustomerList(data);
    })
    .catch(error => {
        alert('Failed to fetch customer list');
    });
}

function displayCustomerList(customers) {
    const table = document.getElementById('customerTable');
    table.innerHTML = '<tr><th>First Name</th><th>Last Name</th><th>Street</th><th>Address</th><th>City</th><th>State</th><th>Email</th><th>Phone</th></tr>';
    customers.forEach(customer => {
        const row = table.insertRow();
        row.insertCell(0).textContent = customer.first_name;
        row.insertCell(1).textContent = customer.last_name;
        row.insertCell(2).textContent = customer.street;
        row.insertCell(3).textContent = customer.address;
        row.insertCell(4).textContent = customer.city;
        row.insertCell(5).textContent = customer.state;
        row.insertCell(6).textContent = customer.email;
        row.insertCell(7).textContent = customer.phone;
    });
}

function deleteCustomer() {
    const deleteUUID = document.getElementById('delete_uuid').value;

fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=' + deleteUUID, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authenticateToken}`,
        },
    })
    .then(response => {
        if (response.status === 200) {
            alert('Customer deleted successfully');
        } else if (response.status === 400) {
            throw new Error('UUID not found');
        } else if (response.status === 500) {
            throw new Error('Error not deleted');
        } else {
            throw new Error('Failed to delete customer');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function updateCustomer() {
    const updateUUID = document.getElementById('update_uuid').value;
    const updateFirstName = document.getElementById('update_first_name').value;
    const updateLastName = document.getElementById('update_last_name').value;
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=' + updateUUID, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authenticateToken}`,
        },
        body: JSON.stringify({
            first_name: updateFirstName,
            last_name: updateLastName,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            alert('Customer updated successfully');
        } else if (response.status === 400) {
            throw new Error('Body is empty');
        } else if (response.status === 500) {
            throw new Error('UUID not found');
        } else {
            throw new Error('Failed to update customer');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}