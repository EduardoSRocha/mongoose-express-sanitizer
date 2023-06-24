# mongoose-express-sanitizer [![NPM version](https://badge.fury.io/js/mongoose-express-sanitizer.svg)](https://npmjs.org/package/mongoose-express-sanitizer) [![Build Status](https://travis-ci.org/EddieUFSM/mongoose-express-sanitizer.svg?branch=master)](https://travis-ci.org/EddieUFSM/mongoose-express-sanitizer)

> "mongoose-express-sanitizer" is a library that validates and sanitizes Express request parameters (queries, params, body, headers) based on the Mongoose schema.tree. It ensures that the received data adheres to the defined schema, improving security and maintaining data integrity. By inspecting the schema properties, it validates required fields, checks for valid enum values, and enforces min/max value limits. The library helps prevent security vulnerabilities and simplifies the validation and sanitization process, ensuring that only valid data is processed by the server.

## Objective

The "mongoose-express-sanitizer" library is a tool that provides sanitization and validation facilities to check and filter the parameters of an Express request (queries, params, body and/or headers) based on the Mongoose schema.tree definition .

Using this library, you can ensure that data received from an Express request meets the requirements defined by the Mongoose schema. It simplifies the validation and sanitization process, helping to maintain the integrity and consistency of data received by the server.

By using Mongoose's "schema.tree", the library is able to inspect the properties and types defined for each field in the schema, allowing validation to be performed according to the specified settings. This includes checking that fields are required, have valid enumeration values, meet minimum and maximum value thresholds, and more.

By sanitizing and validating Express request parameters against Mongoose's schema.tree, the library helps prevent potential security vulnerabilities such as malicious code injection or invalid data that could compromise the integrity or operation of the server.

In short, "mongoose-express-sanitizer" simplifies the process of validating and sanitizing the parameters of an Express request using the schema defined by Mongoose, ensuring that only valid and expected data is processed by the server.

## Installation

```sh
$ npm install --save mongoose-express-sanitizer
```

## Usage

```js
var mongooseExpressSanitizer = require('mongoose-express-sanitizer');
mongooseExpressSanitizer();
```

## License

MIT © [Eduardo da Silva Rocha]()
