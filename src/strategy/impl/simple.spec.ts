import { describe, it } from 'node:test'
import { strict as assert } from 'assert'
import { SimpleStrategy } from './simple'

describe('Strategy: SimpleStrategy', () => {
  describe('shouldBuy', () => {
    it('should return a trading signal when conditions are met', () => {
      // Prepare data: last 3 days instTxs all positive and instTxs/volumes > 0.3 for one day
      const closes = Array(37).fill(100).concat([101, 102, 103])
      const volumes = Array(37).fill(1000).concat([1000, 1000, 1000])
      const instTxs = Array(37)
        .fill({ dealer: 0, investmentTrust: 0, foreignInvestor: 0 })
        .concat([
          { dealer: 100, investmentTrust: 150, foreignInvestor: 100 }, // 350/1000 = 0.35
          { dealer: 120, investmentTrust: 120, foreignInvestor: 120 }, // 360/1000 = 0.36
          { dealer: 200, investmentTrust: 200, foreignInvestor: 200 }, // 600/1000 = 0.6
        ])
      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldBuy()

      assert.ok(signal)
      assert.equal(signal.type, 'buy')
      assert.equal(signal.price, 101) // first day that meets instTxs/volumes > 0.3
      assert.ok(signal.strength > 0)
      assert.ok(signal.reason.includes('法人連續'))
    })

    it('should return undefined when chips condition is not met', () => {
      // instTxs not all positive
      const closes = Array(40).fill(100)
      const volumes = Array(40).fill(1000)
      const instTxs = Array(37)
        .fill({ dealer: 0, investmentTrust: 0, foreignInvestor: 0 })
        .concat([
          { dealer: -100, investmentTrust: 0, foreignInvestor: 0 },
          { dealer: 0, investmentTrust: 0, foreignInvestor: 0 },
          { dealer: 0, investmentTrust: 0, foreignInvestor: 0 },
        ])
      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldBuy()
      assert.equal(signal, undefined)
    })

    it('should return undefined when MA condition is not met', () => {
      // Chips condition met, but MA condition fails
      const closes = Array(37).fill(100).concat([101, 102, 103])
      const volumes = Array(37).fill(1000).concat([1000, 1000, 1000])
      const instTxs = Array(37)
        .fill({ dealer: 0, investmentTrust: 0, foreignInvestor: 0 })
        .concat([
          { dealer: 100, investmentTrust: 150, foreignInvestor: 100 },
          { dealer: 120, investmentTrust: 120, foreignInvestor: 120 },
          { dealer: 200, investmentTrust: 200, foreignInvestor: 200 },
        ])
      // Manipulate closes so MA condition fails
      closes[closes.length - 1] = 90
      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldBuy()
      assert.equal(signal, undefined)
    })

    it('should throw error if data arrays have different lengths', () => {
      const closes = Array(40).fill(100)
      const volumes = Array(39).fill(1000)
      const instTxs = Array(40).fill({
        dealer: 0,
        investmentTrust: 0,
        foreignInvestor: 0,
      })
      assert.throws(
        () => new SimpleStrategy(closes, volumes, instTxs),
        /Data arrays must have the same length/,
      )
    })

    it('should throw error if not enough data points', () => {
      const closes = Array(39).fill(100)
      const volumes = Array(39).fill(1000)
      const instTxs = Array(39).fill({
        dealer: 0,
        investmentTrust: 0,
        foreignInvestor: 0,
      })
      assert.throws(
        () => new SimpleStrategy(closes, volumes, instTxs),
        /Not enough data points/,
      )
    })
  })

  describe('shouldSell', () => {
    it('should return selling signal when institutions are distributing', () => {
      const closes = Array(38).fill(100).concat([101, 102])
      const volumes = Array(38).fill(1000).concat([1000, 1000])
      const instTxs = Array(38)
        .fill({ dealer: 0, investmentTrust: 0, foreignInvestor: 0 })
        .concat([
          { dealer: -200, investmentTrust: -100, foreignInvestor: -100 }, // -400/1000 = -0.4
          { dealer: -150, investmentTrust: -150, foreignInvestor: -100 }, // -400/1000 = -0.4
        ])

      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldSell()

      assert.ok(signal)
      assert.equal(signal.type, 'sell')
      assert.equal(signal.price, 102) // current price
      assert.ok(signal.strength > 0)
      assert.ok(signal.reason.includes('法人連續'))
    })

    it('should return selling signal when MA turns bearish', () => {
      const closes = Array(35).fill(100).concat([95, 94, 93, 92, 91]) // Declining prices for bearish MA
      const volumes = Array(40).fill(1000)
      const instTxs = Array(40).fill({
        dealer: 0,
        investmentTrust: 0,
        foreignInvestor: 0,
      })

      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldSell()

      assert.ok(signal)
      assert.equal(signal.type, 'sell')
      assert.equal(signal.price, 91) // current price
      assert.equal(signal.strength, 6)
      assert.ok(signal.reason.includes('MA排列轉為空頭'))
    })

    it('should return undefined when no selling conditions are met', () => {
      const closes = Array(40).fill(100)
      const volumes = Array(40).fill(1000)
      const instTxs = Array(40).fill({
        dealer: 0,
        investmentTrust: 0,
        foreignInvestor: 0,
      })

      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const signal = strategy.shouldSell()
      assert.equal(signal, undefined)
    })
  })

  describe('analyze', () => {
    it('should recommend buy when buy signal is stronger', () => {
      const closes = Array(37).fill(100).concat([101, 102, 103])
      const volumes = Array(37).fill(1000).concat([1000, 1000, 1000])
      const instTxs = Array(37)
        .fill({ dealer: 0, investmentTrust: 0, foreignInvestor: 0 })
        .concat([
          { dealer: 100, investmentTrust: 150, foreignInvestor: 100 },
          { dealer: 120, investmentTrust: 120, foreignInvestor: 120 },
          { dealer: 200, investmentTrust: 200, foreignInvestor: 200 },
        ])

      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const analysis = strategy.analyze()

      assert.equal(analysis.recommendation, 'buy')
      assert.ok(analysis.buySignal)
      assert.equal(analysis.buySignal.type, 'buy')
    })

    it('should recommend hold when no signals are present', () => {
      const closes = Array(40).fill(100)
      const volumes = Array(40).fill(1000)
      const instTxs = Array(40).fill({
        dealer: 0,
        investmentTrust: 0,
        foreignInvestor: 0,
      })

      const strategy = new SimpleStrategy(closes, volumes, instTxs)
      const analysis = strategy.analyze()

      assert.equal(analysis.recommendation, 'hold')
      assert.equal(analysis.buySignal, undefined)
      assert.equal(analysis.sellSignal, undefined)
    })
  })
})
