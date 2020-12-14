function arrayRange(from: number, to: number) {
  const array = []
  for (let i = from; i <= to; i++) {
    array.push(i)
  }
  return array
}

/**
 * Returns a random string that generated from a specified sequence of UTF-8/16 character codes.
 * @link https://www.w3schools.com/charsets/ref_html_utf8.asp
 * @tutorial https://www.youtube.com/watch?v=iKo9pDKKHnc&t=59s
 *
 */

export function generatePassword(
  charlength: number,
  includeUppercase?: boolean,
  includeNumbers?: boolean,
  includeSymbols?: boolean
): string {
  const getLowerCase = arrayRange(97, 122)
  const getUpperCase = arrayRange(65, 90)
  const getNumbers = arrayRange(48, 57)
  const getSymbol = [...arrayRange(33, 47), ...arrayRange(58, 64), ...arrayRange(91, 96), ...arrayRange(123, 126)]
  const passwords = []
  let charCodes = getLowerCase

  if (includeUppercase) charCodes = [...charCodes, ...getUpperCase]
  if (includeNumbers) charCodes = [...charCodes, ...getNumbers]
  if (includeSymbols) charCodes = [...charCodes, ...getSymbol]

  for (let i = 0; i < charlength; i++) {
    const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)]
    passwords.push(String.fromCharCode(characterCode))
  }

  return passwords.join('')
}

export function isValidate(valuesArray: Array<PasswordList>, title: string, password: string) {
  let titleError = ''
  let passwordError = ''
  const storedTitle = valuesArray.find((item) => item.title === title)

  if (!title) {
    titleError = 'Please add a password title'
  } else if (storedTitle) {
    titleError = 'You already have this title'
  } else if (!password) {
    passwordError = 'Please generate a password first'
  }
  return { titleError, passwordError }
}
