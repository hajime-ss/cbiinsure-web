const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- SIDEBAR BUTTONS ---');
$('a.btn, button.btn, .btn').each((i, el) => {
    const text = $(el).text().trim();
    if (text) console.log(text);
});
