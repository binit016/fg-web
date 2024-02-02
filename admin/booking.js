// Function to format the value to Rupees
function formatToRupees(value) {
    const roundedValue = value.toFixed(2);
    return `₹${roundedValue}`;
}

// Function to format the distance to one decimal place with "Kms" unit
function formatDistance(distance) {
    const roundedDistance = distance.toFixed(1);
    return `${roundedDistance} Kms`;
}

// Fetch data from the API
fetch('http://13.238.255.97:8081/api/getAll/bookings')
    .then(response => response.json())
    .then(data => {
        // Get the table body element
        const tableBody = document.querySelector('#booking-data-table');

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
                dateCell.textContent = response.b_date; // Use the formatted date
                row.appendChild(dateCell);

                const timeCell = document.createElement('td');
                timeCell.textContent = response.time; // Use the formatted date
                row.appendChild(timeCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = response.customer_name;
                row.appendChild(nameCell);

                const phoneCell = document.createElement('td');
                phoneCell.textContent = response.customer_phone;
                row.appendChild(phoneCell);

                const fromCell = document.createElement('td');
                fromCell.textContent = response.from_location;
                row.appendChild(fromCell);

                const toCell = document.createElement('td');
                toCell.textContent = response.to_location;
                row.appendChild(toCell);

                const vehicleCell = document.createElement('td');
                vehicleCell.textContent = response.vehicle_type;
                row.appendChild(vehicleCell);

                const itemsCell = document.createElement('td');
                itemsCell.textContent = response.items_type;
                row.appendChild(itemsCell);

                const weightCell = document.createElement('td');
                weightCell.textContent = response.weight + ' ' + response.type_of_load;
                row.appendChild(weightCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = formatToRupees(response.amount);
                row.appendChild(amountCell);

                const paymentCell = document.createElement('td');
                paymentCell.textContent = response.payment_method;
                row.appendChild(paymentCell);

                const distanceCell = document.createElement('td');
                distanceCell.textContent = formatDistance(response.distance);
                row.appendChild(distanceCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = response.status;
                row.appendChild(statusCell);

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
        const modal = document.getElementById('openDriverDeletePopup');
    
        var viewModalLabelInput = modal.querySelector('#viewDriverModalLabel');
        viewModalLabelInput.innerHTML = "Driver Details: #" + (index + 1);
    
        // Update the modal content with Driver details
        modal.querySelector('#driverName').textContent = myResponse.name;
        modal.querySelector('#driverEmail').textContent = myResponse.email;
        modal.querySelector('#driverPhone').textContent = myResponse.phone;
    
        // Add event listener to "Save Changes" button
        const saveChangesBtn = modal.querySelector('.modal-footer .btn-primary');
        saveChangesBtn.addEventListener('click', () => {
    
            // Show the loader
            showLoader();
    
            // Retrieve updated values from the form fields
            const id = myResponse.id;
    
            // Send updated data to the API
            const apiUrl = 'http://13.238.255.97:8081/api/delete/drivers/' + id;
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
                alert('Driver deleted successfully');
    
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

    function openDocumentPopup(myResponse, index) {
        // Access the Bootstrap modal element
        const modal = document.getElementById('openDriverDeletePopup');
    
        var viewModalLabelInput = modal.querySelector('#viewDriverModalLabel');
        viewModalLabelInput.innerHTML = "Driver Details: #" + (index + 1);
    
        // Update the modal content with Driver details
        const driverLicenseImage = modal.querySelector('#driverLicenseImage');

        console.log(myResponse.driver_licence_image);
        console.log("http://13.238.255.97:8081/" + myResponse.driver_licence_image);

        if(myResponse.driver_licence_image == null || myResponse.driver_licence_image == '') {
            driverLicenseImage.src = "images/dl.png";
        } else {
            driverLicenseImage.src = "http://13.238.255.97:8081/" + myResponse.driver_licence_image;
        }
        
    
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