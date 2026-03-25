const { scrapeQuotes } = require('./scraper.js');

async function test() {
    try {
        console.log("Testing scraper for Mercedes-Benz E200...");
        const params = {
            year: '2024',
            brand: 'MERCEDES-BENZ',
            model: 'E200',
            submodel: 'COUPE AMG DYNAMIC',
            filterClass: 'ชั้น 2+'
        };
        const result = await scrapeQuotes(params);
        console.dir(result, { depth: null });
        console.log("Quotes found:", result.count);
    } catch(e) {
        console.error("FATAL ERROR:", e);
    }
}

test();
