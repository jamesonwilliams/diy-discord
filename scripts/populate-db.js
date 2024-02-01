#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('../data/bands.json', 'utf8'));

// Function to make a POST request to the API
async function addBand(band) {
    const url = 'http://localhost:3000/api/add-band';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(band)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to add band: ${response.statusText}`);
        }
        console.log(`Band "${band.name}" added successfully.`);
    } catch (error) {
        console.error(error);
    }
}

// Process each band object and make a POST request
async function processBands() {
    for (const band of jsonData) {
        const { name, homeBase, socials } = band;
        const { city, state, country, latLong } = homeBase;
        const { lat, long } = latLong;
        const postData = {
            name,
            city,
            state,
            country,
            lat,
            long,
            spotify: socials.spotify,
            twitter: socials.twitter,
            bandcamp: socials.bandcamp,
            instagram: socials.instagram
        };
        await addBand(postData);
    }
}

// Start processing bands
processBands();

