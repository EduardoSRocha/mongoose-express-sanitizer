import {
  isNumber,
  isString,
  getValidationFunction,
  isTimestamp,
  isDateString,
  isDate,
  isArray,
} from './validators'


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
      message: 'Value 3 is under of the minimum value \'4\' setted.',
    })
  })

  it('must validate a number and fail for sending a value exceeds the maximum setted', () => {
    expect(() => {
      isNumber({ type: 'Number', max: 3 }, 4)
    }).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Value 4 exceed the maximum value \'3\' setted.',
    })
  })
  
})

describe('Array Validator', () => {  
  it('should validate an Array with success', () => {
    const response = isArray({ type: 'Array'}, [])
    expect(response).toBe(undefined)
  })
})

describe('Date Validator', () => {
  it('should validate an Date with success', () => {
    const today = new Date()
    const response = isDate({ type: 'Date'}, today)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a null value withou required setted', () => {
    const response = isDate({ type: 'Date'}, null)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with success passing a undefined value withou required setted', () => {
    const response = isDate({ type: 'Date'}, undefined)
    expect(response).toBe(undefined)
  })

  it('should validate an Date with fail passing a empty value withou required setted', () => {
    expect(() => {
      isDate({ type: 'Date'}, '')
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Expected a valid Date object, but received \'\'.',
    })
  })

  it('should validate an Date with fail passing a date out of minimum setted', () => {
    expect(() => {
      const min = new Date('01-01-2000')
      const value =  new Date('01-01-1999')
      isDate({ type: 'Date', min: min}, value)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Value Fri Jan 01 1999 00:00:00 GMT-0200 (Brasilia Summer Time) is under of the minimum value \'Sat Jan 01 2000 00:00:00 GMT-0200 (Brasilia Summer Time)\' setted.',
    })
  })

  it('should validate an Date with fail passing a date out of maximum setted', () => {
    expect(() => {
      const max =  new Date('01-01-1999')
      const value = new Date('01-01-2000')
      isDate({ type: 'Date', max: max}, value)
    }).toThrow({
      'httpErrorCode': 400,
      'internalErrorCode': 1002,
      'message': 'Value Sat Jan 01 2000 00:00:00 GMT-0200 (Brasilia Summer Time) exceed the maximum value \'Fri Jan 01 1999 00:00:00 GMT-0200 (Brasilia Summer Time)\' setted.',
    })
  })

  it('should validate an Date with fail passing a date out of enum setted', () => {
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

  it('should validate an Date with success when the value is one of enum setted', () => {
    const date1 =  new Date('01-01-1999')
    const date2 =  new Date('01-01-1998')
    const response = isDate({ type: 'Date', enum:[date1, date2]}, date1)
    expect(response).toBe(undefined)
  })
})