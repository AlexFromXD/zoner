export interface InstTx {
  /**
   * 外資
   */
  foreignInvestor: number
  /**
   * 投信
   */
  investmentTrust: number
  /**
   * 自營商
   */
  dealer: number
}

export interface TradingSignal {
  /**
   * 訊號類型
   */
  readonly type: 'buy' | 'sell'
  /**
   * 建議價格
   */
  readonly price: number
  /**
   * 訊號強度 (1-10)
   */
  readonly strength: number
  /**
   * 訊號原因描述
   */
  readonly reason: string
}

export interface Strategy {
  readonly description: string
  /**
   * 收盤價
   */
  readonly closes: readonly number[]
  /**
   * 成交量
   */
  readonly volumes: readonly number[]
  /**
   * 法人買賣超（張數）
   */
  readonly instTxs: readonly InstTx[]

  /**
   * 檢查是否應該買入
   * @returns 買入訊號，若無訊號則返回 undefined
   */
  shouldBuy(): TradingSignal | undefined

  /**
   * 檢查是否應該賣出
   * @returns 賣出訊號，若無訊號則返回 undefined
   */
  shouldSell(): TradingSignal | undefined

  /**
   * 獲取目前的綜合分析
   */
  analyze(): {
    readonly buySignal?: TradingSignal
    readonly sellSignal?: TradingSignal
    readonly recommendation: 'buy' | 'sell' | 'hold'
  }
}
