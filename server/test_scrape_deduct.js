const puppeteer = require('puppeteer');
const ANC_URL = 'https://www.ancbroker.com/';

async function testScrape() {
    console.log("Starting Puppeteer test...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto(ANC_URL, { waitUntil: 'domcontentloaded' });

    // Select Year
    await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"]');
    await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"]', '2024');
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));

    // Try selecting Honda
    const brandVal = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option'));
        const match = options.find(o => o.textContent.toUpperCase().includes('HONDA'));
        return match ? match.value : null;
    });
    if(brandVal) await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"]', brandVal);
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));

    // Try selecting Civic
    const modelVal = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option'));
        const match = options.find(o => o.textContent.toUpperCase().includes('CIVIC'));
        return match ? match.value : null;
    });
    if(modelVal) await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"]', modelVal);
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
    
    // Select any Submodel
    try {
        await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option:not([value="0"])', { timeout: 3000 });
        const submodelVal = await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option'));
            return options[1].value;
        });
        await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"]', submodelVal);
    } catch(e) {}

    console.log("Submitting form...");
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
        page.click('#ContentPlaceHolder_ucIntro_btCal2')
    ]);

    console.log("Loaded results page:", page.url());
    await new Promise(r => setTimeout(r, 5000));
    
    // Extract HTML of one element that has "เสียหายส่วนแรก"
    const htmlSnippet = await page.evaluate(() => {
        const rows = document.querySelectorAll('.row.line-bt');
        let txt = '';
        for(let el of rows) {
            if (el.innerText.includes('เสียหายส่วนแรก')) {
                txt += "Row innerText: \n" + el.innerText + "\n\n";
                txt += "Row outerHTML: \n" + el.outerHTML + "\n\n";
                break;
            }
        }
        return txt;
    });

    console.log("\n--- HTML DUMP ---");
    console.log(htmlSnippet || "No element with 'เสียหายส่วนแรก' found!");
    
    await browser.close();
}

testScrape().catch(console.error);
