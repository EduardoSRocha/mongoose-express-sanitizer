import { isFirstCharacterVowel } from './helpers'

const errors = {
  typeError: (attribute, desiredType) => {
    return {
      status: 400,
      message: `${attribute} must to be ${() => isFirstCharacterVowel(desiredType) ? 'an': 'a' } ${desiredType}`,
      internalCode: 1
    }
  }
}

const errorHandler = (err) => {
  switch (err.internalCode) {
  case 1:
    throw errors.typeError(err.attribute, err.desiredType)
  default:
    throw err
  }
}

module.exports = {
  errorHandler
}
