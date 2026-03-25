const axios = require('axios');
const cheerio = require('cheerio');

async function probeAPI() {
    try {
        console.log("Fetching Prakun homepage...");
        const res = await axios.get('https://www.prakun.com/car-insurance/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const $ = cheerio.load(res.data);
        
        // Let's see if the Year or Brand dropdowns are pre-populated in the HTML
        const yearOptions = $('select[name="year"] option, select#year option, select.year option').length;
        const brandOptions = $('select[name="brand"] option, select#brand option, select.brand option').length;
        
        console.log(`Found ${yearOptions} Year options in HTML`);
        console.log(`Found ${brandOptions} Brand options in HTML`);
        
        // Find any hidden input fields storing API URLs
        const inputs = $('input[type="hidden"]').map((i, el) => $(el).attr('id') + '=' + $(el).val()).get();
        console.log("\nHidden Inputs:", inputs.filter(i => i.includes('url') || i.includes('api')));

        // Find scripts
        const scripts = $('script').map((i, el) => $(el).text()).get().join('\n');
        
        const fetches = scripts.match(/(get|post)\(['"]([^'"]+)['"]/ig);
        console.log("\nAJAX POST/GET Calls in inline scripts:", fetches ? [...new Set(fetches)].slice(0, 10) : "None");
        
        const apis = scripts.match(/https?:\/\/[^\s'"]+api[^\s'"]+/ig);
        console.log("\nAPI-like strings in scripts:", apis ? [...new Set(apis)] : "None");

    } catch (e) {
        console.error("Error:", e.message);
    }
}
probeAPI();
