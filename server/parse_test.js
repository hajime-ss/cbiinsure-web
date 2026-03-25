const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

$('.row.line-bt').each((i, el) => {
    if (i > 3) return; // Print first 4
    const rowText = $(el).text();
    let garage = 'อู่และห้าง';
    if ($(el).find('.FIX1').length) garage = 'ห้าง (VIA CLASS)';
    else if ($(el).find('.FIX2').length) garage = 'อู่ (VIA CLASS)';
    else if (rowText.includes('ห้าง')) garage = 'ห้าง (VIA TEXT)';
    else if (rowText.includes('อู่')) garage = 'อู่ (VIA TEXT)';
    
    console.log(`Quote ${i} Garage: ${garage}`);
});
