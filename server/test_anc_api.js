const https = require('https');

https.get('https://prakun.com/car-insurance/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Look for api endpoints
    const endpoints = data.match(/(?:url|action|href|fetch|\$\.post|\$\.get|\$\.ajax)\s*[:=]\s*['"]([^'"]*)['"]/gi);
    console.log("\n--- PRAKUN API ENDPOINTS ---");
    if (endpoints) {
      const filtered = [...new Set(endpoints)].filter(e => e.includes('api') || e.includes('car') || e.includes('brand') || e.includes('model') || e.includes('get'));
      console.log(filtered);
    } else {
      console.log("None");
    }

    // Attempt to find embedded JSON data arrays (often start with [{id:1, name:"Toyota"}...)
    const maybeData = data.match(/(\[\{.*?\}\])/g);
    if (maybeData) {
        console.log("\n--- EMBEDDED JSON ARRAYS ---");
        console.log(`Found ${maybeData.length} arrays.`);
        console.log("Sample 1:", maybeData[0].substring(0, 150));
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
