const puppeteer = require('puppeteer');

async function test() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const url = 'https://www.ancbroker.com/%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%81%e0%b8%b1%e0%b8%99%e0%b8%a0%e0%b8%b1%e0%b8%a2%e0%b8%a3%e0%b8%96%e0%b8%a2%e0%b8%99%e0%b8%95%e0%b9%8c-%e0%b8%8a%e0%b8%b1%e0%b9%89%e0%b8%991/MERCEDES-BENZ-E200-%e0%b8%9b%e0%b8%b52024-%e0%b9%84%e0%b8%a1%e0%b9%88%e0%b8%a1%e0%b8%b5%e0%b8%84%e0%b9%88%e0%b8%b2%e0%b9%80%e0%b8%aa%e0%b8%b5%e0%b8%a2%e0%b8%ab%e0%b8%b2%e0%b8%a2%e0%b8%aa%e0%b9%88%e0%b8%a7%e0%b8%99%e0%b9%81%e0%b8%a3%e0%b8%81-id2493-n-n';
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    console.log("Loaded default page");
    
    await page.evaluate(() => document.querySelector('#ContentPlaceHolder_Filter_DD1').click());
    await new Promise(r => setTimeout(r, 7000));
    
    await page.screenshot({ path: 'debug_dd1.png', fullPage: true });
    console.log("Screenshot saved.");
    await browser.close();
}
test();
