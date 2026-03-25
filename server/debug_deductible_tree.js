const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- FINDING DEDUCTIBLE TEXT ---');
$('.row.line-bt').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ');
    if (text.includes('3,000') || text.includes('เสียหาย')) {
        console.log(`\nRow ${i}:`);
        console.log(`Package: ${$(el).find('.PACKNAMECUS').text().trim()}`);
        console.log(`Price: ${$(el).find('.OFFER_PRICE').text().trim()}`);
        
        // Let's dump the text of every child to find where the 3,000 is hidden
        $(el).find('*').each((j, child) => {
            const childText = $(child).contents().filter(function() { return this.type === 'text' && this.data.trim().length > 0; }).text().trim();
            if (childText.includes('3,000') || childText.includes('เสียหาย')) {
                console.log(`  -> Found in class: ${$(child).attr('class') || 'None'} (${child.tagName}): ${childText}`);
            }
        });
    }
});
