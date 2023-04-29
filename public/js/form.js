// Querying the add button
const addButton = document.querySelector('#add-btn')
const alertContainer = document.querySelector('.alert-container')

// HIDDEN FORM - Getting Input Fields from the 
const formContainer = document.querySelector('#form-container')
const form = document.querySelector('form')
const cardTitle = formContainer.querySelector('.card-title')
const companyInput = formContainer.querySelector('#company')
const titleInput = formContainer.querySelector('#title')
const statusSelect = formContainer.querySelector('#status')
const linkInput = formContainer.querySelector('#link')
const dateInput = formContainer.querySelector('#date')
const locationInput = formContainer.querySelector('#location')
const notesTextArea = formContainer.querySelector('#notes')
let saveButton = formContainer.querySelector('button[type="submit"]')
let copySaveButton = saveButton.cloneNode(true) // creates a deep copy of `saveButton`
let divSaveButton = formContainer.querySelector('.d-grid') // parent div of `saveButton`

// Querying the empty div that opaques the background when form opens
const overlay = document.querySelector('#overlay')

// HIDDEN PROMPT - getting fields
const promptContainer = document.querySelector('#prompt-container')
let deleteButton = promptContainer.querySelector('#btn-delete')
let copyDeleteButton = deleteButton.cloneNode(true) // creates a deep copy of `saveButton`
let divDeleteButton = promptContainer.querySelector('#div-delete') // parent div of `saveButton`


// -------------------------- JS Front-end -------------------------- //

// This function closes the form when user clicks on `X` button
function closeForm() {
	formContainer.style.display = 'none'
	promptContainer.style.display = 'none'
	overlay.style.display = 'none'
}


// Hidden Form - Add application
addButton.addEventListener('click', () => {
	// Reset Form to default (since `editApplication` used this form and modified its contents)
	cardTitle.textContent = 'Add Application';
	companyInput.value = "";
	titleInput.value = "";
	statusSelect.value = "";
	linkInput.value = "";
	dateInput.value = "";
	locationInput.value = "";
	notesTextArea.textContent = "";

	// Since `editAplication` may add an eventListener to `saveButton`
	// Reset `saveButton` with no EventListeners:
	// 		replace `saveButton` with a deep copy with no EventListeners
	saveButton = formContainer.querySelector('button[type="submit"]')
	copySaveButton = saveButton.cloneNode(true) // creates a deep copy of `saveButton`
	divSaveButton = formContainer.querySelector('.d-grid') // parent div of `saveButton`
	divSaveButton.replaceChild(copySaveButton, saveButton)

	// Add eventListener on `save` button to submit form
	copySaveButton.addEventListener('click', (e) => {
		e.preventDefault();
		form.submit();
	})

	// Show hidden form
	formContainer.style.display = 'block'
	overlay.style.display = 'block'

	// Set the focus to the first input field in the form
	formContainer.querySelector('input').focus()
})


