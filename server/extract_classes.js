const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('prakun_results.html', 'utf-8');
const $ = cheerio.load(html);

let out = "Analyzing .panel.panel-default\n";
$('.panel.panel-default').slice(0, 2).each((i, el) => {
    out += `\n\n--- Panel ${i} ---\n`;
    out += $(el).html().substring(0, 3000);
});

out += "\n\nAnalyzing rows with price\n";
$('.row.line-bt').slice(0, 2).each((i, el) => {
    out += `\n\n--- Row ${i} ---\n`;
    out += $(el).html().substring(0, 3000);
});

fs.writeFileSync('prakun_snippets.txt', out);
console.log("Saved to prakun_snippets.txt");
