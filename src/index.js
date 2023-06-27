import {
  validateElementOfSchema
} from './helpers'

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

module.exports = { middleware }
