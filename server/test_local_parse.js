const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prakun_results.html', 'utf8');
const $ = cheerio.load(html);

const results = [];

$('.row.line-bt').each((index, el) => {
    
    // Try Class 1 format (hidden inputs)
    const premiumInput = $(el).find('input[id*="_Hid_qsub_vmi_PREMIUM"]');
    const insInput = $(el).find('input[id*="_Hid_qsub_vmi_INS"]');
    
    // Try Class 2+ format (spans/imgs)
    let offerPriceEl = $(el).find('.OFFER_PRICE span');
    if (offerPriceEl.length === 0) offerPriceEl = $(el).find('.OFFER_PRICE');
    if (offerPriceEl.length === 0) offerPriceEl = $(el).find('.FIX2');
    if (offerPriceEl.length === 0) offerPriceEl = $(el).find('.PREMIUM'); // sometimes they only have premium?
    
    const cpNameSpan = $(el).find('.CPNAME');
    const insImg = $(el).find('img[id*="_INS_"]'); 

    if (premiumInput.length === 0 && offerPriceEl.length === 0) {
        console.log(`Row ${index} skipped: No premiumInput or offerPriceEl`);
        return; // Not a quote row
    }
    
    let rawPrice = '0';
    let companyCodeString = 'Unknown';
    let companyThaiName = '';

    if (premiumInput.length > 0) {
        rawPrice = premiumInput.val();
        companyCodeString = insInput.length ? insInput.val() : 'Unknown';
    } else if (offerPriceEl.length > 0) {
        rawPrice = offerPriceEl.text().replace(/[^0-9,.]/g, '').trim();
        if (insImg.length > 0) {
            const parts = insImg.attr('src').split('/');
            companyCodeString = parts[parts.length - 1].split('.')[0]; 
        }
        if (cpNameSpan.length > 0) companyThaiName = cpNameSpan.text().trim();
    }
    
    console.log(`Row ${index} Captured: Price=${rawPrice}, Code=${companyCodeString}, ThaiName=${companyThaiName}`);
});

console.log(`Total quotes captured: ${results.length}`);
