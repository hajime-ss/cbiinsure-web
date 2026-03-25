const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching headless browser to inspect ANC Broker...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Intercept network requests
    page.on('request', async (request) => {
        if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
            console.log(`\n[REQUEST] ${request.method()} ${request.url()}`);
            if (request.postData()) {
                console.log(`PAYLOAD: ${request.postData()}`);
            }
        }
    });

    page.on('response', async (response) => {
        if (response.request().resourceType() === 'xhr' || response.request().resourceType() === 'fetch') {
            const url = response.url();
            console.log(`[RESPONSE] ${response.status()} ${url}`);
            try {
                if(url.includes('car') || url.includes('brand') || url.includes('model')) {
                    const text = await response.text();
                    console.log(`Snippet: ${text.substring(0, 300)}`);
                }
            } catch(e) {}
        }
    });

    try {
        await page.goto('https://www.ancbroker.com/', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log("ANC Broker page loaded.");
        
        // Wait and interact
        await new Promise(r => setTimeout(r, 2000));
        
        // Let's try to click or interact with form elements
        const selects = await page.$$('select');
        console.log(`Found ${selects.length} select dropdowns on ANC.`);
        
        for (let i = 0; i < selects.length; i++) {
            const props = await page.evaluate(el => ({id: el.id, name: el.name, class: el.className, options: el.options.length}), selects[i]);
            console.log(props);
        }

    } catch(e) {
        console.log("Error: ", e.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
})();
