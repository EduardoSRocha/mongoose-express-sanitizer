const validateRequired = (attributeValue) => {
  if (attributeValue === undefined || attributeValue === null || attributeValue === '') {
    throw { 
      message: 'Attribute is required.',
      httpErrorCode: 400,
      internalErrorCode: 1000
    } 
  }
}
  
const isString =(schemaAttribute, value) => {
  if(schemaAttribute.required) validateRequired(value)
  if(schemaAttribute.enum) validateEnum(schemaAttribute, value)
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
  if(schemaAttribute.required) validateRequired(value)
  if(schemaAttribute.enum) validateEnum(schemaAttribute, value)
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
  if(schemaAttribute.required) validateRequired(value)
  if(schemaAttribute.enum) validateEnum(schemaAttribute, value)
  if(schemaAttribute.max) verifyMaxValue(schemaAttribute.max, value)
  if(schemaAttribute.min) verifyMinValue(schemaAttribute.min, value)
  if(!schemaAttribute.required && (value === undefined || value === null)) return
  if (!(value instanceof Date && !isNaN(value))) {
    throw {
      message: `Expected a valid Date object, but received '${value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1002,
    }
  }
}
  
const isDateString = (value) => {
  const desiredType = 'string'
  if (typeof value !== 'string' || isNaN(Date.parse(value) || value === undefined || value === null)) {
    throw { 
      message: `Expected '${desiredType}' in a valid date format, but received '${typeof value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1004
    }
  }
}
  
const isTimestamp = (attribute) => {
  const desiredType = 'number'
  
  if (typeof attribute !== 'number' || isNaN(attribute)) {
    throw { 
      message: `Expected '${desiredType}', but received '${typeof attribute}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1005
    }
  }
}

const validateEnum = (schemaAttribute, attributeValue) => {
  if (!schemaAttribute.enum.includes(attributeValue)) {
    throw { 
      message: `Invalid value. The value must be one of the following: ${schemaAttribute.enum.join(', ')}.`,
      httpErrorCode: 400,
      internalErrorCode: 1006
    }
  }
}

const isArray= (schemaAttribute, value) => {
  if(schemaAttribute.required) validateRequired(value)
  if (!Array.isArray(value)) {
    throw { 
      message: `Expected Array, but received '${typeof value}'.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
}

const getValidationFunction = (schemaTree, attributeName) => {
  const attributeSchema = schemaTree[attributeName]
  
  if (!attributeSchema || typeof attributeSchema.validate !== 'function') {
    throw { 
      message: `Validation function not found for attribute '${attributeName}' in the schema.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
  
  return attributeSchema.validate
}

const verifyMinValue = (min, attribute) => {
  if (attribute < min) {
    throw { 
      message: `Value ${attribute} is under of the minimum value '${min}' setted.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
}

const verifyMaxValue = (max, attribute) => {
  if (attribute > max) {
    throw { 
      message: `Value ${attribute} exceed the maximum value '${max}' setted.`,
      httpErrorCode: 400,
      internalErrorCode: 1007
    }
  }
}

module.exports = {
  isNumber,
  isString,
  getValidationFunction,
  isTimestamp,
  isDateString,
  isDate,
  isArray
}