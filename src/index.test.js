import {
  body,
} from '.'
import mongoose from 'mongoose'

// String
describe('body schema validator with attributes of type string', () => {
  const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      minlength: 10,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      maxlength: 30
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
      required: false,
    },
  })
        
  const Task = mongoose.model('Task', taskSchema)
    
  const { title, description, status, priority, resume} = Task.schema.tree

  it('should return without errors when all attributes are valid', () => {
    const bodyRequest = {
      title: 'titleOfTask',
      description: 'description',
      status: 'pending',
      priority: 'low',
      resume: 'resume of task',
    }

    expect(() => body({ title, description, status, priority, resume }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the title is not a string', () => {
    const bodyRequest = {
      title: 1,
      description: 'description',
      status: 'pending',
      priority: 'low',
    }
    
    expect(() => body({ title, description, status, priority }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Expected a string, but received \'number\'.'
    }) 
  })

  it('should return an error when the required title is not sended', () => {
    const bodyRequest = {
      description: 'description',
      status: 'pending',
      priority: 'low',
    }
    
    expect(() => body({ title, description, status, priority }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute title is required.'
    })
  })    

  it('should return an error when the title is less than the minlength', () => {
    const bodyRequest = {
      title: 'title',
      description: 'description',
      status: 'pending',
      priority: 'low',
    }

    expect(() => body({ title, description, status, priority }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The string length must be at least 10.'
    })
  })

  it('should return an error when the reume is more than the maxlength', () => {
    const bodyRequest = {
      title: 'titleOfTask',
      description: 'description',
      status: 'pending',
      priority: 'low',
      resume: 'resume of task with more than 30 characters'
    }
    
    expect(() => body({ title, description, status, priority, resume }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The string length must not exceed 30.'
    })  
  })

  it('should return an error when the status is not the accepted values of enum', () => {
    const bodyRequest = {
      title: 'titleOfTask',
      description: 'description',
      status: 'status',
      priority: 'low',
    }
    
    expect(() => body({ title, description, status, priority }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Invalid value. The value must be one of the following: pending, in-progress, completed.'
    }) 
  })
})

// Number
describe('body schema validator with attributes of type number', () => {
  const productSchema = new mongoose.Schema({
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
  })

  const Product = mongoose.model('Product', productSchema)

  const { price, quantity, discount, rating } = Product.schema.tree


  it('should return withour error when all attributes are valid', () => {
    const bodyRequest = {
      price: 1,
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the price is not a number', () => {
    const bodyRequest = {
      price: 'price',
      quantity: 1,
      discount: 0,
      rating: 1
    }
        
    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Expected a number, but received \'string\'.'
    }) 
  })

  it('should return an error when the required price is not sended', () => {
    const bodyRequest = {
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute price is required.'
    })
  })

  it('should return an error when the price is less than the min', () => {
    const bodyRequest = {
      price: -1,
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Value -1 is less than the minimum value setted.'
    })
  })

  it('should return an error when the quantity is not a number', () => {
    const bodyRequest = {
      price: 1,
      quantity: 'quantity',
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Expected a number, but received \'string\'.'
    })
  })

  it('should return an error when the required quantity is undefined', () => {
    const bodyRequest = {
      price: 1,
      quantity: undefined,
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute quantity is required.'
    })
  })

  it('should return an error when the required quantity is null', () => {
    const bodyRequest = {
      price: 1,
      quantity: null,
      discount: 0,
      rating: 1
    }

    expect(() => body({ price, quantity, discount, rating }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute quantity is required.'
    })
  })

})

