const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- DEDUCTIBLE FILTER HTML ---');
const el = $('#ContentPlaceHolder_Filter_DD2');
if (el.length) {
    console.log(el.parent().parent().html());
}
