const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = 'C:\\CBIINSURE web beta\\client\\public\\logos';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const companies = [
    { abbr: 'VIB', url: 'viriyah.co.th' },
    { abbr: 'BKI', url: 'bangkokinsurance.com' },
    { abbr: 'TIP', url: 'dhipaya.co.th' },
    { abbr: 'MTI', url: 'muangthaiinsurance.com' },
    { abbr: 'TNI', url: 'thanachartinsurance.co.th' },
    { abbr: 'SMK', url: 'smk.co.th' },
    { abbr: 'TMSI', url: 'tokiomarine.com' },
    { abbr: 'TVI', url: 'thaivivat.co.th' },
    { abbr: 'AXA', url: 'axa.co.th' },
    { abbr: 'MSIG', url: 'msig-thai.com' },
    { abbr: 'NKI', url: 'navakij.co.th' },
    { abbr: 'LMG', url: 'lmginsurance.co.th' },
    { abbr: 'AZAY', url: 'allianz.co.th' },
    { abbr: 'CHUBB', url: 'chubb.com' },
    { abbr: 'DEV', url: 'deves.co.th' },
    { abbr: 'AIG', url: 'aig.co.th' },
    { abbr: 'BUI', url: 'bui.co.th' }
];

companies.forEach(c => {
    const file = fs.createWriteStream(path.join(dir, `${c.abbr}.png`));
    https.get(`https://www.google.com/s2/favicons?domain=${c.url}&sz=128`, function(response) {
        if (response.statusCode === 200) {
            response.pipe(file);
            console.log(`Downloaded ${c.abbr}.png`);
        } else {
            console.log(`Failed to get logo for ${c.abbr}`);
        }
    }).on('error', (err) => console.log(err.message));
});
