# Airtribe Task Management

The Task Management Project is a Node.js Express-based web application that helps users manage and organize their tasks efficiently. It provides a user-friendly interface to create, update, and track tasks, allowing individuals or teams to stay organized and focused on their goals. This *README* provides an overview of the project, installation instructions, usage guidelines, and other relevant details.



## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AkhilVN/Task-Manager.git

2. Navigate to the project directory:
   ```bash
    cd Task-Manager/

3. Install the dependencies:
   ```bash
    npm install / yarn install

4. Start the application:
   ```bash
    npm run start / yarn start

## Features
**Task Retrieve**: Users can retrieve all tasks or specific tasks.

**Task Creation:** Users can create new tasks by providing a title, description, is_completed, and its priority level.

**Task Update:** Users can update existing tasks by modifying their title, description, is_completed, status, or its priority level.

**Task Deletion:** Users can delete tasks they no longer need, removing them from the system.

**Task Filtering:** Users can filter tasks based on completion status and priority label.

**Task Sorting:** Users can retrieve the tasks based on their created date sort.


## Usage

1. Create a new task with POST /tasks api by passing required request body.
2. Fetch the tasks with GET /tasks api.
3. Update the tasks with PUT /tasks/:id api.
4. Delete the tasks with DELETE /tasks/:id api.
5. Create multiple tasks with step 1.
6. Fetch a task with specific id with GET /tasks/:id api.
7. Filter or sort the tasks using GET /tasks api by passing query params as sort and isCompleted. 
8. Filter the tasks with its priority level with GET /tasks/priority/:priorityLevel.

## Dependencies
**-   Node.js**

**-   Express.js**

**-   uuid**

## Contributing
Contributions to the Task Management Project are welcome. To contribute, follow these steps:

   - Fork the repository.
   - Create a new branch for your feature or bug fix.
   - Make your modifications and commit them.
   - Push your branch to your forked repository.
   - Submit a pull request to the main repository.
   
   Please follow the project's code style guidelines and ensure your contributions are well-documented    and thoroughly tested.

## License
Airtribe Assignment License



*Feel free to customize the structure and content of the `README.md` file based on the specific details of your Node.js Express project. Add sections or information that you think are important and relevant for users or contributors to understand and use your project effectively.*