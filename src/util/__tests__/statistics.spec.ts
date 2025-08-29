import { equal, throws } from 'assert'
import { stddev } from '../math/statistics'
import { describe, it } from 'node:test'

describe('statistics', () => {
  describe('stddev', () => {
    it('integer', () => {
      equal(stddev([1, 2, 3]), 1)
      equal(stddev([1, 1, 1]), 0)
      equal(stddev([-100, 0, 100]), 100)
    })

    it('float', () => {
      equal(stddev([0.6, 0.8, 1]), 0.2)
      equal(stddev([-0.2, 0, 0.2]), 0.2)
    })

    it('empty array', () => {
      throws(() => stddev([]), {
        name: 'Error',
        message: 'Cannot calculate standard deviation of an empty array',
      })
    })
  })
})
