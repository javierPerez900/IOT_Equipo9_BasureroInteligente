// server/routes.js
const express = require('express');
const router = express.Router();
const { fetchDataFromArduino, saveData, getData, normalizeData, calculateTrashPercentage } = require('./dataHandler');
const cheerio = require('cheerio');

router.get('/data', async (req, res) => {
    try {
        const data = await fetchDataFromArduino();
        const $ = cheerio.load(data);
        const distanceToPerson = $('p:contains("Distance to person")').text().match(/(\d+)/)[1];
        const distanceToTrash = $('p:contains("Distance to trash")').text().match(/(\d+)/)[1];

        // Guardar datos en archivo
        const timestamp = new Date().toISOString();
        const newData = { timestamp, distanceToPerson, distanceToTrash };
        saveData(newData);

        res.json({ distanceToPerson, distanceToTrash });
    } catch (error) {
        console.error('Error al obtener datos del Arduino:', error.message);
        res.status(500).send('Error al obtener datos del Arduino');
    }
});

router.get('/all-data', (req, res) => {
    const data = getData();
    const filteredData = data.filter((_, index) => index % 10 === 0);

    let openTrashCount = 0;
    let wasPreviouslyOpen = false;
    let graphData = [];
    let openTrashGraphData = [];
    let trashPercentages = [];

    let previousDistanceToTrash = null;

    data.forEach(entry => {
        const distance = parseInt(entry.distanceToPerson);
        const distanceToTrash = parseInt(entry.distanceToTrash);

        if (previousDistanceToTrash === null || Math.abs(distanceToTrash - previousDistanceToTrash) >= 2) {
            const percentage = calculateTrashPercentage(distanceToTrash);
            trashPercentages.push({ timestamp: entry.timestamp, percentage });
            previousDistanceToTrash = distanceToTrash;
        }

        if (distance <= 40 && !wasPreviouslyOpen) {
            openTrashCount++;
            wasPreviouslyOpen = true;
            graphData.push(entry); // Agregar al gráfico cuando se abre el tacho
        } else if (distance > 40) {
            wasPreviouslyOpen = false;
        }

        // Siempre agregar los datos de distanceToTrash
        graphData.push({ timestamp: entry.timestamp, distanceToPerson: null, distanceToTrash });
    });

    openTrashGraphData = normalizeData(data, 12);

    res.json({ data: filteredData, openTrashCount, graphData, openTrashGraphData, trashPercentages });
});

module.exports = router;
