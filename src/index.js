import {
  isArray,
  isBoolean,
  isDate,
  isDecimal128,
  isNumber,
  isString,
  isTimestamp,
  isValidObjectId,
  isValidMap,
  isValidBuffer
} from './validators.js'

const middleware = (schemaTree, data) => sanitize(schemaTree, data)

const sanitize = (schemaTree, data) => Object.keys(schemaTree).forEach(key => {
  validateElementOfSchema(schemaTree[key], data[key])  
  if (typeof value === 'object' && data[key] !== null) {
    // if schemaTree has the attribute, validate it
    validateElementOfSchema(schemaTree[key], data[key])
    sanitize(schemaTree[key], data[key])
  }
})

const validateElementOfSchema = (schemaAttribute, paramReceived) => {    
  switch (schemaAttribute.type) {
  case String:
    isString(schemaAttribute, paramReceived)
    break
  case Number:
    isNumber(schemaAttribute, paramReceived)
    break
  case Boolean:
    isBoolean(schemaAttribute, paramReceived)
    break
  case Array:
    isArray(schemaAttribute, paramReceived)
    break
  case Date:
    isDate(schemaAttribute, paramReceived)
    break
  case 'Map':
    isValidMap(schemaAttribute, paramReceived)
    break
  case 'Timestamp':
    isTimestamp(schemaAttribute, paramReceived)
    break
  case 'Decimal128':
    isDecimal128(schemaAttribute, paramReceived)
    break
  case 'ObjectId':
    isValidObjectId(schemaAttribute, paramReceived)
    break
  case 'Buffer':
    isValidBuffer(schemaAttribute, paramReceived)
    break
  default:
    break
  }
}

module.exports = { middleware }