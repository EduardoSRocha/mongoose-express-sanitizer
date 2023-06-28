import mongoose from 'mongoose'
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

const isArray = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if(schemaAttribute.enum) verifyValidEnumForArray(schemaAttribute.enum, value)
  if(schemaAttribute.max) verifyMaxLengthArray(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinLengthArray(schemaAttribute.min, value)
  if (!Array.isArray(value)) {
    throw { 
      message: `Expected Array, but received '${typeof value}'.`,
      httpErrorCode: 400
    }
  }
}

const isBoolean = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (typeof value !== 'boolean') {
    throw {
      message: `Expected a boolean, but received '${typeof value}'.`,
      httpErrorCode: 400
    }
  }
  return
}

const isConvertableToDecimal128 = (value) => typeof value !== 'string' && typeof value !== 'number'? false : true

const isDate = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (!(value instanceof Date && !isNaN(value))) {
    throw {
      message: `Expected a valid Date object, but received '${typeof value}'.`,
      httpErrorCode: 400
    }
  }
}

const isNumber = (schemaAttribute, value)=> {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if(schemaAttribute.max || schemaAttribute.min === 0) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min || schemaAttribute.min === 0) verifyMinValue(schemaAttribute.min, value)
  if (typeof value !== 'number') throw { 
    message: `Expected a number, but received '${typeof value}'.`,
    httpErrorCode: 400
  }
  return
}

const isRequired = (value) => {
  if (value === undefined || value === null || value === '') {
    throw { 
      message: 'The attribute is required.',
      httpErrorCode: 400
    } 
  }
}
  
const isString =(schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(!schemaAttribute.required && (value === undefined || value === null || value === '')) return
  if(schemaAttribute.maxlength) verifyMaxLengthString(schemaAttribute.maxlength, value)
  if(schemaAttribute.minlength) verifyMinLengthString(schemaAttribute.minlength, value)
  if (typeof value !== 'string') {
    throw { 
      message: `Expected a string, but received '${typeof value}'.`,
      httpErrorCode: 400
    } 
  }
  return
}

const isValidObjectId = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (!mongoose.Types.ObjectId.isValid(value) || value.length !== 24 || typeof value !== 'string') {
    throw { 
      message: 'Invalid ObjectId.',
      httpErrorCode: 400
    } 
  }
  return
}

const isValidBuffer = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (!Buffer.isBuffer(value)) {
    throw { 
      message: 'Invalid Buffer.',
      httpErrorCode: 400
    } 
  }
  return
}

const isValidDecimal128 = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  
  if(!validateNumericString(value)) {
    throw {
      message: 'Invalid Decimal128.',
      httpErrorCode: 400
    }
  }
  if(!isConvertableToDecimal128(value)) {
    throw {
      message: 'Invalid Decimal128.',
      httpErrorCode: 400
    }
  }

  return
}

const isValidMap = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  const { of } = schemaAttribute

  if(!(typeof value === 'object' || Array.isArray(value))) {
    throw {
      message: 'Invalid Map.',
      httpErrorCode: 400
    }
  }
 
  if (typeof value === 'object' && !Array.isArray(value)) {
    for (let key in value) {
      if (!isValidType(value[key], of)) {
        throw {
          message: `Invalid Map. The value of the key '${key}' must be a ${of}.`,
          httpErrorCode: 400
        }
      }
    }
  }

  if(Array.isArray(value)) {
    value.forEach((item, index) => {
      if (!isValidType(item, of)) {
        throw {
          message: `Invalid Map. The value of the key '${index}' must be a ${of}.`,
          httpErrorCode: 400
        }
      }
    })
  }
}

const getMapTypeOf = (value) => {
  if (typeof value === 'string' && possibleTypes.includes(value)) {
    return value
  }

  if (value instanceof mongoose.Schema.Types.ObjectId) {
    return 'ObjectId'
  }
  
  if (value instanceof mongoose.Schema.Types.Decimal128) {
    return 'Decimal128'
  }

  if (value instanceof mongoose.Schema.Types.Buffer) {
    return 'Buffer'
  }

  if (value instanceof mongoose.Schema.Types.Map) {
    return 'Map'
  }

  if (value instanceof mongoose.Schema.Types.Array) {
    return 'Array'
  }

  if (value instanceof mongoose.Schema.Types.Date) {
    return 'Date'
  }

  if (value instanceof mongoose.Schema.Types.Number) {
    return 'Number'
  }

  if (value instanceof mongoose.Schema.Types.String) {
    return 'String'
  }

  if (value instanceof mongoose.Schema.Types.Boolean) {
    return 'Boolean'
  }

  if (typeof value === 'function') {
    return value.schemaName || value.name
  }

  if (typeof value === 'object') {
    if (value.type && value.type.schemaName === 'ObjectId') {
      return 'ObjectId'
    }
    return 'Object'
  }

  if (Array.isArray(value)) {
    return 'Array'
  }

  if (value instanceof Date) {
    return 'Date'
  }

  if (typeof value === 'number') {
    return 'Number'
  }

  if (typeof value === 'string') {
    return 'String'
  }

  if (typeof value === 'boolean') {
    return 'Boolean'
  }
}

