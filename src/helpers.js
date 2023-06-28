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
import mongoose, { Schema }from 'mongoose'

const possibleTypes = [
  'String',
  'Number',
  'Boolean',
  'Array',
  'Date',
  'Map',
  'Decimal128',
  'ObjectId',
  'Buffer',
  'BigInt',
  'UUID'
]

function isFirstCharacterVowel(str) {
  // Convert the string to lowercase for case-insensitive comparison
  const firstChar = str.toLowerCase().charAt(0)
      
  // Check if the first character is a vowel
  return ['a', 'e', 'i', 'o', 'u'].includes(firstChar)
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
    httpErrorCode: 400
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
      httpErrorCode: 400
    }
  }
}

module.exports = {
  isFirstCharacterVowel,
  sellectedAttributeType,
  getTypeFromString,
  validateElementOfSchema
}