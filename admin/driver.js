// Function to mask sensitive values
function maskValue(value) {
    const maskChar = '*'; // Character used for masking
    const visibleLength = 4; // Number of visible characters at the end
    const maskedLength = value.length - visibleLength;
    const maskedValue = maskChar.repeat(maskedLength) + value.slice(maskedLength);

    return maskedValue;
}

// Fetch data from the API
fetch('http://13.238.255.97:8081/api/getAll/drivers/list')
    .then(response => response.json())
    .then(data => {
        // Get the table body element
        const tableBody = document.querySelector('#driver-data-table');

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

                const vehicleCell = document.createElement('td');
                vehicleCell.textContent = response.vehicle_no;
                row.appendChild(vehicleCell);

                const dlCell = document.createElement('td');
                dlCell.textContent = response.drivers_licence;
                row.appendChild(dlCell);

                // Create a cell for the image
                const imageCell = document.createElement('td');

                // Create the image element
                const imageElement = document.createElement('img');
                imageElement.src = "http://13.238.255.97:8081/" + response.driver_licence_image;

                // Set any additional attributes or styles for the image if needed
                imageElement.setAttribute('alt', 'Document');
                imageElement.style.width = '100%';

                // Set up an event handler to handle image loading errors
                imageElement.onerror = () => {
                    // If the image fails to load (URL not found or empty), display a fallback image
                    imageElement.src = 'images/dl.png';
                    // You can use any valid image URL for the fallback image
                    // For example, you can use a local image file or another URL that points to a default image.
                };

                // Add onclick event to the image element
                imageElement.onclick = () => {
                    openDocumentPopup(response, index);
                    console.log("Image clicked!");
                };

                // Append the image element to the cell
                imageCell.appendChild(imageElement);

                // Append the cell to the row
                row.appendChild(imageCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = response.status;
                row.appendChild(statusCell);

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
        const modal = document.getElementById('openDriverDocumentPopup');
    
        var viewModalLabelInput = modal.querySelector('#viewDriverDocumentModal');
        viewModalLabelInput.innerHTML = "Driver Details: #" + (index + 1) + ' ' + myResponse.name;
    
        // Get the image element
        const imageElement = modal.querySelector('#driverLicenseImage');
    
        if (myResponse.driver_licence_image == null || myResponse.driver_licence_image == '') {
            // If the image is not available, set a default image
            imageElement.src = "images/dl.png";
        } else {
            // Set the image source to the provided URL
            imageElement.src = "http://13.238.255.97:8081/" + myResponse.driver_licence_image;
        }

        // Add event listener to "Save Changes" button
        const saveChangesBtn = modal.querySelector('.modal-footer .btn-primary');
        saveChangesBtn.addEventListener('click', () => {
    
            // // Show the loader
            // showLoader();
    
            // Retrieve updated values from the form fields
            const id = myResponse.id;
    
            // Send updated data to the API
            const apiUrl = 'http://13.238.255.97:8081/api/updateStatus/drivers/' + id;
            const data = {
                status: "Verified"
            };
            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(approvedDriver => {
                // Hide the loader
                // hideLoader();
    
                // Show an alert
                alert('Driver approved successfully');
    
                // Close the modal after updating the customer
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.hide();
    
                // Refresh the page after successful deletion
                location.reload();
            })
            .catch(error => {
                console.error('An error occurred while approving the driver:', error);
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