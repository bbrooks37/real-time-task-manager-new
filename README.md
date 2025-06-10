Real-time Task Manager
A full-stack, real-time task management application built with Node.js (Express, Socket.IO) for the backend, PostgreSQL for the database, and vanilla JavaScript/HTML/CSS (with Tailwind CSS) for the frontend. This application features user authentication, project and task management, tags, activity logging, notifications, and real-time updates across connected clients.

✨ Features
User Authentication: Secure registration and login.

Project Management: Create, view, update, and soft-delete projects.

Task Management: Create, view, update, and soft-delete tasks within projects.

Task Assignment: Assign tasks to other users.

Tags: Create and assign multiple tags to tasks for better organization.

Real-time Updates: Socket.IO ensures instant updates across all connected clients (e.g., task creation, updates, deletions).

Notifications: Users receive real-time notifications for assigned tasks and other relevant activities.

Activity Logging: Backend logs significant user and system activities.

Responsive UI: Designed with Tailwind CSS for adaptability across devices.

PostgreSQL Database: Robust and reliable data storage.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js & npm: Download and Install Node.js (npm is included).

PostgreSQL: Download and Install PostgreSQL

You'll need psql command-line tool.

Ensure your PostgreSQL server is running (e.g., sudo service postgresql start on Linux).

⬇️ Cloning the Repository
git clone https://github.com/bbrooks37/real-time-task-manager-new.git
cd real-time-task-manager-new

🗄️ Backend Setup (Server)
Navigate to the server directory:

cd server

Install backend dependencies:

npm install

Configure Environment Variables:
Create a .env file in the server/ directory. This file will hold your database credentials and JWT secret.

# server/.env

# Generate a strong, random string for your JWT secret.
# Example (run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in terminal):
JWT_SECRET=your_super_secret_jwt_key_here

# PostgreSQL Database URL
# Replace 'patpa' with your PostgreSQL username.
# Replace 'your_chosen_password_for_patpa' with the password you set for this user.
# Replace 'task_manager_db' with your database name.
# IMPORTANT: If your password contains '$', it MUST be URL-encoded as %24 (e.g., 'pass$$' becomes 'pass%24%24').
DATABASE_URL=postgresql://patpa:your_chosen_password_for_patpa@localhost:5432/task_manager_db

Database Setup (PostgreSQL):
You need to set up your PostgreSQL database and apply the schema.

Connect as postgres superuser (if patpa doesn't exist yet or has permission issues):

psql -U postgres -d postgres

(Enter postgres password when prompted. If it fails due to peer authentication, you may need to temporarily edit your pg_hba.conf file: change peer to md5 or trust for local postgres connections, then restart PostgreSQL service, set a password for postgres in psql using ALTER USER postgres WITH PASSWORD 'new_password';, and then revert pg_hba.conf back to md5 and restart.)

Create the patpa database role (user) and set its password (if it doesn't exist):
Once in the psql> prompt as postgres:

CREATE ROLE patpa WITH LOGIN PASSWORD 'your_chosen_password_for_patpa' CREATEDB;
\q

(Replace your_chosen_password_for_patpa with a strong password for patpa.)

Drop and Recreate Your Database (owned by patpa):
This ensures patpa has full control. This will delete all existing data in task_manager_db!
Still in the real-time-task-manager root directory:

psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS task_manager_db;"
psql -U postgres -d postgres -c "CREATE DATABASE task_manager_db OWNER patpa;"

(Enter postgres password for the first command, then patpa password for the second.)

Apply the Database Schema:
This command will create all the necessary tables and seed initial data.

cat server/schema.sql | psql -U patpa -d task_manager_db

(Enter patpa password when prompted.)
You should see CREATE TABLE, CREATE INDEX, and INSERT messages.

Start the Backend Server:
From the server/ directory:

npm start

You should see Server running on port 5000 and Database connection successful. Keep this terminal running.

🌐 Frontend Setup (Client)
Open a new terminal window (keep the backend terminal running).

Navigate to the client directory:

cd ../client

Install frontend dependencies:

npm install

Configure Frontend Environment Variables:
Create a .env.development file in the client/ directory:

# client/.env.development
API_BASE_URL_DEV=http://localhost:5000/api

(This tells the frontend where to find your local backend API.)

Start the Frontend Development Server:
From the client/ directory:

npm start

This will compile your frontend and open it in your default web browser, usually at http://localhost:8080/.

🎮 Playing Around
Once both the backend and frontend servers are running:

Access the application: Open your web browser and go to http://localhost:8080/.

Register a New User: Create a new account with a unique username and email.

Log In: Use your newly registered credentials to log in.

Create Projects: Start by creating a few projects.

Add Tasks: Within your projects, add tasks with details, due dates, priorities, and assign them to users (you'll need to register other users first to assign tasks to them).

Manage Tags: Create new tags and associate them with tasks.

Explore Real-time Updates: Open the application in two different browser windows or tabs, log in with different users, and observe how changes (e.g., creating a task, updating a task) in one window instantly reflect in the other.

Test Notifications: Assign a task to yourself or another registered user to see a notification appear.

💡 Troubleshooting & Extra Help
FATAL: Peer authentication failed for user "postgres": This indicates PostgreSQL's default authentication for local connections. Refer to the "Database Setup" section for modifying pg_hba.conf to use md5 authentication. Remember to restart PostgreSQL after editing pg_hba.conf.

DATABASE_URL is not set: Ensure your server/.env file is correctly named .env (not .env.development or similar) in the server/ directory, and that dotenv.config() is at the very top of your server/server.js file.

Cannot find module '...' errors: Double-check relative paths in your require() statements in controller and utility files.

Route.get() requires a callback function: Verify that the function name you are importing in your route files (e.g., routes/notificationRoutes.js) exactly matches the name exported by its corresponding controller (e.g., controllers/notificationController.js).

password authentication failed for user "patpa": The password in your server/.env's DATABASE_URL does not match the password set in PostgreSQL for the patpa user. Connect as postgres (or another superuser) in psql and reset patpa's password using ALTER USER patpa WITH PASSWORD 'new_password';. Remember to URL-encode special characters in the DATABASE_URL.

npm install errors: Ensure your Node.js and npm versions are up to date. Delete node_modules and package-lock.json in both client and server directories and run npm install again.

Soft Deletion: Projects, tasks, and tags are soft-deleted (is_deleted flag set to TRUE) rather than permanently removed. This means they might still exist in the database but are filtered from regular views. Only admins can potentially recover or view soft-deleted items (though the current UI doesn't explicitly expose this for regular users).

Frontend npm start not opening browser: Check your client/webpack.config.js for open: true under devServer. If it doesn't open, manually navigate to http://localhost:8080/.

Enjoy exploring the Real-time Task Manager!

🤝 Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests.
