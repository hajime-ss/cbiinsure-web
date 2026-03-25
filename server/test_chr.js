const { scrapeQuotes } = require('./scraper.js');

async function test() {
    try {
        console.log("Testing scraper for TOYOTA C-HR...");
        const params = {
            year: '2026', 
            brand: 'TOYOTA',
            model: 'C-HR',
            submodel: '1.8', 
            filterClass: 'ชั้น 1'
        };
        const result = await scrapeQuotes(params);
        console.dir(result.data.filter(q => q.company.includes('TVI') || q.company.includes('ประกันภัยไทยวิวัฒน์')), { depth: null });
        console.log("Total quotes:", result.count);
    } catch(e) {
        console.error("FATAL ERROR:", e);
    }
}

test();
