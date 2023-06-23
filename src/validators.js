import mongoose from 'mongoose'

const isRequired = (attributeValue) => {
  if (attributeValue === undefined || attributeValue === null || attributeValue === '') {
    throw { 
      message: 'Attribute is required.',
      httpErrorCode: 400,
      internalErrorCode: 1000
    } 
  }
}
  
const isString =(schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(!schemaAttribute.required && (value === undefined || value === null || value === '')) return
  if (typeof value !== 'string') {
    throw { 
      message: `Expected '${value}', but received '${typeof value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1001
    } 
  }
  return
}

const isNumber = (schemaAttribute, value)=> {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if (typeof value !== 'number') throw { 
    message: `Expected '${value}', but received '${typeof value}'.`,
    httpErrorCode: 400,
    internalErrorCode: 1002
  }
  return
}

const isDate = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (!(value instanceof Date && !isNaN(value))) {
    throw {
      message: `Expected a valid Date object, but received '${value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1003,
    }
  }
}
  
const isTimestamp = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return

  if(value > 9999999999999) {
    throw {
      message: 'Invalid timestamp.',
      httpErrorCode: 400,
      internalErrorCode: 1004
    }
  }

  if (value % 1 !== 0) {
    throw {
      message: 'Invalid timestamp.',
      httpErrorCode: 400,
      internalErrorCode: 1004
    }
  }
  
  if (typeof value !== 'number' || isNaN(value) || value <= 0) {
    throw {
      message: 'Invalid timestamp.',
      httpErrorCode: 400,
      internalErrorCode: 1004
    }
  }

  const timestamp = new Date(value)

  if (isNaN(timestamp.getTime())) {
    throw {
      message: 'Invalid timestamp.',
      httpErrorCode: 400,
      internalErrorCode: 1005
    }
  }
}

const isArray = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if(schemaAttribute.enum) verifyValidEnumForArray(schemaAttribute.enum, value)
  if(schemaAttribute.max) verifyMaxLengthArray(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinLengthArray(schemaAttribute.min, value)
  if (!Array.isArray(value)) {
    throw { 
      message: `Expected Array, but received '${typeof value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
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
      httpErrorCode: 400,
      internalErrorCode: 1001
    } 
  }

  console.log('*************************************', value, value.length, )
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
      httpErrorCode: 400,
      internalErrorCode: 1001
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

  if (!(value instanceof mongoose.Types.Decimal128)) {
    throw {
      message: 'Invalid Decimal128.',
      httpErrorCode: 400,
      internalErrorCode: 1001
    }
  }
}

const isValidMap = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(schemaAttribute.enum) verifyEnumValue(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return

  if (!(value instanceof mongoose.Types.Map)) {
    throw {
      message: 'Invalid Map.',
      httpErrorCode: 400,
      internalErrorCode: 1001
    }
  }
}

const verifyEnumValue = (schemaAttribute, value) => {
  if (!schemaAttribute.enum.includes(value)) {
    throw { 
      message: `Invalid value. The value must be one of the following: ${schemaAttribute.enum.join(', ')}.`,
      httpErrorCode: 400,
      internalErrorCode: 1006
    }
  }
}

const verifyMinLengthArray = (minLength, attribute) => {
  if (!Array.isArray(attribute) || attribute.length < minLength) {
    throw { 
      message: `The array length must be at least ${minLength}.`,
      httpErrorCode: 400,
      internalErrorCode: 1008
    }
  }
}

const verifyMaxLengthArray = (maxLength, attribute) => {
  if (!Array.isArray(attribute) || attribute.length > maxLength) {
    throw {
      message: `The array length must not exceed ${maxLength}.`,
      httpErrorCode: 400,
      internalErrorCode: 1009,
    }
  }
}

const verifyValidEnumForArray = (enumValues, attribute) => {
  if (!Array.isArray(attribute) || !attribute.every((value) => enumValues.includes(value))) {
    throw {
      message: `Invalid value in the array. The values must be one of ${enumValues.join(', ')}.`,
      httpErrorCode: 400,
      internalErrorCode: 1010,
    }
  }
}

const verifyMinValue = (min, attribute) => {
  if (attribute < min) {
    throw { 
      message: `Value ${attribute} is less than the minimum value setted.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
}

const verifyMaxValue = (max, attribute) => {
  if (attribute > max) {
    throw { 
      message: `Value ${attribute} is greater than the maximum value setted.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
}

module.exports = {
  isNumber,
  isString,
  isTimestamp,
  isDate,
  isArray,
  isValidObjectId,
  isValidBuffer,
  isValidDecimal128,
  isValidMap
}