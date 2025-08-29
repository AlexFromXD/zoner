import { equal, throws } from 'assert'
import { sma } from '../math/indicators'
import { describe, it } from 'node:test'

describe('technical indicators', () => {
  describe('sma', () => {
    it('valid period', () => {
      equal(sma([1, 2, 3], 2), 2.5)
      equal(sma([1, 2, 3, 4], 3), 3)
    })

    it('invalid period', () => {
      throws(() => sma([], -1), {
        name: 'Error',
        message: 'Period must be a positive integer',
      })
    })

    it('insufficient data point', () => {
      throws(() => sma([1, 2, 3], 4), {
        name: 'Error',
        message: 'Not enough data points for the specified period',
      })
    })
  })
})
