const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.json());

app.post('/store-file', (req, res) => {
    const { file, data } = req.body;

    if (!file || !data) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join('/syedamisbah_PV_dir', file);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).json({ file, error: "Error while storing the file to the storage." });
        }
        res.json({ file, message: "Success." });
    });
});

app.post('/calculate', (req, res) => {
    const { file, product } = req.body;

    if (!file) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join('/syedamisbah_PV_dir', file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found.", file });
    }

    axios.post('http://app2:6001/calculate', { file, product })
        .then(response => {
        res.json(response.data);
    })
        .catch(error => {
        res.status(500).json({ error: "Input file not in CSV format.", file });
    });
});

app.listen(port, () => {
    console.log(`App1 listening on port ${port}`);
});
