const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');

const ANC_URL = 'https://www.ancbroker.com/';

async function testFetchQuotes() {
    try {
        let res = await axios.get(ANC_URL);
        let $ = cheerio.load(res.data);
        
        let __VIEWSTATE = $('#__VIEWSTATE').val();
        let __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        let __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

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

        payload = {
            ...payload,
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand': 'HONDA'
        };

        res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        $ = cheerio.load(res.data);
        __VIEWSTATE = $('#__VIEWSTATE').val();
        __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        payload = {
            ...payload,
            '__EVENTTARGET': 'ctl00$ContentPlaceHolder$ucIntro$ddlCarModel',
            '__VIEWSTATE': __VIEWSTATE,
            '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
            '__EVENTVALIDATION': __EVENTVALIDATION,
            'ctl00$ContentPlaceHolder$ucIntro$ddlCarModel': '632'
        };

        res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        fs.writeFileSync('debug_submodel.html', res.data);
        
        $ = cheerio.load(res.data);
        const submodels = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option').map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get();
        console.log("Submodels length:", submodels.length);
        console.log("Submodels:", submodels);
    } catch(err) {
        console.error("Error:", err.message);
    }
}

testFetchQuotes();
