const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');

const ANC_URL = 'https://www.ancbroker.com/';

async function testFetchQuotes() {
    try {
        console.log("1. Fetching ANC Broker homepage to get initial ViewState...");
        let res = await axios.get(ANC_URL);
        let $ = cheerio.load(res.data);
        
        let __VIEWSTATE = $('#__VIEWSTATE').val();
        let __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        let __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        // Target: 2024 -> HONDA -> CIVIC (we need their exact IDs)
        // From previous run: Year is '2024'. Let's fetch Brands for 2024 to get Honda ID.
        let payload = {
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear',
            '__EVENTARGUMENT': '',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': '2024'
        };

        res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        $ = cheerio.load(res.data);
        __VIEWSTATE = $('#__VIEWSTATE').val();
        __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        const brands = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get();
        const honda = brands.find(b => b.text.includes('HONDA'));
        
        console.log("Found Honda ID:", honda.val);

        payload = {
            ...payload,
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand': honda.val
        };

        res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        $ = cheerio.load(res.data);
        __VIEWSTATE = $('#__VIEWSTATE').val();
        __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        const models = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get();
        const civic = models.find(m => m.text.includes('CIVIC'));
        console.log("Found Civic ID:", civic.val);

        payload = {
            ...payload,
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarModel',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarModel': civic.val
        };

        res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        $ = cheerio.load(res.data);
        __VIEWSTATE = $('#__VIEWSTATE').val();
        __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        const submodels = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get();
        const submodel = submodels.find(s => s.val !== '0') || submodels[1];
        console.log("Found Submodel ID:", submodel?.val);

        // Now, click "Search" button
        // Looking at the ANC HTML, the button is probably something like `ctl00$ContentPlaceHolder$ucIntro$btnSearch`
        // We will just post to the form to see where it redirects or what it loads.
        const searchPayload = {
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$btCal2',
            '__EVENTARGUMENT': '',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': '2024',
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand': honda.val,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarModel': civic.val,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel': submodel.val
        };

        console.log("\nSubmitting Search form...");
        res = await axios.post(ANC_URL, qs.stringify(searchPayload), { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            maxRedirects: 0,
            validateStatus: function (status) { return status >= 200 && status < 400; } // capture redirects
        });

        console.log("Response Status:", res.status);
        if (res.headers.location) {
            console.log("Redirected to:", res.headers.location);
        } else {
            console.log("Stayed on page. Length of HTML:", res.data.length);
            fs.writeFileSync('result.html', res.data);
            console.log("Wrote result to result.html");
        }
    } catch(err) {
        console.error("Error:", err.message);
    }
}

testFetchQuotes();
