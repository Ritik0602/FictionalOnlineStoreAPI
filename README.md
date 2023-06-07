# Fictional Online Store API

This repository contains a RESTful API for an online store that specializes in selling electronic products.

## Requirements

To run this API, you need to have the following software installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v3.6 or higher)

## Getting Started

Follow the steps below to get the API up and running on your local machine:

1. Clone the repository:

   ```bash
   $ git clone https://github.com/mishra2019/Online-Store-REST-API.git

   ```

2. Install the dependencies:
   $ cd online-store-api
   $ npm install

3.Set up the environment variables:

Create a `.env` file in the project root directory with the following content:
MONGODB_URI=<your-mongodb-connection-string>
SECRET_KEY=<your-jwt-secret-key>
Make sure to replace `<your-mongodb-connection-string>` with the actual connection string for your MongoDB database and `<your-jwt-secret-key>` with a secret key of your choice for JWT token encryption.

4. Start the server:
   $ npm start

The server will start listening on `http://localhost:8080`.# Online Store REST API
