const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import the cors package

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Endpoint to get MX records using Google DNS
app.get('/getMxRecords', async (req, res) => {
    const domain = req.query.domain;

    if (!domain) {
        return res.status(400).json({ error: "No domain provided" });
    }

    try {
        // Send request to Google's DNS over HTTPS service
        const response = await axios.get(`https://dns.google/resolve?name=${domain}&type=MX`);
        const mxRecords = response.data.Answer;

        if (!mxRecords || mxRecords.length === 0) {
            return res.status(404).json({ error: "No MX records found" });
        }

        // Extract the MX exchange servers
        const mxRecord = mxRecords.map(record => record.data.split(' ')[1]).join(', ');

        // Return the MX record to the frontend
        res.json({ mxRecord });
    } catch (error) {
        console.error("Error querying DNS: ", error);
        res.status(500).json({ error: "Failed to query DNS" });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
