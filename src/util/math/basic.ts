/**
 * Basic mathematical operations for arrays of numbers
 */

export function avg(numbers: readonly number[]): number {
  if (!numbers.length) {
    throw new Error('Cannot calculate average of an empty array')
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return Number((sum / numbers.length).toFixed(1))
}

export function max(numbers: readonly number[]): number {
  if (!numbers.length) {
    throw new Error('Cannot find max of an empty array')
  }

  let max = -Infinity
  for (const num of numbers) {
    if (num > max) {
      max = num
    }
  }
  return max
}

export function min(numbers: readonly number[]): number {
  if (!numbers.length) {
    throw new Error('Cannot find min of an empty array')
  }

  let min = Infinity
  for (const num of numbers) {
    if (num < min) {
      min = num
    }
  }
  return min
}
