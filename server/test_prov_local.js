const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

const results = [];

$('.row.line-bt').each((index, el) => {
    let packageName = $(el).find('.PACKNAMECUS').length ? $(el).find('.PACKNAMECUS').text().trim() : '';
    if (!packageName) {
        packageName = $(el).attr('data-title') || '';
    }
    
    let province = 'ทั้งหมด';
    if (packageName) {
        const pkgUpper = packageName.toUpperCase();
        
        const bkkKeywords = ['กทม', 'กรุงเทพ', 'ปริมณฑล', 'BKK'];
        const upcKeywords = ['ต่างจังหวัด', 'ตจว', 'UPC', 'ภูมิภาค', 'ภาคเหนือ', 'ภาคใต้', 'ภาคอีสาน', 'ภาคตะวันออก', 'ภาคตะวันตก'];
        
        const isBKK = bkkKeywords.some(kw => pkgUpper.includes(kw.toUpperCase()));
        const isUPC = upcKeywords.some(kw => pkgUpper.includes(kw.toUpperCase()));
        
        if (isBKK && !isUPC) {
            province = 'กทม.และปริมณฑล';
        } else if (isUPC && !isBKK) {
            province = 'ต่างจังหวัด';
        }
        
        results.push({ packageName, province, isBKK, isUPC });
    } else {
        results.push({ packageName: '', province: 'ทั้งหมด', isBKK: false, isUPC: false });
    }
});

fs.writeFileSync('quotes_debug.json', JSON.stringify(results, null, 2));
console.log("Wrote quotes_debug.json");
