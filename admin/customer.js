// Function to mask sensitive values
function maskValue(value) {
    const maskChar = '*'; // Character used for masking
    const visibleLength = 4; // Number of visible characters at the end
    const maskedLength = value.length - visibleLength;
    const maskedValue = maskChar.repeat(maskedLength) + value.slice(maskedLength);

    return maskedValue;
}

// Fetch data from the API
fetch('http://13.238.255.97:8081/api/getAll/customers')
    .then(response => response.json())
    .then(data => {
        // Get the table body element
        const tableBody = document.querySelector('#data-table');

        // Check if the data array is empty
        if (data.length === 0) {
            // Create a single row with a "No Records Found" message
            const row = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.textContent = 'No Records Found';
            noDataCell.colSpan = 10; // Adjust the colspan based on the number of columns in your table
            row.appendChild(noDataCell);
            tableBody.appendChild(row);
        } else {
            // Iterate over the data and create table rows
            data.forEach((response, index) => {
                // Create a new row
                const row = document.createElement('tr');

                // Create a cell for the serial number
                const serialNumberCell = document.createElement('td');
                serialNumberCell.textContent = index + 1;
                row.appendChild(serialNumberCell);

                // Create cells for each column
                const dateCell = document.createElement('td');
                dateCell.textContent = response.name; // Use the formatted date
                row.appendChild(dateCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = response.email;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = response.phone;
                row.appendChild(emailCell);

                // Create action buttons cell
                const actionsCell = document.createElement('td');
                actionsCell.classList.add('text-center');

                // Create Delete button
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-primary', 'btn-sm', 'mr-1');
                deleteButton.innerHTML = '<i class="fas fa-edit"></i> Delete';

                // Add event listener to open Bootstrap form (modal) on Delete button click
                deleteButton.addEventListener('click', () => {
                    // Open Bootstrap form (modal) here
                    openDeletePopup(response, index);
                });
                actionsCell.appendChild(deleteButton);
                row.appendChild(actionsCell);
                // Append the row to the table body
                tableBody.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.log('An error occurred while fetching data:', error);
    });

    function openDeletePopup(myResponse, index) {
        // Access the Bootstrap modal element
        const modal = document.getElementById('openDeletePopup');
    
        var viewModalLabelInput = modal.querySelector('#viewModalLabel');
        viewModalLabelInput.innerHTML = "Customer Details: #" + (index + 1);
    
        // Update the modal content with Customer details
        modal.querySelector('#customerName').textContent = myResponse.name;
        modal.querySelector('#customerEmail').textContent = myResponse.email;
        modal.querySelector('#customerPhone').textContent = myResponse.phone;
    
        // Add event listener to "Save Changes" button
        const saveChangesBtn = modal.querySelector('.modal-footer .btn-primary');
        saveChangesBtn.addEventListener('click', () => {
    
            // Show the loader
            showLoader();
    
            // Retrieve updated values from the form fields
            const id = myResponse.id;
    
            // Send updated data to the API
            const apiUrl = 'http://13.238.255.97:8081/api/delete/customers/' + id;
            fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(updatedCustomer => {
                // Hide the loader
                hideLoader();
    
                // Show an alert
                alert('Customer deleted successfully');
    
                // Close the modal after updating the customer
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.hide();
    
                // Refresh the page after successful deletion
                location.reload();
            })
            .catch(error => {
                console.error('An error occurred while updating the customer:', error);
            });
        });
    
        // Open the Bootstrap modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
    
    
    // Show the loader
    function showLoader() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';
      }
      
      // Hide the loader
      function hideLoader() {
        const loader = document.getElementById('loader');
        loader.style.display = 'none';
      }