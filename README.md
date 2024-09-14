### To run this project, please adhere to the following instructions: 

#### Initial Project Setup

1. Clone the project: Github provides multiples options on cloning projects. Choose one of these options so you can have a copy of this project on your local machine.

2. Once you have a copy of the project, open a terminal in your favorite IDE and run `npm install`. This installs all the specific version of packages used for this project. Ensure you have [node](https://nodejs.org/en/download/package-manager) installed for this step to work.

3. Rename `.env.sample` to `.env`. The sample environment file provided with the project has to be renamed for it to work properly. This file comes with predefined variables required for the project to run smoothly.

4. Ensure you have [mongodb](https://www.mongodb.com/docs/manual/installation/) installed and running as a service in the background.
5. Run `npm run start` in the terminal
6. Once you see `Connection established to database` in your console. The app is up and running succeessfully.
7. Click the [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/11694526-303b2215-366e-4cc0-ba1b-d452382de250?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D11694526-303b2215-366e-4cc0-ba1b-d452382de250%26entityType%3Dcollection%26workspaceId%3D904f0982-fc55-43ea-97e0-bd8592d5b715) button to open the collection with which you can interact with the app in Postman.
8. Admin is automatically created and only `admin` can access the CRUD endpoints on `users`.

#### Run Unit Tests
* Rename the `.env.test.sample` file to `.env.test`. This file contains credentials to run the app in test mode. Basically, creating another database for data storage and running the application on a port separate from the `Initial Project Setup` phase.
* Open a terminal and run `npm run test`. This automatically spins up the server on the port specified in `.env.test` and runs the unit tests in the `tests` directory. You should see the status of these tests in your console.

#### Project Routes
* Authentication 
  1. /auth/admin: Logs the admin in to the server
  2. /auth/user: Logs a user in to the server
   
* Admin-proctected Routes
  1. /user: A GET request to this endpoint returns a list of the users registered
  2. /user: A POST request to this endpoint with a request body that conforms to the user schema registers a new user
  3. /user/\:id: A PUT request to this endpoint with a request body containing the field to be updated changes the old value to the newly specified value
  4. /user/\:id: A GET request fetches only one user with the specified id
  5. /user/exists: A GET request with the search parameter passed in as a query param on the URL checks if a user with the specified email is registered


The stack used for the assessment task is **Nodejs**, **Express**, **Typescript** and **MongoDB**. I used `typedi` to inject dependencies as needed. The principle of Seperation of Concern was used to keep code as modular and readable as possible, with each file having a single responsibility.