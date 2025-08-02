import { Command } from 'commander'

const program = new Command()

program
  .name('zoner')
  .description('Calculate stock buy in and sell out prices')
  .version('0.0.1')

program
  .command('refresh')
  .description('Fetch new stock data for calculation')
  .argument('<string>', 'The stock code to refresh')

program
  .command('calc')
  .description('Calculate buy in and sell out prices for a stock')
  .argument('<string>', 'The stock code to calculate')

program.parse()
