const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

console.log("Class 1 Rows (.row.line-bt):", $('.row.line-bt').length);
console.log("Generic Rows (.row):", $('.row').length);

// Try to find the containers that have the price
let out = "--- Packages Found ---\n";
$('.box-items').each((i, el) => {
    out += `Found .box-items\n`;
});

// Let's just find elements containing "วิริยะประกันภัย"
$('*').each((i, el) => {
    const text = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim();
    if (text === 'วิริยะประกันภัย') {
        const parentHtml = $(el).parent().parent().parent().html().replace(/\s+/g, ' ').substring(0, 300);
        out += `Found "วิริยะประกันภัย" in tag ${el.tagName}, classes: ${$(el).attr('class')}\nParent tree HTML: ${parentHtml}\n\n`;
    }
});

// Find pricing (7,000)
$('*').each((i, el) => {
    const text = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim();
    if (text.includes('7,000') || text.includes('7,300') || text.includes('5,500')) {
        const parentHtml = $(el).parent().parent().html().replace(/\s+/g, ' ').substring(0, 200);
        out += `Found Price ${text} in tag ${el.tagName}, classes: ${$(el).attr('class')}\nParent HTML: ${parentHtml}\n\n`;
    }
});

fs.writeFileSync('parse_class2.txt', out);
console.log("Done checking structures, see parse_class2.txt");
