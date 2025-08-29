import { sma } from '../../util'
import { InstTx, Strategy, TradingSignal } from '../strategy'

/**
 * 籌碼分析結果
 */
interface ChipAnalysis {
  readonly isSupported: boolean
  readonly isDistributing: boolean
  readonly referencePrice: number
  readonly strength: number
  readonly supportDays: number
  readonly distributionDays: number
  readonly distributionStrength: number
}

export class SimpleStrategy implements Strategy {
  readonly description = 'Check chips & MA only'

  constructor(
    readonly closes: readonly number[],
    readonly volumes: readonly number[],
    readonly instTxs: readonly InstTx[],
  ) {
    if (
      this.closes.length !== this.volumes.length ||
      this.closes.length !== this.instTxs.length
    ) {
      throw new Error('Data arrays must have the same length')
    }

    if (this.closes.length < 40) {
      throw new Error('Not enough data points to apply strategy')
    }
  }

  /**
   * @returns 籌碼分析結果
   */
  private _checkChips(): ChipAnalysis {
    /**
     * 法人買超的量佔整體交易量的比例
     */
    const volumesThreshold = 0.3
    /**
     * 籌碼要往回看幾天
     */
    const chipsCheckPeriod = 3
    const volumes = this.volumes.slice(-chipsCheckPeriod)
    const closes = this.closes.slice(-chipsCheckPeriod)
    const instTxs = this.instTxs.slice(-chipsCheckPeriod).map((tx) => {
      return tx.dealer + tx.investmentTrust + tx.foreignInvestor
    })

    let supportDays = 0
    let distributionDays = 0
    let referencePrice = 0
    let supportStrength = 0

    // 檢查買超支撐
    const isContinuousBuy = instTxs.every((tx) => tx > 0)
    if (isContinuousBuy) {
      for (let i = 0; i < instTxs.length; i++) {
        const instTxVolume = Math.abs(instTxs[i])
        const totalVolume = volumes[i]
        const ratio = instTxVolume / totalVolume

        if (ratio > volumesThreshold) {
          supportDays++
          if (referencePrice === 0) {
            referencePrice = closes[i]
          }
          supportStrength = Math.max(supportStrength, Math.min(ratio * 10, 10))
        }
      }
    }

    // 檢查賣超分布
    const recentInstTxs = instTxs.slice(-2) // 檢查最近2天
    const isContinuousSell = recentInstTxs.every((tx) => tx < 0)
    let distributionStrength = 0

    if (isContinuousSell) {
      distributionDays = recentInstTxs.length
      const recentVolumes = volumes.slice(-2)

      for (let i = 0; i < recentInstTxs.length; i++) {
        const instTxVolume = Math.abs(recentInstTxs[i])
        const totalVolume = recentVolumes[i]
        const ratio = instTxVolume / totalVolume
        distributionStrength = Math.max(
          distributionStrength,
          Math.min(ratio * 10, 10),
        )
      }
    }

    return {
      isSupported: supportDays > 0,
      isDistributing: distributionDays > 0,
      referencePrice: referencePrice || this.closes[this.closes.length - 1],
      strength: Math.round(supportStrength),
      supportDays,
      distributionDays,
      distributionStrength: Math.round(distributionStrength),
    }
  }

  shouldBuy(): TradingSignal | undefined {
    const chipAnalysis = this._checkChips()
    if (!chipAnalysis.isSupported) {
      return undefined
    }

    const ma5 = sma(this.closes, 5)
    const ma10 = sma(this.closes, 10)
    const ma20 = sma(this.closes, 20)
    const ma40 = sma(this.closes, 40)

    const isBullishMA = [ma5 > ma10, ma10 > ma20, ma20 > ma40].every((x) => x)

    if (isBullishMA) {
      return {
        type: 'buy',
        price: chipAnalysis.referencePrice,
        strength: chipAnalysis.strength,
        reason: `法人連續 ${chipAnalysis.supportDays} 日買超，MA排列多頭，建議價位 ${chipAnalysis.referencePrice}`,
      }
    }

    return undefined
  }

  shouldSell(): TradingSignal | undefined {
    const chipAnalysis = this._checkChips()

    // 法人開始賣超，產生賣出訊號
    if (chipAnalysis.isDistributing) {
      const currentPrice = this.closes[this.closes.length - 1]

      return {
        type: 'sell',
        price: currentPrice,
        strength: chipAnalysis.distributionStrength,
        reason: `法人連續 ${chipAnalysis.distributionDays} 日賣超，建議減碼或停損`,
      }
    }

    // 檢查MA是否轉弱
    const ma5 = sma(this.closes, 5)
    const ma10 = sma(this.closes, 10)
    const ma20 = sma(this.closes, 20)

    const isBearishMA = ma5 < ma10 && ma10 < ma20

    if (isBearishMA) {
      const currentPrice = this.closes[this.closes.length - 1]

      return {
        type: 'sell',
        price: currentPrice,
        strength: 6,
        reason: 'MA排列轉為空頭，建議減碼',
      }
    }

    return undefined
  }

  analyze(): {
    readonly buySignal?: TradingSignal
    readonly sellSignal?: TradingSignal
    readonly recommendation: 'buy' | 'sell' | 'hold'
  } {
    const buySignal = this.shouldBuy()
    const sellSignal = this.shouldSell()

    let recommendation: 'buy' | 'sell' | 'hold' = 'hold'

    if (
      buySignal &&
      (!sellSignal || buySignal.strength > sellSignal.strength)
    ) {
      recommendation = 'buy'
    } else if (
      sellSignal &&
      (!buySignal || sellSignal.strength > buySignal.strength)
    ) {
      recommendation = 'sell'
    }

    return {
      buySignal,
      sellSignal,
      recommendation,
    }
  }
}
