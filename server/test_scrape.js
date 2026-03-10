const https = require('https');

// A simple script to see if Prakun.com blocks pure backend server requests.
// We are going to ping one of their car search pages.
const options = {
    hostname: 'www.prakun.com',
    path: '/car-insurance/',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    
    res.on('end', () => {
        console.log(`Received ${data.length} bytes of HTML/Data.`);
        if(res.statusCode === 200 && data.length > 50000) {
            console.log("\nSUCCESS: Prakun.com allows backend server scraping!");
        } else {
            console.log("\nWARNING: They might be using anti-bot protection (like Cloudflare).");
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
