import {
  getValidationFunction,
  isArray,
  isBoolean,
  isDate,
  isDateString,
  isNumber,
  isString,
  isTimestamp,
  validateEnum,
  validateRequired
} from './validators.js'

const middleware = (schema, attribute) =>
  (req, res, next) =>
    sanitize(schema, attribute, req)

const sanitize = (schemaTree, req, reqAttribute, next) => {
  for (const attribute in schemaTree) {
    if (typeof schemaTree[attribute] === 'object') {
      // Handle object fields
      for (const subAttribute in schemaTree[attribute]) {
        const subSchemaAttribute = schemaTree[attribute][subAttribute]
        const paramReceived =
            req[reqAttribute] &&
            req[reqAttribute][attribute] &&
            req[reqAttribute][attribute][subAttribute]
        validateElementOfSchema(subSchemaAttribute, paramReceived)
      }
    } else {
      // Handle simple fields
      const paramReceived = req[reqAttribute] && req[reqAttribute][attribute]
      validateElementOfSchema(schemaTree[attribute], paramReceived)
    }
  }
    
  next()
}
    
const validateElementOfSchema = (schemaAttribute, paramReceived) => {
  if (schemaAttribute.required) {
    validateRequired(paramReceived, schemaAttribute)
  }
    
  if (schemaAttribute.enum) {
    validateEnum(paramReceived, schemaAttribute, schemaAttribute.enum)
  }
    
  switch (schemaAttribute.type) {
  case String:
    isString(schemaAttribute, paramReceived)
    break
  case Number:
    isNumber(schemaAttribute, paramReceived)
    break
  case Boolean:
    isBoolean(paramReceived)
    break
  case Array:
    isArray(schemaAttribute, paramReceived)
    break
  case Date:
    isDate(paramReceived)
    break
  case 'DateString':
    isDateString(paramReceived)
    break
  case 'Timestamp':
    isTimestamp(paramReceived)
    break
  case 'validate':
    getValidationFunction(schemaAttribute, 'validate')
    break
  default:
    break
  }
}

module.exports = { middleware }