// Hidden Form - Edit Application
// 		Fetch our DB and get the row info based on Row ID
// 		Modifies the `Hidden Form` and display it
async function editApplication(rowID) {
	
	const url = `http://localhost:5001/user/api/${rowID}`
	const rowData = await fetch(url, 
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
	.then(response => response.json())
	.catch( err =>  console.error(err))

	// Modify Form fields before opening it
	cardTitle.textContent = 'Edit Application';
	companyInput.value = rowData.company;
	titleInput.value = rowData.title;
	statusSelect.value = rowData.status;
	linkInput.value = rowData.link;
	dateInput.value = rowData.date;
	locationInput.value = rowData.location;
	notesTextArea.textContent = rowData.notes;

	// Reset `saveButton` with no EventListeners:
	saveButton = formContainer.querySelector('button[type="submit"]')
	copySaveButton = saveButton.cloneNode(true) // creates a deep copy of `saveButton`
	divSaveButton = formContainer.querySelector('.d-grid') // parent div of `saveButton`
	divSaveButton.replaceChild(copySaveButton, saveButton)

	// Add eventListener on the new `save` button to call `saveAndEdit`
	copySaveButton.addEventListener('click', function(event) {
		saveAndEdit(event,rowID)
	})

	// Show hidden form
	formContainer.style.display = 'block'
	overlay.style.display = 'block'
	
}

// Fetch PUT - edits the Row in our DB
async function saveAndEdit(event, rowID) {

	event.preventDefault()
	const newDataRow = {
		company: companyInput.value,
		title: titleInput.value,
		status: statusSelect.value,
		link: linkInput.value,
		date: dateInput.value,
		location: locationInput.value,
		notes: notesTextArea.value
	}

	const url = `http://localhost:5001/user/api/edit/${rowID}`


	const response = await fetch(url, {
		method: "PUT",
		body: JSON.stringify(newDataRow),
		headers: {
			"Content-Type": "application/json"
		}
	}).catch( e => {
		throw new Error(`UPS, COULDNT UPDATE IN OUR DB: ${e}`)
	})

	// If everything goes well, 
	// it means that the row has been updated in the DB
	// Then update the row in the front-end
	// Note: we dont need to get the json since it's the same as `newDataRow`
	// Note: Notice we dont reload page anymore.. :`)
	if(response.ok) {
		// If response is ok, edit row
		
		//1. Find tr by rowID
		const row = document.querySelector(`tr[id="${rowID}"]`)

		// get row's fields
		const company = row.querySelector('#company')
		const title = row.querySelector('#title')
		const status = row.querySelector('#status')
		const link = row.querySelector('#link')
		const date = row.querySelector('#date')
		const location = row.querySelector('#location')
		const notes = row.querySelector('#notes')
	
		//2. Modify Row according to the newDataRow
		company.textContent = newDataRow.company
		title.textContent = newDataRow.title
		// modfify class badges (for Bootstrap) and text content
		if (newDataRow.status === 'Submitted') { 
			status.className = "badge badge-warning rounded-pill d-inline"
			status.textContent = newDataRow.status
		} else if (newDataRow.status === 'Reviewing') {
			status.className = "badge badge-primary rounded-pill d-inline"
			status.textContent = newDataRow.status
		} else if (newDataRow.status === 'Accepted') {
			status.className = "badge badge-success rounded-pill d-inline"
			status.textContent = newDataRow.status
		} if (newDataRow.status === 'Rejected') {
			status.className = "badge badge-danger rounded-pill d-inline"
			status.textContent = newDataRow.status
		}
		link.textContent = newDataRow.link
		date.textContent = newDataRow.date
		location.textContent = newDataRow.location
		notes.textContent = newDataRow.notes
		
		//3. Close Form
		closeForm()
	}
}


// PROMPT FOR DELETION - sets eventListener to `delete` button
async function deleteRow(rowID){
	// Show the delete prompt
	promptContainer.style.display = 'block'
	overlay.style.display = 'block'

	// Reset `deleteButton` with no EventListeners:
	deleteButton = promptContainer.querySelector('#btn-delete')
	copyDeleteButton = deleteButton.cloneNode(true)
	divDeleteButton = promptContainer.querySelector('#div-delete')
	divDeleteButton.replaceChild(copyDeleteButton, deleteButton)

	// Add eventListener on `delete` button to delete
	copyDeleteButton.addEventListener('click', function(){
		saveAndDelete(rowID)
	})
}

// FETCH DELETE - delete row in the DB
async function saveAndDelete(rowID) {
	// FETCH DELETE, returns the data deleted
	const url = `http://localhost:5001/user/api/delete/${rowID}`

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		
		//  IF FAILED Status 300-600
		if (!response.ok) {
			const err = await response.json()
			if (response.status === 404) {
				window.location.href = '/404' // redirect to 404 page
			} else if(response.status === 401) {
				// Create and display alert-div
				alertContainer.innerHTML = `            
				<div class="alert alert-danger" role="alert">
					<i class="bi bi-slash-circle"></i>
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					${err.error}
				</div>`
			}
		}
		
		// If SUCCESSFULL Status 200-299, delete the entire <tr> by its rowID
		const rowToRemove = document.getElementById(rowID);
		if (rowToRemove) {
			rowToRemove.parentNode.removeChild(rowToRemove);

			// Display alert for remove successful
			alertContainer.innerHTML = `            
			<div class="alert alert-success" role="alert">
				<i class="bi bi-check-circle"></i>
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				Application deleted succesfully 🙈
			</div>`
		}

		// close prompt
		closeForm()

	} catch (error) { // catch errors from DB methods
		const json = await response.json()
		// If any error, create and display div-alert	
		const alertContainer = document.querySelector('alert-container')
		alertContainer.innerHTML = `            
		<div class="alert alert-danger" role="alert">
			<i class="bi bi-slash-circle"></i>
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			${json.error}
		</div>`
	}	
}