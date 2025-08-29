import { avg } from './basic'

/**
 * Technical indicators for financial analysis
 */

/**
 * Simple Moving Average
 */
export function sma(numbers: readonly number[], period: number): number {
  if (period <= 0) {
    throw new Error('Period must be a positive integer')
  }
  if (numbers.length < period) {
    throw new Error('Not enough data points for the specified period')
  }

  const range = numbers.slice(-period)
  return avg(range)
}
