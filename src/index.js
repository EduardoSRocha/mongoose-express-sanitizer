import {
  validateElementOfSchema
} from './helpers'

const general = (schemaTree, data) => sanitize(schemaTree, data)

const sanitize = (schemaTree, data) => {
  Object.keys(schemaTree).forEach(key => {
    const attribute = schemaTree[key]

    if (typeof attribute === 'object' && attribute !== null) {
      if (attribute.required && !data[key]) {
        throw {
          message: `The attribute ${key} is required.`,
          httpErrorCode: 400
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

const headers = (schemaTree, req)  =>  sanitize(schemaTree, req.headers)

const queries = (schemaTree, req) => sanitize(schemaTree, req.queries)

const body = (schemaTree, req) =>  sanitize(schemaTree, req.body)

const params = (schemaTree, req) =>  sanitize(schemaTree, req.params)

module.exports = { general, headers, queries, body, params }

export default general