const isValidType = (value, type) => {
  const {
    Decimal128,
    ObjectId,
    Map
  } = mongoose.Schema.Types

  const typeOf = getMapTypeOf(type)

  switch (typeOf) {
  case 'Date':
    return value instanceof Date
  case 'ObjectId':
    return value instanceof ObjectId || typeof value === 'string'
  case 'Decimal128':
    return value instanceof Decimal128 || typeof value === 'number'
  case 'Buffer':
    return Buffer.isBuffer(value)
  case 'Array':
    return Array.isArray(value)
  case 'String':
    return value instanceof String || typeof value === 'string'
  case 'Number':
    return value instanceof Number || typeof value === 'number'
  case 'Boolean':
    return value instanceof Boolean || typeof value === 'boolean'
  case 'Map':
    return value instanceof Map
  default:
    break
  }

  switch (type) {
  case String:
    return value instanceof String
  case Number:
    return value instanceof Number
  case Boolean:
    return value instanceof Boolean
  case Array:
    return value instanceof Array
  case Date:
    return value instanceof Date
  case 'Map':
    return typeof value !== 'object' || Array.isArray(value)
  case Map:
    return value instanceof Map
  case 'Decimal128':
    return validateNumericString(value)
  case Decimal128:
    return value instanceof Decimal128
  case 'ObjectId':
    return mongoose.Types.ObjectId.isValid(value) || (value.length === 24 && typeof value === 'string')
  case ObjectId:
    return value instanceof ObjectId
  case 'Buffer':
    return Buffer.isBuffer(value)
  case Buffer:
    return Buffer.isBuffer(value)
  default:
    throw {
      message: `Type ${typeof value} not supported.`,
      httpErrorCode: 400
    }
  }
}

const validateNumericString = (value) => typeof value === 'string'? /^[\d.]+$/.test(value) : true

const verifyEnumValue = (schemaAttribute, value) => {
  if (!schemaAttribute.enum.includes(value)) {
    throw { 
      message: `Invalid value. The value must be one of the following: ${schemaAttribute.enum.join(', ')}.`,
      httpErrorCode: 400
    }
  }
}

const verifyMinLengthArray = (minLength, attribute) => {
  if (!Array.isArray(attribute) || attribute.length < minLength) {
    throw { 
      message: `The array length must be at least ${minLength}.`,
      httpErrorCode: 400
    }
  }
}

const verifyMaxLengthArray = (maxLength, attribute) => {
  if (!Array.isArray(attribute) || attribute.length > maxLength) {
    throw {
      message: `The array length must not exceed ${maxLength}.`,
      httpErrorCode: 400
    }
  }
}

const verifyMinLengthString = (minLength, attribute) => {
  if (attribute.length < minLength) {
    throw {
      message: `The string length must be at least ${minLength}.`,
      httpErrorCode: 400
    }
  }
}

const verifyMaxLengthString = (maxLength, attribute) => {
  if (attribute.length > maxLength) {
    throw {
      message: `The string length must not exceed ${maxLength}.`,
      httpErrorCode: 400
    }
  }
}

const verifyValidEnumForArray = (enumValues, attribute) => {
  if (!Array.isArray(attribute) || !attribute.every((value) => enumValues.includes(value))) {
    throw {
      message: `Invalid value in the array. The values must be one of ${enumValues.join(', ')}.`,
      httpErrorCode: 400
    }
  }
}

const verifyMinValue = (min, attribute) => {
  
  if (attribute < min) {
    throw { 
      message: `Value ${attribute} is less than the minimum value setted.`,
      httpErrorCode: 400
    }
  }
}

const verifyMaxValue = (max, attribute) => {
  if (attribute > max) {
    throw { 
      message: `Value ${attribute} is greater than the maximum value setted.`,
      httpErrorCode: 400
    }
  }
}

module.exports = {
  isArray,
  isBoolean,
  isDate,
  isNumber,
  isString,
  isValidBuffer,
  isValidDecimal128,
  isValidMap,
  isValidObjectId,
}

