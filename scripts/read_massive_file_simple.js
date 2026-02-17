import https from 'https';

const url = "https://files.massive.com/flatfiles/market_day_data.json";

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        console.log("File Content:", data);
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
