import {
  launch,
  Page,
  type WaitForOptions,
  type WaitForSelectorOptions,
} from 'puppeteer'

export async function fetch(code: string): Promise<void> {
  const browser = await launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 1080,
    },
  })

  const page = await browser.newPage()
  await page.goto('https://hk.finance.yahoo.com', {
    waitUntil: 'load',
  })

  for (let i = 0; i < code.length; i++) {
    await page.type('#ybar-sbq', code[i] as string, {
      delay: 100,
    })
  }

  const firstSymbol =
    'div.finsrch-rslt > div > div[data-id="search-assist-input-sugglst"] > ul[role="listbox"]:nth-child(2) >:nth-child(1)'

  await clickAndLoad(page, firstSymbol)

  const historyButton =
    '#nimbus-app > section > section > aside > section > nav > ul > li:nth-child(5) > a > span'
  await clickAndLoad(page, historyButton)

  const timePicker =
    '#main-content-wrapper > div.container > div.container.yf-e8ilep > div.menuContainer.yf-1l5q6k1 > button > span'

  await click(page, timePicker)

  const fiveYearsButton =
    '#menu-65 > div > section > div.quickpicks.yf-1th5n0r > button:nth-child(7)'

  await clickAndLoad(page, fiveYearsButton)

  await page.waitForSelector(
    '#main-content-wrapper > div.container > div.table-container > table',
    {
      visible: true,
    },
  )
}

async function click(
  page: Page,
  selector: string,
  options?: WaitForSelectorOptions,
): Promise<void> {
  await page.waitForSelector(selector, {
    visible: options?.visible ?? true,
  })
  await page.click(selector)
}

async function clickAndLoad(
  page: Page,
  selector: string,
  options?: ClickAndLoadOptions,
): Promise<void> {
  await page.waitForSelector(selector, {
    visible: options?.visible ?? true,
  })

  await Promise.all([
    page.evaluate((selector: string) => {
      document.querySelector<HTMLButtonElement>(selector)?.click()
    }, selector),
    page.waitForNavigation({
      waitUntil: options?.waitUntil ?? 'load',
    }),
  ])
}

type ClickAndLoadOptions = WaitForSelectorOptions & WaitForOptions