// Boolean
describe('body schema validator with attributes of type boolean', () => {
  const inscriptionSchema = new mongoose.Schema({
    isAvailable: {
      type: Boolean,
      required: true,
    },
    isFree: {
      type: Boolean
    }
  })

  const Inscription = mongoose.model('Inscription', inscriptionSchema)

  const { isAvailable, isFree } = Inscription.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      isAvailable: true,
      isFree: false
    }

    expect(() => body({ isAvailable, isFree }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => body({ isAvailable }, { body: {}})).toThrow({
      httpErrorCode: 400,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const bodyRequest = {
      isAvailable: null
    }

    expect(() => body({ isAvailable }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const bodyRequest = {
      isAvailable: undefined
    }

    expect(() => body({ isAvailable }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the attribute is not a boolean', () => {
    const bodyRequest = {
      isAvailable: 'true'
    }

    expect(() => body({ isAvailable }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Expected a boolean, but received \'string\'.'
    })
  })
})

// Date
describe('body schema validator with attributes of type date', () => {
  const userSchema = new mongoose.Schema({
    birthDate: {
      type: Date,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  })

  const User = mongoose.model('User', userSchema)

  const { birthDate, lastLogin } = User.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      birthDate: new Date(),
      lastLogin: new Date(),
    }

    expect(() => body({ birthDate, lastLogin }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => body({ birthDate }, { body: {}})).toThrow({
      httpErrorCode: 400,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const bodyRequest = {
      birthDate: null
    }

    expect(() => body({ birthDate }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const bodyRequest = {
      birthDate: undefined
    }

    expect(() => body({ birthDate }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the attribute is not a date', () => {
    const bodyRequest = {
      birthDate: 'birthDate'
    }

    expect(() => body({ birthDate }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Expected a valid Date object, but received \'string\'.'
    })
  })
})

// Array
describe('body schema validator with attributes of type array', () => {
  const socialNetworkSchema = new mongoose.Schema({
    hobbies: {
      type: Array,
      required: true,
    },
    friends: {
      type: Array,
      enum: ['friend'],
      of: String,
    },
  })

  const SocialNetwork = mongoose.model('socialNetwork', socialNetworkSchema)

  const { hobbies, friends } = SocialNetwork.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      hobbies: ['hobby'],
      friends: ['friend'],
    }

    expect(() => body({ hobbies, friends }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when the attribute is not required and null is sended', () => {
    const bodyRequest = {
      friends: null,
    }

    expect(() => body({ friends }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when the attribute is not required and undefined is sended', () => {
    const bodyRequest = {
      friends: undefined,
    }

    expect(() => body({ friends }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when Array enum attribute is not valid', () => {
    const bodyRequest = {
      hobbies: ['hobby'],
      friends: ['joao', 'maria'],
    }

    expect(() => body({ hobbies, friends }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Invalid value in the array. The values must be one of friend.'
    })
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => body({ hobbies }, { body: {}})).toThrow({
      httpErrorCode: 400,
      message: 'The attribute hobbies is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const bodyRequest = {
      hobbies: null
    }

    expect(() => body({ hobbies }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute hobbies is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const bodyRequest = {
      hobbies: undefined
    }

    expect(() => body({ hobbies }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'The attribute hobbies is required.'
    })
  })

})

// Object
describe('body schema validator with attributes of type object', () => {
  const animalSchema = new mongoose.Schema({
    species: String,
    physicalCharacteristics: {
      size: {
        type: String,
      },
    },
    behavior: {
      diet: {
        type: String,
        enum: ['carnivore', 'herbivore', 'omnivore'],
      },
      communication: {
        verbal: {
          type: Boolean,
        },
        nonVerbal: {
          type: Boolean,
        },
      }
    },

  })


  const Animal = mongoose.model('Animal', animalSchema)

  const { size, behavior } = Animal.schema.tree

  it('should return without error when all attributes of object with children are valid', () => {
    const bodyRequest = {
      size: 'big',
      behavior: {
        diet: 'carnivore',
        communication: {
          verbal: true,
          nonVerbal: false,
        },
      },
    }

    expect(() => body({ size, behavior }, { body: bodyRequest })).not.toThrow()
  })

    
})

// isDecimal128
describe('body schema validator with attributes of type isDecimal128', () => {
  const carSchema = new mongoose.Schema({
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
      enum: [0.1, 0.2, 0.3, 0.4, 0.5],
    },
    tax: {
      type: mongoose.Schema.Types.Decimal128,
    }
  })

  const Car = mongoose.model('Car', carSchema)

  const { price, discount, tax } = Car.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      price: 123.45,
      discount: 0.1,
      tax: 0.2
    }

    expect(() => body({  price, discount, tax }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when the attribute is not required and null is sended', () => {
    const bodyRequest = {
      price: 123.45,
      discount: null, 
      tax: null
    }

    expect(() => body({ price, discount, tax }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when the attribute is not required and undefined is sended', () => {
    const bodyRequest = {
      price: 123.45,
      discount: undefined,
    }

    expect(() => body({ price, discount }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the attribute is not a decimal128', () => {
    const bodyRequest = {
      price: 'price',
    }

    expect(() => body({ price }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      message: 'Invalid Decimal128.'
    })
  })
})

// isValidObjectId
describe('body schema validator with attributes of type isValidObjectId', () => {
  const lawSchema = new mongoose.Schema({
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    arincipalArticles: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  })
  
  const Law = mongoose.model('Law', lawSchema)

  const { id } = Law.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      id: '5f8a9d9a9d9a9d9a9d9a9d9a'
    }

    expect(() => body({ id }, { body: bodyRequest })).not.toThrow()
  })

})

// isValidMap
describe('body schema validator with attributes of type isValidMap', () => {
  const employeeSchema = new mongoose.Schema({
    mapStringMongoose: {
      type: Map,
      of:  mongoose.Schema.Types.String,
      required: true,
    },
    mapNumberMongoose: {
      type: Map,
      of:mongoose.Schema.Types.Number,
      required: true,
    },
    mapBooleanMongoose: {
      type: Map,
      of: mongoose.Schema.Types.Boolean,
      required: true,
    },
    mapDateMongoose: {
      type: Map,
      of: mongoose.Schema.Types.Date,
      required: true,
    },
    mapDecimal128Mongoose: {
      type: Map,
      of:  mongoose.Schema.Types.Decimal128,
      required: true,
    },
    mapObjectIdMongoose: {
      type: Map,
      of: {
        type: mongoose.Schema.Types.ObjectId,
      },
      required: true,
    },
    mapBufferMongoose: {
      type: Map,
      of: Buffer,
      required: true,
    }
  })
  
  const Employee = mongoose.model('Employee', employeeSchema)

  const { 
    mapStringMongoose,
    mapNumberMongoose,
    mapBooleanMongoose,
    mapDateMongoose,
    mapDecimal128Mongoose,
    mapObjectIdMongoose,
    mapBufferMongoose
  } = Employee.schema.tree

  it('should return without error when MAP of String are valid', () => {
    const bodyRequest = {
      mapStringMongoose: ['test', 'test']
    }

    expect(() => body({ mapStringMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of Number are valid', () => {
    const bodyRequest = {
      mapNumberMongoose: [1, 2]
    }

    expect(() => body({ mapNumberMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of Boolean are valid', () => {
    const bodyRequest = {
      mapBooleanMongoose: [true, false]
    }

    expect(() => body({ mapBooleanMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of Date are valid', () => {
    const validDate = new Date()
    const bodyRequest = {
      mapDateMongoose: [validDate, validDate]
    }

    expect(() => body({ mapDateMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of Decimal128 are valid', () => {
    const bodyRequest = {
      mapDecimal128Mongoose: [123.45, 123.45]
    }

    expect(() => body({ mapDecimal128Mongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of ObjectId are valid', () => {
    const bodyRequest = {
      mapObjectIdMongoose: ['5f8a9d9a9d9a9d9a9d9a9d9a', '5f8a9d9a9d9a9d9a9d9a9d9a']
    }

    expect(() => body({ mapObjectIdMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return without error when MAP of Buffer are valid', () => {
    const validBuffer = Buffer.from('buffer')
    const bodyRequest = {
      mapBufferMongoose: [validBuffer, validBuffer]
    }

    expect(() => body({ mapBufferMongoose }, { body: bodyRequest })).not.toThrow()
  })

  it('should return an error when the attribute is not a MAP', () => {
    const bodyRequest = {
      mapStringMongoose: 'test'
    }

    expect(() => body({ mapStringMongoose }, { body: bodyRequest })).toThrow({
      httpErrorCode: 400,
      
      message: 'Invalid Map.'
    })
  })
})

// isValidBuffer
describe('body schema validator with attributes of type isValidBuffer', () => {
  const fileSchema = new mongoose.Schema({
    buffer: {
      type: Buffer,
      required: true,
    },
  })
  
  const File = mongoose.model('File', fileSchema)

  const { buffer } = File.schema.tree

  it('should return without error when all attributes are valid', () => {
    const bodyRequest = {
      buffer: Buffer.from('buffer')
    }

    expect(() => body({ buffer }, { body: bodyRequest })).not.toThrow()
  })

})