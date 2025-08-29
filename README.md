# Zoner

A lightweight quantitative tool that analyzes price and volume data to identify buy and sell opportunities within range-bound stocks. It supports modular trading strategies and generates entry/exit signals for today, next week, and next month.

## 🎯 Features

- **籌碼K線分析**: 基於法人買賣超數據的籌碼分析
- **技術指標**: 支援移動平均線等常用技術指標
- **模組化策略**: 可插拔的交易策略系統
- **訊號評分**: 1-10 分的訊號強度評估
- **TypeScript**: 完整的型別安全保護

## 🏗️ Architecture

```
src/
├── cli.ts                    # 命令列介面
├── util/                     # 工具函數模組
│   ├── index.ts             # 統一導出
│   └── math/                # 數學計算
│       ├── basic.ts         # 基本數學函數
│       ├── statistics.ts    # 統計函數
│       └── indicators.ts    # 技術指標
├── strategy/                 # 交易策略模組
│   ├── strategy.ts          # 策略介面定義
│   └── impl/                # 策略實作
│       ├── simple.ts        # 簡單籌碼策略
│       └── simple.spec.ts   # 策略測試
└── refresh/                  # 數據抓取模組
    └── fetch-data.ts        # Yahoo Finance 爬蟲
```

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/AlexFromXD/zoner.git
cd zoner

# Install dependencies
pnpm install
```

### Development

```bash
# Run tests
npm test

# Build project
npm run build

# Start development mode
npm run start:dev
```

### Usage

```bash
# Refresh stock data
npm run start refresh 2330

# Calculate buy/sell signals
npm run start calc 2330
```

## 📊 Strategy Example

```typescript
import { SimpleStrategy } from './src/strategy/impl/simple'

// 準備數據
const closes = [100, 101, 102, 103, 104]
const volumes = [1000, 1200, 800, 1500, 900]
const instTxs = [
  { dealer: 50, investmentTrust: 100, foreignInvestor: 200 },
  { dealer: 80, investmentTrust: 120, foreignInvestor: 150 },
  // ... more data
]

// 建立策略
const strategy = new SimpleStrategy(closes, volumes, instTxs)

// 分析訊號
const analysis = strategy.analyze()
console.log(analysis.recommendation) // 'buy' | 'sell' | 'hold'

if (analysis.buySignal) {
  console.log(`買入訊號: ${analysis.buySignal.price}`)
  console.log(`強度: ${analysis.buySignal.strength}/10`)
  console.log(`原因: ${analysis.buySignal.reason}`)
}
```

## 🧪 Testing

我們使用 Node.js 原生測試執行器：

```bash
# 運行所有測試
npm test

# 測試特定模組
tsx --test src/util/__tests__/basic.spec.ts
```

測試檔案自動發現機制：

- 所有 `*.spec.ts` 檔案會被自動執行
- 支援巢狀目錄結構
- 零配置，零依賴

## 📈 Strategies

### SimpleStrategy

基於籌碼K線理論的簡單策略：

**買入條件:**

- 法人連續買超
- 買超量佔成交量 > 30%
- MA5 > MA10 > MA20 > MA40

**賣出條件:**

- 法人連續賣超 OR
- MA排列轉為空頭

**訊號強度計算:**

- 基於法人買賣超佔成交量比例
- 1-10 分評分系統

## 🛠️ Tech Stack

- **TypeScript**: 型別安全的開發體驗
- **Node.js 18+**: 原生測試執行器
- **Puppeteer**: 網頁數據抓取
- **Commander.js**: 命令列介面
- **tsx**: TypeScript 執行器

## 📝 Development Guidelines

- 遵循 **TDD** 開發流程
- 使用 `readonly` 陣列參數
- 函數保持小而可組合
- 遵循 Google TypeScript Style Guide
- 優先使用純函數設計

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
