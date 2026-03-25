const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Intercept network requests
    page.on('response', async (response) => {
        const url = response.url();
        const type = response.request().resourceType();
        
        if (type === 'xhr' || type === 'fetch') {
            if (url.includes('api') || url.includes('year') || url.includes('brand') || url.includes('model')) {
                console.log(`\n--- INTERCEPTED: ${url} ---`);
                try {
                    const text = await response.text();
                    console.log(`Snippet: ${text.substring(0, 150)}`);
                } catch(e) {}
            }
        }
    });

    try {
        console.log("Navigating to ANC/Prakun Dropdown endpoint...");
        await page.goto('https://www.prakun.com/car-insurance/', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log("Initial page loaded. Simulating user interactions if needed...");
        
        // Let's try to trigger a change on the year dropdown if it exists
        try {
            await page.select('select[name="year"]', '2024');
            await new Promise(r => setTimeout(r, 2000));
        } catch(e) { /* Dropdown might not exist or be named differently */ }
        
    } catch(e) {
        console.log("Error during navigation: ", e.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
})();
