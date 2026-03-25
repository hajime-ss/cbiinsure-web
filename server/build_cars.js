const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

const URL = 'https://www.ancbroker.com/';

async function scrapeCarPath() {
    try {
        console.log("1. Fetching ANC Broker homepage...");
        let res = await axios.get(URL);
        let $ = cheerio.load(res.data);

        // Initial ViewState
        let viewState = $('#__VIEWSTATE').val();
        let viewStateGen = $('#__VIEWSTATEGENERATOR').val();
        let eventValidation = $('#__EVENTVALIDATION').val();

        // Get Years
        const years = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(y => y.val !== '0');
        console.log(`Found ${years.length} Years. E.g., ${years[0].text}`);
        
        const targetYear = '2024';

        console.log(`\n2. Selecting Year ${targetYear}...`);
        const payload1 = {
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear',
            '__EVENTARGUMENT': '',
            '__VIEWSTATE': viewState,
            '__VIEWSTATEGENERATOR': viewStateGen,
            '__EVENTVALIDATION': eventValidation,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': targetYear
        };

        res = await axios.post(URL, qs.stringify(payload1), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' } });
        $ = cheerio.load(res.data);
        
        viewState = $('#__VIEWSTATE').val();
        viewStateGen = $('#__VIEWSTATEGENERATOR').val();
        eventValidation = $('#__EVENTVALIDATION').val();

        const brands = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(b => b.val !== '0');
        console.log(`Found ${brands.length} Brands for 2024. Top 5:`, brands.slice(0, 5).map(b => b.text).join(', '));
        
        const targetBrand = brands.find(b => b.text.toUpperCase() === 'HONDA')?.val || brands[0].val;
        console.log(`\n3. Selecting Brand ${targetBrand}...`);
        
        const payload2 = {
            ...payload1,
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand',
            '__VIEWSTATE': viewState,
            '__VIEWSTATEGENERATOR': viewStateGen,
            '__EVENTVALIDATION': eventValidation,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand': targetBrand
        };

        res = await axios.post(URL, qs.stringify(payload2), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' } });
        $ = cheerio.load(res.data);
        
        const models = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(m => m.val !== '0');
        console.log(`Found ${models.length} Models for Honda. Top 5:`, models.slice(0, 5).map(m => m.text).join(', '));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

scrapeCarPath();
