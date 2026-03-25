const axios = require('axios');
const fs = require('fs');
async function run() {
    let res = await axios.get('https://www.ancbroker.com/');
    fs.writeFileSync('anc_home.html', res.data);
    console.log("HTML Saved");
}
run();
