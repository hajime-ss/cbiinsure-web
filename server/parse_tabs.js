const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

let out = "--- Elements with ชั้น ---\n";
$('div, a, span, button').each((i, el) => {
    const txt = $(el).text().trim();
    if (txt === 'ชั้น 1' || txt === 'ชั้น 2+' || txt === 'ชั้น 3+' || txt === 'ชั้น 3' || txt === 'ชั้น 2') {
        out += `Tag: ${el.tagName}, ID: ${$(el).attr('id') || ''}, Class: ${$(el).attr('class') || ''}, Text: ${txt}\n`;
    }
});

fs.writeFileSync('tabs2.txt', out);
console.log("Done");
