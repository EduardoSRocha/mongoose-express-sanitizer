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

import mongoose from 'mongoose'

const middleware = (schemaTree, data) => sanitize(schemaTree, data)

const sanitize = (schemaTree, data) => {
  Object.keys(schemaTree).forEach(key => {
    // if schemaTree[key] is an object
    if (typeof schemaTree[key] === 'object' && schemaTree[key] !== null) {
      // if schemaTree has the attribute, validate it
      if(schemaTree[key].required && !data[key]) throw {
        message: `The attribute ${key} is required.`,
        httpErrorCode: 400,
        internalErrorCode: 1001
      }
      // if data has the attribute, validate it
      if (data[key]){
        validateElementOfSchema(schemaTree[key], data[key])  
        if (typeof value === 'object' && data[key] !== null) {
          // if schemaTree has the attribute, validate it
          validateElementOfSchema(schemaTree[key], data[key])
          sanitize(schemaTree[key], data[key])
        }
      }
    }
  })
}

const sellectedAttributeType = (attribute) => {
  if (typeof attribute === 'string') return attribute
  if (attribute instanceof mongoose.Schema.Types.ObjectId) return 'ObjectId'
  if (attribute instanceof mongoose.Schema.Types.Decimal128) return 'Decimal128'
  if (attribute instanceof mongoose.Schema.Types.Buffer) return 'Buffer'
  if (attribute instanceof mongoose.Schema.Types.Map) return 'Map'
  if (attribute instanceof mongoose.Schema.Types.Array) return 'Array'
  if (attribute instanceof mongoose.Schema.Types.Date) return 'Date'
  if (attribute instanceof mongoose.Schema.Types.Number) return 'Number'
  if (attribute instanceof mongoose.Schema.Types.String) return 'String'
  if (attribute instanceof mongoose.Schema.Types.Boolean) return 'Boolean'
}

const validateElementOfSchema = (schemaAttribute, paramReceived) => {    
  const type = schemaAttribute.type ? schemaAttribute.type : sellectedAttributeType(schemaAttribute) 

  switch (type) {
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
