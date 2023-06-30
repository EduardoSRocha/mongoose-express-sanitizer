<h1 align="center"> mongoose-express-sanitizer </h1>

<p align="center">
  <img alt="Static Badge" src="https://badge.fury.io/js/mongoose-express-sanitizer.svg">
</p>

## About the Library

"mongoose-express-sanitizer" is a library that validates and sanitizes Express request parameters (queries, params, body, headers) based on the Mongoose schema.tree. It ensures that the received data adheres to the defined schema, improving security and maintaining data integrity. By inspecting the schema properties, it validates required fields, checks for valid enum values, and enforces min/max value limits. The library helps prevent security vulnerabilities and simplifies the validation and sanitization process, ensuring that only valid data is processed by the server.


## How to Contribute

To contribute to the "mongoose-express-sanitizer" library, follow these steps:

- Fork the repository on GitHub.
- Make your desired changes and improvements.
- Write tests to ensure the correctness of your changes.
- Submit a pull request with your modifications.

We appreciate any contributions, including bug reports, feature requests, documentation improvements, and code changes.


## Objective

The objective of the "mongoose-express-sanitizer" library is to provide sanitization and validation facilities to check and filter the parameters of an Express request (queries, params, body, and/or headers) based on the Mongoose schema.tree definition.

Using this library, you can ensure that data received from an Express request meets the requirements defined by the Mongoose schema. It simplifies the validation and sanitization process, helping to maintain the integrity and consistency of data received by the server.

By using Mongoose's "schema.tree", the library is able to inspect the properties and types defined for each field in the schema, allowing validation to be performed according to the specified settings. This includes checking that fields are required, have valid enumeration values, meet minimum and maximum value thresholds, and more.

By sanitizing and validating Express request parameters against Mongoose's schema.tree, the library helps prevent potential security vulnerabilities such as malicious code injection or invalid data that could compromise the integrity or operation of the server.

In short, "mongoose-express-sanitizer" simplifies the process of validating and sanitizing the parameters of an Express request using the schema defined by Mongoose, ensuring that only valid and expected data is processed by the server.

## Installation

To install the library, use npm:

```sh
$ npm install --save mongoose-express-sanitizer
```

## Get Started

Ready to contribute? Check out our contribution guidelines and code of conduct to get started. We look forward to your contributions!

If you have any questions or need assistance, feel free to reach out to us. Thank you for considering contributing to the "mongoose-express-sanitizer" library!

## Usage

To use the library, import it into your project:

```js
const sanitizer = require('mongoose-express-sanitizer');
```

Then, use the library as middleware in your Express application:

The library will then validate and sanitize the parameters of all requests received by the server.

## Supported Mongoose Types 

The library supports the following Mongoose types:

- **String**: The library will validate and sanitize the string based on the following properties: required, minlength, maxlength and enum.
- **Number**: The library will validate and sanitize the number based on the following properties: required, min, max.
- **Date**: The library will validate and sanitize the date based on the following properties: required, min, max.
- **Boolean**: The library will validate and sanitize the boolean based on the following properties: required.
- **Array**: The library will validate and sanitize the array based on the following properties: required, min, max.
- **Object**: The library will validate and sanitize the object based on the following properties: required, min, max.
- **ObjectId**: The library will validate and sanitize the ObjectId based on the following properties: required, min, max.
- **Buffer**: The library will validate and sanitize the buffer based on the following properties: required, min, max.
- **Decimal128**: The library will validate and sanitize the decimal128 based on the following properties: required, min, max.
- **Map**: The library will validate and sanitize the map based on the following properties: required, min, max.
  
** Support nested schemas.
** Support schema.tree with nested objects.

## Supported Mongoose Types in development

- **BigInt**: The library will validate and sanitize the bigint based on the following properties: required, min, max.

## Options

The library accepts the following options:

- **schema.tree**: The Mongoose schema to be used for validation and sanitization. If not specified, the library will attempt to use the schema defined for the model associated with the request route.
- **req[.query|.params|.body|.headers]**: The Express request parameters to be validated and sanitized. If not specified, the library will attempt to use the parameters associated with the request route.

## Examples

The following example demonstrate how to use the library.

In this example, the library is used to validate and sanitize the parameters of an Express request using the schema defined for the model associated with the request route.

```js
import mongoose from 'mongoose'
import express from 'express'
import { body, queries, params, headers } from 'mongoose-express-sanitizer'

// Create the Express application.
const app = express()

// Connect to the database.
mongoose.connect('mongodb://localhost:27017/test')

// Define the Mongoose schema.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1024,
  },
})

// Define the Mongoose model.

const User = mongoose.model('User', userSchema);

const { name, email, password } = User.schema.tree

// Define the Express route.

app.post('/users', 
  (req) => body({ conceptString, conceptNumber, conceptData }, req),
  async (req, res) => {
    // Create a new user.
    const user = new User(req.body)

    // Save the user.
    await user.save()

    // Return the user.
    res.send(user)
  })

// Start the server.

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## License

This project uses the following license: [MIT](Eduardo Rocha).

## Contact

If you want to contact me you can reach me at github.com/EddieUFSM.

## Acknowledgements

This library was inspired by the following projects:

- [express-sanitizer]
- [bodymen]
- [querymen]
