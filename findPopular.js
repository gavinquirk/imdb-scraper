const puppeteer = require('puppeteer');

const url = 'https://www.imdb.com/chart/moviemeter/';

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      // Open browser and go to url
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      // Evaluate page, query for elements
      let data = await page.evaluate(() => {
        let results = [];
        // Get lists of title, year, rating and image
        let titleList = document.querySelectorAll(
          'td[class="titleColumn"] > a'
        );
        // Reconstruct each result and push to results array
        for (i = 0; i < titleList.length; i++) {
          let result = {
            title: titleList[i].innerText,
          };
          results.push(result);
        }
        return results;
      });
      browser.close();
      return resolve(data);
    } catch (e) {
      return reject(e);
    }
  });
}
run().then(console.log).catch(console.error);
