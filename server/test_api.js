const axios = require('axios');

async function testBackendProxy() {
    try {
        console.log("1. Testing 'models' step for 2024 HONDA...");
        let res = await axios.post('http://localhost:3000/api/cars/dropdown', {
            step: 'models',
            year: '2024',
            brand: 'HONDA'
        });
        console.log("Models returned:", res.data.data.slice(0, 5)); // Just print first 5

        console.log("\n2. Testing 'submodels' step for 2024 HONDA CIVIC...");
        res = await axios.post('http://localhost:3000/api/cars/dropdown', {
            step: 'submodels',
            year: '2024',
            brand: 'HONDA',
            model: 'CIVIC' // We grouped by CIVIC
        });
        console.log("Submodels returned:", res.data.data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testBackendProxy();
