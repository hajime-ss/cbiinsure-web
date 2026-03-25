const { scrapeQuotes } = require('./scraper.js');

(async () => {
    try {
        const results = await scrapeQuotes({
            year: '2024',
            brand: 'HONDA',
            model: 'CIVIC',
            submodel: '1.5',
            filterClass: 'ชั้น 1'
        });
        
        console.log("Found quotes:", results.data ? results.data.length : 0);
        if (results.data) {
            results.data.slice(0, 20).forEach(q => {
                console.log(`Pkg: ${q.packageName} | Prov: ${q.province} | isBKK: ${q.packageName.match(/กทม|กรุงเทพ|ปริมณฑล|BKK/i) ? 'yes' : 'no'} | isUPC: ${q.packageName.match(/ต่างจังหวัด|ตจว|UPC|ภาค|เหนือ|ใต้|อีสาน|ตะวันออก|ตะวันตก|ภูมิภาค/i) ? 'yes' : 'no'}`);
            });
        }
    } catch(err) {
        console.error(err);
    }
})();
