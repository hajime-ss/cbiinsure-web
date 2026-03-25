const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- FINDING VIRIYAH 26,500 ---');
$('.row.line-bt').each((i, el) => {
    const packageName = $(el).find('.PACKNAMECUS').text().trim();
    const priceText = $(el).find('.PRICE').text().trim();
    if (packageName.includes('VIB') || packageName.includes('วิริยะ')) {
        console.log(`\nPackage: ${packageName}`);
        console.log(`Price: ${priceText}`);
        console.log(`Attributes:`, el.attribs);
    }
});
