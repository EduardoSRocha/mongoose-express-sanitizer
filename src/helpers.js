
function isFirstCharacterVowel(str) {
  // Convert the string to lowercase for case-insensitive comparison
  const firstChar = str.toLowerCase().charAt(0)
      
  // Check if the first character is a vowel
  return ['a', 'e', 'i', 'o', 'u'].includes(firstChar)
}

module.exports = {
  isFirstCharacterVowel
}