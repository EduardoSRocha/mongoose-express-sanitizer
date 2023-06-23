import {
  isNumber,
  isString,
  isTimestamp,
  isDate,
  isArray,
  isValidObjectId,
  isValidBuffer,
  isValidDecimal128,
  isValidMap
} from './validators'

import { Types } from 'mongoose'

describe('String Validator', () => {
  it('should validate a string with success', () => {
    const response = isString({ type: 'String'}, 'string')
    expect(response).toBe(undefined)
  })

  it('must validate a string and fail for sending null to required value', () => {
    expect(() => {
      isString({ type: 'String', required: true }, null)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a string and fail for sending an empty string to a required value', () => {
    expect(() => {
      isString({ type: 'String', required: true }, '')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a string and fail for sending undefined to required value', () => {
    expect(() => {
      isString({ type: 'String', required: true }, undefined)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a string and fail for sending invalid value', () => {
    expect(() => {
      isString({ type: 'String', enum: ['a', 'b'] }, 'c')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Invalid value. The value must be one of the following: a, b.',
    })
  })
})

describe('Number Validator', () => {
  it('should validate a number with success', () => {
    const response = isNumber({ type: 'Number'}, 0)
    expect(response).toBe(undefined)
  })


  it('must validate a number and fail for sending null to required value', () => {
    expect(() => {
      isNumber({ type: 'Number', required: true }, null)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a number and fail for sending an empty string to a required value', () => {
    expect(() => {
      isNumber({ type: 'Number', required: true }, '')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a number and fail for sending undefined to required value', () => {
    expect(() => {
      isNumber({ type: 'Number', required: true }, undefined)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Attribute is required.',
    })
  })

  it('must validate a number and fail for sending invalid value', () => {
    expect(() => {
      isNumber({ type: 'Number', enum: [1, 2] }, 3)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Invalid value. The value must be one of the following: 1, 2.',
    })
  })

  it('must validate a number and fail for sending a value bellow to the minimum setted', () => {
    expect(() => {
      isNumber({ type: 'Number', min: 4 }, 3)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Value 3 is less than the minimum value setted.',
    })
  })

  it('must validate a number and fail for sending a value is greater thans the maximum setted', () => {
    expect(() => {
      isNumber({ type: 'Number', max: 3 }, 4)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Value 4 is greater than the maximum value setted.',
    })
  })
  
})

describe('Date Validator', () => {
  it('should validate an Date with success', () => {
    const today = new Date()
    const response = isDate({ type: 'Date'}, today)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a null value without required setted', () => {
    const response = isDate({ type: 'Date'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a undefined value without required setted', () => {
    const response = isDate({ type: 'Date'}, undefined)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a null value with required setted', () => {
    expect(() => {
      isDate({ type: 'Date', required: true }, null)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('should validate an Date with success passing a undefined value with required setted', () => {
    expect(() => {
      isDate({ type: 'Date', required: true }, undefined)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('should try validate an Date with fail passing a empty string value', () => {
    expect(() => {
      isDate({ type: 'Date'}, '')
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Expected a valid Date object, but received \'\'.',
    })
  })

  it('should try validate an Date with fail passing a date out of minimum setted', () => {
    expect(() => {
      const min = new Date('01-01-2000')
      const value =  new Date('01-01-1999')
      isDate({ type: 'Date', min: min}, value)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Value Fri Jan 01 1999 00:00:00 GMT-0200 (Brasilia Summer Time) is less than the minimum value setted.',
    })
  })

  it('should try validate an Date with fail passing a date out of maximum setted', () => {
    expect(() => {
      const max =  new Date('01-01-1999')
      const value = new Date('01-01-2000')
      isDate({ type: 'Date', max: max}, value)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Value Sat Jan 01 2000 00:00:00 GMT-0200 (Brasilia Summer Time) is greater than the maximum value setted.',
    })
  })

  it('should try validate an Date with fail passing a date out of enum setted', () => {
    expect(() => {
      const validValue =  new Date('01-01-1999')
      const value = new Date('01-01-2000')
      isDate({ type: 'Date', enum: [validValue]}, value)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Invalid value. The value must be one of the following: Fri Jan 01 1999 00:00:00 GMT-0200 (Brasilia Summer Time).',
    })
  })

  it('should try validate an Date with success when the value is one of enum setted', () => {
    const date1 =  new Date('01-01-1999')
    const date2 =  new Date('01-01-1998')
    const response = isDate({ type: 'Date', enum:[date1, date2]}, date1)
    expect(response).toBe(undefined)
  })
})

describe('Array Validator', () => {  
  it('should validate an Array with success', () => {
    const response = isArray({ type: 'Array'}, [])
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a null value without required setted', () => {
    const response = isArray({ type: 'Array'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a undefined value without required setted', () => {
    const response = isArray({ type: 'Array'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a null value with required setted', () => {
    expect(() => {
      isArray({ type: 'Array', required: true}, null)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('should validate an Date with success passing a undefined value with required setted', () => {
    expect(() => {
      isArray({ type: 'Array', required: true}, undefined)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

})

describe('Timestamp Validator', () => {
  it('should validate a number with success', () => {
    const response = isTimestamp({ type: 'Timestamp'}, 1234567890)
    expect(response).toBe(undefined)
  })

  it('should validate a number with success passing a null value without required setted', () => {
    const response = isTimestamp({ type: 'Timestamp'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate a number with success passing a undefined value without required setted', () => {
    const response = isTimestamp({ type: 'Timestamp'}, undefined)
    expect(response).toBe(undefined)
  })

  it('should validate a number with error passing a null value with required setted', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp', required: true}, null)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('should validate a number with error passing a undefined value with required setted', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp', required: true}, undefined)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('must validate a number and fail for sending a non-number attribute', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp'}, 'not a number')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid timestamp.',
    })
  })

  it('must validate a number and fail for sending a number less than 0', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp'}, -1)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid timestamp.',
    })
  })

  it('must validate a number and fail for sending a number greater than 9999999999999', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp'}, 10000000000000)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid timestamp.',
    })
  })

  it('must validate a number and fail for sending a number with decimal places', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp'}, 1.1)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid timestamp.',
    })
  })

  it('must validate a number and fail for sending invalid not enum value', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp', enum: [1]}, 2)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1002,
      message: 'Invalid value. The value must be one of the following: 1.',
    })
  })

  it('must validate a number and fail for sending a value bellow to the minimum setted', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp', min: 2}, 1)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1002,
      message: 'Value 1 is less than the minimum value setted.',
    })
  })

  it('must validate a number and fail for sending a value above to the maximum setted', () => {
    expect(() => {
      isTimestamp({ type: 'Timestamp', max: 1}, 2)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1002,
      message: 'Value 2 is greater than the maximum value setted.',
    })
  })

})

describe('ObjectId Validator', () => {
  it('should validate an ObjectId with success', () => {
    const response = isValidObjectId({ type: 'ObjectId'}, '5f7e4d7b0b9a8b2c9c8b4567')
    expect(response).toBe(undefined)
  })

  it('should validate an ObjectId with success passing a null value without required setted', () => {
    const response = isValidObjectId({ type: 'ObjectId'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate an ObjectId with success passing a undefined value without required setted', () => {
    const response = isValidObjectId({ type: 'ObjectId'}, undefined)
    expect(response).toBe(undefined)
  })

  it('should validate an ObjectId with error passing a null value with required setted', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId', required: true}, null)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })  

  it('should validate an ObjectId with error passing a undefined value with required setted', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId', required: true}, undefined)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Attribute is required.',
    })
  })

  it('must validate an ObjectId and fail for sending a non-string attribute', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId'}, 123)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid ObjectId.',
    })
  })

  it('must validate an ObjectId and fail for sending a string with length less than 24', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId'}, '12345678901234567890123')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid ObjectId.',
    })
  })

  it('must validate an ObjectId and fail for sending a string with length greater than 24', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId'}, '1234567890123456789012345')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid ObjectId.',
    })
  })

  it('must validate an ObjectId and fail for sending a string with invalid characters', () => {
    expect(() => {
      isValidObjectId({ type: 'ObjectId'}, '12345678901234567890123!')
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1005,
      message: 'Invalid ObjectId.',
    })
  })  



})

describe('Buffer Validator', () => {

})

describe('Decimal128 Validator', () => {

})

describe('Map Validator', () => {

})