const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://secc.gov.in/getAllHhdSummaryNationalReport.htm");

  while (!(await page.$(".paginate_button.page-item.next.disabled"))) {
    await page.click(".paginate_button.page-item.next");
  }

  //await browser.close();
})();
