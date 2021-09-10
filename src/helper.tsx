function arrayRange(from: number, to: number) {
  const array = []
  for (let i = from; i <= to; i += 1) {
    array.push(i)
  }
  return array
}

/**
 * Returns a random string that generated from a specified sequence of UTF-8/16 character codes.
 *
 * @see https://www.w3schools.com/charsets/ref_html_utf8.asp
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

  for (let i = 0; i < charlength; i += 1) {
    const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)]
    passwords.push(String.fromCharCode(characterCode))
  }

  return passwords.join('')
}

export const timeFormat = (date: number) =>
  new Date(date * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
