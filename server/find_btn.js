const axios = require('axios');
const cheerio = require('cheerio');

async function findButtons() {
    let res = await axios.get('https://www.ancbroker.com/');
    let $ = cheerio.load(res.data);
    $(':submit, button, input[type="image"]').each((i, el) => {
        console.log("Button Name:", $(el).attr('name'), "Id:", $(el).attr('id'), "Value:", $(el).attr('value'));
    });
}
findButtons();
