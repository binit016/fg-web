// Check if the user is already logged in
if (localStorage.getItem('isAdminLoggedIn')) {
  // User is logged in, redirect to the desired page
  window.location.href = 'dashboard.html';
}

document.getElementById('adminloginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get the values entered by the user
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Perform basic form validation
  if (username === '' || password === '') {
    console.log('Please enter both username and password');
    alert('Please enter both username and password');
    return;
  }

  // Make an API request to authenticate the user
  fetch('http://13.238.255.97:8081/api/login/admins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone: username,
      password: password
    })
  })
  .then(function(response) {
    if (response.ok) {
      // User is authenticated, store login session in local storage
      localStorage.setItem('isAdminLoggedIn', 'true');

      console.log(response);

      // Redirect to the desired page
      window.location.href = 'dashboard.html';
    } else {
      alert("Invalid Credentials, please enter correct username and password.");
      // User authentication failed, display an error message
      console.log('Authentication failed');
    }
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
});
