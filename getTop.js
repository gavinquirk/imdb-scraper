const puppeteer = require('puppeteer');
const IMDB_URL = `https://www.imdb.com/chart/top/`;
(async () => {
  // Open browser and go to imdb popular page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(IMDB_URL, { waitUntil: 'networkidle0' });

  // Scrape data
  let data = await page.evaluate(() => {
    let results = [];
    // Get base table
    let tableElement = document.querySelector('tbody[class="lister-list"]');

    // Get table rows
    let tableRows = tableElement.querySelectorAll('tr');

    tableRows.forEach((row) => {
      // Get data for each element
      let smallPoster = row
        .querySelector('td[class="posterColumn"] > a > img')
        .getAttribute('src');

      let title = row.querySelector('td[class="titleColumn"] > a').innerText;

      let imdbId = row
        .querySelector('td[class="titleColumn"] > a')
        .getAttribute('href')
        .substring(9, 16);

      let year = parseInt(
        row
          .querySelector('td[class="titleColumn"] > span')
          .innerText.substring(1, 5)
      );

      const getRating = () => {
        const ratingElement = row.querySelector(
          'td[class="ratingColumn imdbRating"] > strong'
        );

        if (!ratingElement) return null;

        const rating = parseFloat(ratingElement.innerText);

        return rating;
      };

      let rating = getRating();

      let imdbURL = `https://www.imdb.com/title/tt${imdbId}/`;

      // Place data into result obj
      const result = {
        title,
        year,
        rating,
        smallPoster,
        imdbId,
        imdbURL,
      };

      // Push result into results array
      results.push(result);
    });

    return results;
  });
  console.log(data);
  await browser.close();
})();
