import {
  isArray,
  isBoolean,
  isDate,
  isValidDecimal128,
  isNumber,
  isString,
  isValidObjectId,
  isValidMap,
  isValidBuffer
} from './validators.js'

const possibleTypes = [
  'String',
  'Number',
  'Boolean',
  'Array',
  'Date',
  'Map',
  'Decimal128',
  'ObjectId',
  'Buffer'
]

import mongoose, { Schema }from 'mongoose'

const middleware = (schemaTree, data) => sanitize(schemaTree, data)

const sanitize = (schemaTree, data) => {
  Object.keys(schemaTree).forEach(key => {
    const attribute = schemaTree[key]

    if (typeof attribute === 'object' && attribute !== null) {
      if (attribute.required && !data[key]) {
        throw {
          message: `The attribute ${key} is required.`,
          httpErrorCode: 400,
          internalErrorCode: 1001
        }
      }

      if (data[key]) {
        if (typeof attribute === 'object' && typeof data[key] === 'object' && !Array.isArray(data[key])) {
          sanitize(attribute, data[key])
        } else {
          validateElementOfSchema(attribute, data[key])
        }
      }
    }
  })
}

const sellectedAttributeType = (attribute) => {
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

const getTypeFromString = (type) => {
  if (typeof attribute === 'string' && possibleTypes.includes(type)) return type
  throw {
    message: 'Invalid type',
    httpErrorCode: 400,
    internalErrorCode: 1002
  }
}

const validateElementOfSchema = (schemaAttribute, paramReceived) => {
  const {
    Decimal128,
    ObjectId,
    Buffer
  } = Schema.Types

  let type = schemaAttribute.type ? schemaAttribute.type : sellectedAttributeType(schemaAttribute)

  if (schemaAttribute.type === Map) {
    isValidMap(schemaAttribute, paramReceived)
    return
  }

  if (schemaAttribute.type === Buffer) {
    isValidBuffer(schemaAttribute, paramReceived)
    return
  }

  if (typeof type === 'string') {
    type = getTypeFromString(type)
  }

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
  case Decimal128:
    isValidDecimal128(schemaAttribute, paramReceived)
    break
  case ObjectId:
    isValidObjectId(schemaAttribute, paramReceived)
    break
  case Buffer:
    isValidBuffer(schemaAttribute, paramReceived)
    break
  default:
    throw {
      message: 'Invalid type',
      httpErrorCode: 400,
      internalErrorCode: 1002
    }
  }
}


module.exports = { middleware }
