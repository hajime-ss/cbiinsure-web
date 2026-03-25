const { scrapeQuotes } = require('./scraper.js');

(async () => {
    try {
        console.log("Starting scrapeQuotes...");
        const results = await scrapeQuotes({
            year: '2024',
            brand: 'HONDA',
            model: 'CIVIC',
            submodel: '1.5',
            filterClass: 'ชั้น 1'
        });
        
        console.log("Quotes found:", results.data ? results.data.length : 0);
        if (results.data) {
            results.data.slice(0, 30).forEach((q, idx) => {
                console.log(`[${idx}] Company: ${q.companyAbbr} | Pkg: "${q.packageName}" | Prov: ${q.province}`);
            });
            
            // Show stats
            const bkk = results.data.filter(q => q.province === 'กทม.และปริมณฑล').length;
            const upc = results.data.filter(q => q.province === 'ต่างจังหวัด').length;
            const all = results.data.filter(q => q.province === 'ทั้งหมด').length;
            console.log(`\nTotals -> BKK: ${bkk}, UPC: ${upc}, ALl: ${all}`);
        }
    } catch(err) {
        console.error("Error running scraper directly:", err);
    }
})();
