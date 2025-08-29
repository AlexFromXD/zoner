import { equal, throws } from 'assert'
import { avg, max, min } from '../math/basic'
import { describe, it } from 'node:test'

describe('basic math', () => {
  describe('avg', () => {
    it('integer', () => {
      equal(avg([1, 1, 1]), 1)
      equal(avg([2, 2, 2]), 2)
      equal(avg([1, 2, 3]), 2)
      equal(avg([-100, 0, 100]), 0)
    })

    it('float', () => {
      equal(avg([0.6, 0.8, 1]), 0.8)
      equal(avg([-0.2, 0, 0.2]), 0)
    })

    it('large array', () => {
      equal(avg(new Array(10000).fill(1)), 1)
    })
  })

  describe('max', () => {
    it('integer', () => {
      equal(max([1, 2, 3]), 3)
      equal(max([-1, -2, -3]), -1)
      equal(max([0, 0, 0]), 0)
    })

    it('float', () => {
      equal(max([0.1, 0.2, 0.3]), 0.3)
      equal(max([-0.1, -0.2, -0.3]), -0.1)
    })

    it('empty array', () => {
      throws(() => max([]), {
        name: 'Error',
        message: 'Cannot find max of an empty array',
      })
    })
  })

  describe('min', () => {
    it('integer', () => {
      equal(min([1, 2, 3]), 1)
      equal(min([-1, -2, -3]), -3)
      equal(min([0, 0, 0]), 0)
    })

    it('float', () => {
      equal(min([0.1, 0.2, 0.3]), 0.1)
      equal(min([-0.1, -0.2, -0.3]), -0.3)
    })

    it('empty array', () => {
      throws(() => min([]), {
        name: 'Error',
        message: 'Cannot find min of an empty array',
      })
    })
  })
})
