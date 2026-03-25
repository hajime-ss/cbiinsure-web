const { scrapeQuotes } = require('./scraper');

async function test() {
    console.log("Starting test scrape...");
    try {
        const result = await scrapeQuotes({
            brand: 'HONDA',
            model: 'CIVIC',
            year: '2024',
            filterClass: 'ชั้น 1'
        });
        
        if (!result.success) {
            console.error(result);
            return;
        }
        console.log(`Total quotes fetched: ${result.data.length}`);
        
        const fs = require('fs');
        const output = [];
        for (const q of result.data) {
            output.push(`Package: "${q.packageName}" => Province: [${q.province}]`);
        }
        fs.writeFileSync('test_output.json', JSON.stringify(output, null, 2));
        console.log("Done");
    } catch(err) {
        console.error("Error:", err);
    }
}
test();
