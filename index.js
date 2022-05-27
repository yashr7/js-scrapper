const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://secc.gov.in/getAllHhdSummaryNationalReport.htm");

  const grabHead = await page.evaluate(() => {
    const heads = document.querySelectorAll("#DataTables_Table_0 thead tr th");
    return Array.from(heads, (head) => head.innerText);
  });

  let run_once_more = true;
  let data = [grabHead];
  let grabContent;
  while (
    !(await page.$(".paginate_button.page-item.next.disabled")) ||
    run_once_more
  ) {
    if (await page.$(".paginate_button.page-item.next.disabled")) {
      run_once_more = false;
    }
    grabContent = await page.evaluate(() => {
      const rows = document.querySelectorAll("#DataTables_Table_0 tbody tr");
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td");
        return Array.from(columns, (column) => column.textContent);
      });
    });

    data.push(...grabContent);

    await page.click(".paginate_button.page-item.next");
  }
  // console.log(data);
  await browser.close();

  const arrayToCSV = (arr, delimiter = ",") =>
    arr
      .map((v) =>
        v
          .map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x))
          .join(delimiter)
      )
      .join("\n");

  console.log(data);
  const csv = arrayToCSV(data);
  fs.writeFileSync("data.csv", csv);
})();
