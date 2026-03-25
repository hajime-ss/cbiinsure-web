const fs = require('fs');
const { scrapeQuotes } = require('./scraper');

async function run() {
    const res = await scrapeQuotes({
        year: '2024',
        brand: 'HONDA',
        model: 'CIVIC',
        submodel: 'CIVIC 1.5 5 ประตู (1498CC. )'
    });
    fs.writeFileSync('puppeteer_output.json', JSON.stringify(res, null, 2));
    console.log("Done! Check puppeteer_output.json");
}

run();
