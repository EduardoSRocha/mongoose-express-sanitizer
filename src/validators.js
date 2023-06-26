import mongoose from 'mongoose'

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

const isBoolean = (schemaAttribute, value) => {
  if(schemaAttribute.required) isRequired(value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (typeof value !== 'boolean') {
    throw {
      message: `Expected a boolean, but received '${typeof value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1003
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
      httpErrorCode: 400,
      internalErrorCode: 1003,
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
    httpErrorCode: 400,
    internalErrorCode: 1002
  }
  return
}

const isRequired = (value) => {
  if (value === undefined || value === null || value === '') {
    throw { 
      message: 'The attribute is required.',
      httpErrorCode: 400,
      internalErrorCode: 1000
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
      httpErrorCode: 400,
      internalErrorCode: 1001
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
      httpErrorCode: 400,
      internalErrorCode: 1001
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
  
  if(!validateNumericString(value)) {
    throw {
      message: 'Invalid Decimal128.',
      httpErrorCode: 400,
      internalErrorCode: 1001
    }
  }
  if(!isConvertableToDecimal128(value)) {
    throw {
      message: 'Invalid Decimal128.',
      httpErrorCode: 400,
      internalErrorCode: 1001
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
  const { of, validate } = schemaAttribute
  if(typeof value !== 'object' ) {
    throw {
      message: 'Invalid Map.',
      httpErrorCode: 400,
      internalErrorCode: 1001
    }
  }

  if (typeof value !== 'object' || value === null) {
    if (of && validate) {
      for (const [, value] of value.entries()) {
        if (!of.validate(value)) {
          throw {
            message: 'Invalid key to Map.',
            httpErrorCode: 400,
            internalErrorCode: 1001
          }
        }
      }
    }
  }
}

const validateNumericString = (value) => typeof value === 'string'? /^[\d.]+$/.test(value) : true

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

const verifyMinLengthString = (minLength, attribute) => {
  if (attribute.length < minLength) {
    throw {
      message: `The string length must be at least ${minLength}.`,
      httpErrorCode: 400,
      internalErrorCode: 1008,
    }
  }
}

const verifyMaxLengthString = (maxLength, attribute) => {
  if (attribute.length > maxLength) {
    throw {
      message: `The string length must not exceed ${maxLength}.`,
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