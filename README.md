# Getting Started

To run this project locally on your machine, you need to set up the necessary envirnoment- This ReadMe will walk you through on how to configure and set up your development envirnoment.

Prerequistes:
1. Node.js: Ensure you've got Node installed on your machine.
2. .env files (we'll go through this.)
3. Ensure you have the required database server installed and running. (PostgreSQL)
4. Have the database username, password and host information ready.

# More information on how to set up your database locally can be found here: https://www.postgresql.org/

# Live Version

Explore the hosted API:
[NC News API on Render](https://nc-news-f67l.onrender.com)

# Steps to run the project locally

1. Clone the repo (git clone <repo_url>)
2. Inside your development envirnoment (VS for example)- install all dependencies: npm install

# Envirnoment Setup

To run the project locally, you'll need to configure environment variables in two .env files.

    Create the .env files:
        .env.development
        .env.test

Add the following variables to the respective files:

For .env.development:
PGDATABASE=nc_news

For .env.test:
PGDATABASE=nc_news_test

These files ensure the correct database is used for development and testing environments.

# Set up the DB

Create and seed the local databases with the following commands:
npm run setup-dbs
npm run seed

# Run the tests!

Verify everything is working by running the tests!
You can do this by running the command:
npm test



# Aditional notes

And there you go! You're all set up! Be sure to run your setup.sql (npm run setup-dbs) and everything's set up!