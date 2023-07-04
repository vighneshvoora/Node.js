const fullNameElement = document.getElementById('fullName');
const emailIdElement = document.getElementById('emailId');
const phoneNumberElement = document.getElementById('phoneNumber');
const passwordElement = document.getElementById('password');
const addElement = document.getElementById('add');
const loginEmailElement = document.getElementById('loginEmailId');
const loginPasswordElement = document.getElementById('loginPassword');

function login() {
    console.log(loginEmailElement.value, loginPasswordElement.value);
    const data = {
        email: loginEmailElement.value,
        password: loginPasswordElement.value
    }
    axios.post('http://localhost:3001/login', data).then((result) => {
        console.log(result);
        alert(result.data.message);
        document.getElementById('loginEmailId').value = '';
        document.getElementById('loginPassword').value = '';
    }).catch((err) => {
        console.log(err);
    });
}

function signup() {
    console.log(fullNameElement.value, emailIdElement.value, passwordElement.value, phoneNumberElement.value, addElement.value);

    const data = {
        fullName: fullNameElement.value,
        email: emailIdElement.value,
        contact: phoneNumberElement.value,
        password: passwordElement.value,
        add: addElement.value
    };
    axios.post('http://localhost:3001/signup', data).then((result) => {
        console.log(result);
        alert(result.data.message);
        document.getElementById('fullName').value = '';
        document.getElementById('emailId').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('password').value = '';
        document.getElementById('add').value = '';
    }).catch((err) => {
        console.log(err);
    });
}