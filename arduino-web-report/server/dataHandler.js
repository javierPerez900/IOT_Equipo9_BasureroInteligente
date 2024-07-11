// server/dataHandler.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const DATA_FILE = 'data.json';
const ARDUINO_URL = 'http://192.168.18.35';

async function fetchDataFromArduino(retries = 5) {
    while (retries > 0) {
        try {
            const response = await axios.get(ARDUINO_URL);
            return response.data;
        } catch (error) {
            retries -= 1;
            console.error(`Error al obtener datos del Arduino: ${error.message}. Reintentos restantes: ${retries}`);
            if (retries === 0) throw error;
        }
    }
}

function saveData(newData) {
    let existingData = [];
    if (fs.existsSync(DATA_FILE)) {
        existingData = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    existingData.push(newData);
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
}

function getData() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    }
    return [];
}

function normalizeData(data, intervals) {
    if (data.length === 0) return [];

    const startTime = new Date(data[0].timestamp);
    const endTime = new Date(data[data.length - 1].timestamp);
    const totalDuration = (endTime - startTime) / (1000 * 60); // Duration in minutes

    let rangeDuration = Math.max(totalDuration / intervals, 5); // Minimum range of 5 minutes
    rangeDuration = Math.ceil(rangeDuration); // Round up to the nearest whole minute

    const normalizedData = [];
    let currentRangeStart = new Date(startTime);
    let currentRangeEnd = new Date(startTime);
    currentRangeEnd.setMinutes(currentRangeEnd.getMinutes() + rangeDuration);

    let currentCount = 0;
    let wasPreviouslyOpen = false;

    data.forEach(entry => {
        const entryTime = new Date(entry.timestamp);
        const distance = parseInt(entry.distanceToPerson);

        while (entryTime > currentRangeEnd) {
            normalizedData.push({
                timestamp: currentRangeEnd.toISOString(),
                openTrashCount: currentCount
            });
            currentRangeStart = new Date(currentRangeEnd);
            currentRangeEnd.setMinutes(currentRangeEnd.getMinutes() + rangeDuration);
            currentCount = 0;
        }

        if (distance <= 40 && !wasPreviouslyOpen) {
            currentCount++;
            wasPreviouslyOpen = true;
        } else if (distance > 40) {
            wasPreviouslyOpen = false;
        }
    });

    // Add the last range
    normalizedData.push({
        timestamp: currentRangeEnd.toISOString(),
        openTrashCount: currentCount
    });

    return normalizedData;
}

function calculateTrashPercentage(distanceToTrash) {
    const maxDistance = 34;
    const minDistance = 1;
    const percentage = ((maxDistance - distanceToTrash) / (maxDistance - minDistance)) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp the value between 0 and 100
}

module.exports = { fetchDataFromArduino, saveData, getData, normalizeData, calculateTrashPercentage };
