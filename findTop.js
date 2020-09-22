const puppeteer = require('puppeteer');
const IMDB_URL = `https://www.imdb.com/chart/top/`;
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(IMDB_URL, { waitUntil: 'networkidle0' });

  let data = await page.evaluate(() => {
    let title = document.querySelector('td[class="titleColumn"] > a').innerText;
    let year = parseInt(
      document
        .querySelector('td[class="titleColumn"] > span')
        .innerText.substring(1, 5)
    );
    let rating = parseFloat(
      document.querySelector('td[class="ratingColumn imdbRating"] > strong')
        .innerText
    );
    let image = document
      .querySelector('td[class="posterColumn"] > a > img')
      .getAttribute('src');
    return {
      title,
      year,
      rating,
      image,
    };
  });
  console.log(data);
  await browser.close();
})();
