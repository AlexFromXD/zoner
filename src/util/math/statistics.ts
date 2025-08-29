import { avg } from './basic'

/**
 * Statistical calculations for arrays of numbers
 */

/**
 * Calculates the standard deviation of an array of numbers.
 */
export function stddev(numbers: readonly number[], sample = true): number {
  if (!numbers.length) {
    throw new Error('Cannot calculate standard deviation of an empty array')
  }

  const mean = avg(numbers)
  const variance =
    numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) /
    (sample ? numbers.length - 1 : numbers.length)

  return Number(Math.sqrt(variance).toFixed(3))
}
