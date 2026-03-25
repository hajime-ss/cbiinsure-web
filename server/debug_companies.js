const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

const companies = new Map();

$('.row.line-bt').each((i, el) => {
    let code = 'Unknown';
    let name = '';
    
    const insImg = $(el).find('img[src*="/ins/"]');
    if (insImg.length) {
        const src = insImg.attr('src');
        const parts = src.split('/');
        code = parts[parts.length - 1].split('.')[0];
    }
    
    const cpNameSpan = $(el).find('.CPNAME');
    if (cpNameSpan.length) {
        name = cpNameSpan.text().trim();
    }
    
    if (code !== 'Unknown' || name !== '') {
        companies.set(code, name);
    }
});

console.log('--- ANC Companies ---');
for (const [code, name] of companies.entries()) {
    console.log(`${code}: ${name}`);
}
