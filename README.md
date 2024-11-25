# Getting Started

To run this project locally on your machine, you need to set up the necessary envirnoment- This ReadMe will walk you through on how to configure and set up your development envirnoment.

Prerequistes:
1. Node.js: Ensure you've got Node installed on your machine.
2. .env files (we'll go through this.)
3. Ensure you have the required database server installed and running. (PostgreSQL)
4. Have the database username, password and host information ready.

# More information on how to set up your database locally can be found here: https://www.postgresql.org/

# Steps to run the project locally

1. Clone the repo (git clone <repo_url>)
2. Inside your development envirnoment (VS for example)- install all dependencies: npm install

# Envirnoment Setup
The .env files are ignored by Git for security, they're not included when cloning the repository. To run the project locally, you must manually create the following
.env files in the ROOT directory of your project:

1. .env.development
2. .env.test

In those files add: PGDATABASE="Database Name"

Be sure to look in db/setup.sql to find the corresponding database name. Remove the quotations and add the Database name found in those files.

# Aditional notes

And there you go! You're all set up! Be sure to run your setup.sql (npm run setup-dbs) and everything's set up!