# Starting and GitHub
- Clone
```bash
git clone <url>
```

- Create a new branch so you dont mess up the main code
```bash
git checkout -B yourName/functionalityName

Ex:
git checkhout -B bekhoung/calendar
```

- Run project
```js
npm run start
Control + C // to stop server
```

- Create `.env` and place
```bash
URI = "mongodb+srv://<username>:<password>@cluster0.qrcxoct.mongodb.net/appTracker?retryWrites=true&w=majority"
```

- Open localhost on Chrome
```bash
http://localhost:5001/
```

- Push your changes to Github, only do this when you think your code works
- It is fine to push your changes, we can merge later with the main code if your code works
```bash
git push origin yourName/functionalityName
```




# Project Structure

## 1️⃣ /app.js
The main file of the project that has all settings for the app to work

## 2️⃣ /routes/home.js
Here functioanlities for `home` and `about` page

## 3️⃣ /routes/auth.js
Here we defined the routes that starts at `localhost:5001/auth`
- GET - localhost:5001/auth/register
	- Display the register page
- POST - localhost:5001/auth/register
	- Register user on the DB
- GET - localhost:5001/auth/login
	- Display the login page
- POST - localhost:5001/auth/login
	- Login user page

### /routeControllers/authController.js
Here are all the functionalities/functions for each GET, POST in `/routes/auth.js`
- I split the project for better organization
- In authControllers.js, I exported the functions using CommonJS module to `auth.js`

## 4️⃣ /routes/user.js
Here the routes that start at `localhost:5001/user`
- GET - localhost:5001/user/dashboard 
	- display HTML with all rows
- POST - localhost:5001/user/dashboard 
	- create and add row
- GET - localhost:5001/user/api/:id 
	- get single row and return json
- GET - localhost:5001/user/api/v2/:id 
	- get all rows and return json
- PUT - localhost:5001/user/api/edit/:id 
	- update single row in DB
- DELETE - localhost:5001/user/api/delete/:id 
	- delete single row in DB

### /routeControllers/userController.js
- I split the project
- From here, I exported the functions to `user.js`

## 5️⃣ /views
- All the HTML templates
- /views/partials are the HTML that will repeated in the other HTML templates

## 6️⃣ /public
Here are the static files for the client-side. All other files that are not inside of this folder are called **server-side**.
- Client-side because these files are public and can seen with Chrome inspect. 
- Server-side because these files are hidden ( only us can see these files )

**IMPORTANT**: 
- To debug code `client-side` files, use `console.log()` and the output will be shown in Chrome INSPECT
- To debug code `server-side` files, use `console.log()` and it will appear in your TERMINAL

### /public/css
- Here all the css for specific HTML template

### /public/js
- Here are the functionalities of the WebApp
- The main functionalities should be:
	- Form.js : Jose Valdivia
	- Calendar.js : Be Khoung
	- Automata.js : Arushi
- Secondary functionalities
	- dataTable.js - functionalities for the table in /dashboard
	- form.js - functionality for submitting forms
	- sticky.js - functioanlity for the navbar
	- theme.js - functionality for the dark/light theme

### /public/images
- Static images file  that are needed for this project

## 7️⃣ /middlewares
Here are the functionalities that will be run before running `/routeControllers`
These are useful to check user-login and form-input before going to the next step

### /middlewares/formValidator.js
- Used `express-validator` to validate the user input in the form such as
	- no empty string
	- no scripts, malicious code
	- etc

### /middlewares/loginValidator.js
- This check for the user to be logged in before accessing `localhost/user/...`
- Exported this function and used in `/routes/user.js`
- Example:
	- This checks that the user is logged in before reading Rows from DB
	- router.get('/dashboard', loginValidator, readRows)

## 8️⃣ /database
- db.js - connection to MongoDB
- Table.js - the structure of the data from each `internship application`. In the code, I use the name `row` to reference this. Each `row` has:
	- user - this is not displayed on the WebApp but used for referencing to which user belongs to this `row`
	- company
	- title
	- link
	- date
	- location
	- status
	- notes
- User.js - the structure of an `user`
	- username
	- password
	- email

# Useful Functions

- Get current logged-in User's and its properties (user session):
```js
req.user  //returns current logged-in user that has two properties: id, username
req.user.id,
req.user.username
```


## Getting IDs

[](../Assets/20230428235343.png)

- In the HTML, each Row has its own ID from the DB
- Notice it is the same ID: `644ab...3df` and it is store in the `<tr>` tag, specifically in the id attirbute

[](../Assets/20230428235553.png)

- You can get all IDs ( each row ID) from the table and storing in a Array to later do something with it
```js
const trElements = document.querySelectorAll('tr');
const ids = [];
trElements.forEach( (tr) => { 
  const id = paragraph.getAttribute('id'); 
  ids.push(id); 
});
```


## Fetching data in our API
- Always use async-await when fetching
- ID reprensents the `_id` of a `row` in the DB.
- In this picture, `_id` is `644ab...3df` that represents ID

- Fetch Single Row by ID -> returns a JSON with one element `row` from DB
```js
const url1 = `http://localhost:5001/user/api/${rowID}`
const row = await fetch(url1,
  {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .catch( err => console.error(err))
```

- Fetch All Rows by ID -> returns a JSON with all `row`'s that belongs to the User
```js
const url2 = `http://localhost:5001/user/api/v2/${rowID}`
const rows = await fetch(url2,
  {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .catch( err => console.error(err))
```

- Fetch to edit a single Row by ID -> returns back the UPDATED `row` in JSON
- Refer to /public/js/form.js/saveAndEdit() on how I did it
```js
const url3 = `http://localhost:5001/user/api/edit/${rowID}`
const newDataRow = {
	company: companyInput.value,
	title: titleInput.value,
	status: statusSelect.value,
	link: linkInput.value,
	date: dateInput.value,
	location: locationInput.value,
	notes: notesTextArea.value
}

const json = await fetch(url2,
  {
     method: 'PUT',
     body: JSON.stringify(newDataRow),
     headers: { 'Content-Type': 'application/json' }
  })
  .then( response => response.json())
  .catch( err => console.error(err))
```

- Fetch to delete a single Row by ID -> returns back the DELETED `row` in JSON
- Refer to /public.js/form.js/saveAndDelete() on how I did it
```js
const url4 = `http://localhost:5001/user/api/delete/${rowID}`
const json = await fetch(url4,
  {
     method: 'DELETE',
     headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .catch( err => console.error(err))
```
