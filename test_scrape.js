const { scrapeQuotes } = require('./server/scraper');

(async () => {
    try {
        const quotes = await scrapeQuotes({
            brand: 'HONDA',
            model: 'CITY',
            submodel: '1.0',
            year: '2023',
            filterClass: 'ชั้น 1'
        });
        
        console.log("Quotes extracted:", quotes.data ? quotes.data.length : 0);
        if (quotes.data && quotes.data.length > 0) {
            // Log just the package names and provinces extracted
            for (let q of quotes.data.slice(0, 10)) {
                console.log(`Package: ${q.packageName} => Province: ${q.province}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
})();
