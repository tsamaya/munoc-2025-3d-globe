/**
 * GeoJSON Country Filter with CSV Input
 *
 * This script filters a Natural Earth admin countries GeoJSON file
 * using a CSV file with country mappings and optional property replacements.
 *
 * CSV Format: SOVEREIGNT,NAME,FORMAL_EN (columns 2 and 3 can be empty)
 *
 * Usage: node geojson-country-filter.js input.geojson output.geojson countries.csv
 */

import fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error(
    'Usage: node geojson-country-filter.js input.geojson output.geojson countries.csv',
  );
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];
const csvFile = args[2];

// Simple CSV parser function
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const countries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing - handles basic cases
    const columns = line
      .split(',')
      .map((col) => col.trim().replace(/^["']|["']$/g, ''));

    if (columns.length >= 1 && columns[0]) {
      countries.push({
        sovereignt: columns[0],
        name: columns[1] || null,
        formalEn: columns[2] || null,
      });
    }
  }

  return countries;
}

// Read and parse the CSV file
let countryMappings;
try {
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  countryMappings = parseCSV(csvContent);

  if (countryMappings.length === 0) {
    console.error('Error: No valid country mappings found in CSV file');
    process.exit(1);
  }

  console.log(`Loaded ${countryMappings.length} country mappings from CSV`);
} catch (error) {
  console.error(`Error reading or parsing CSV file: ${error.message}`);
  process.exit(1);
}

// Read and parse the input GeoJSON file
let geojsonData;
try {
  const fileContent = fs.readFileSync(inputFile, 'utf8');
  geojsonData = JSON.parse(fileContent);
} catch (error) {
  console.error(`Error reading or parsing input file: ${error.message}`);
  process.exit(1);
}

// Ensure it's a valid GeoJSON with features
if (!geojsonData.type || !geojsonData.features) {
  console.error('Error: Input is not a valid GeoJSON FeatureCollection');
  process.exit(1);
}

// Create a map for quick lookup
const countryMap = new Map();
countryMappings.forEach((mapping) => {
  countryMap.set(mapping.sovereignt.toLowerCase(), mapping);
});

// Filter and modify the features
const filteredFeatures = geojsonData.features.filter((feature) => {
  const properties = feature.properties;

  // Check if SOVEREIGNT or ADMIN matches any from our CSV
  const sovereignt = properties.SOVEREIGNT;
  const admin = properties.ADMIN;

  let mapping = null;

  // // Try to match on SOVEREIGNT first
  // if (sovereignt) {
  //   mapping = countryMap.get(sovereignt.toLowerCase());
  // }

  // // If no match on SOVEREIGNT, try ADMIN
  // if (!mapping && admin) {
  //   mapping = countryMap.get(admin.toLowerCase());
  // }

  // Try to match on ADMIN first
  if (admin) {
    mapping = countryMap.get(admin.toLowerCase());
  }

  // If no match on ADMIN, try SOVEREIGNT
  if (!mapping && sovereignt) {
    mapping = countryMap.get(sovereignt.toLowerCase());
  }

  // If no mapping found, exclude this feature
  if (!mapping) return false;

  // Create new properties object with only the four fields we want
  const newProperties = {
    SOVEREIGNT: sovereignt || '',
    ADMIN: admin || '',
    NAME: mapping.name || properties.NAME || '',
    FORMAL_EN: mapping.formalEn || properties.FORMAL_EN || '',
  };

  // Replace the properties object
  feature.properties = newProperties;

  return true;
});

// Create the filtered GeoJSON object
const filteredGeoJSON = {
  type: 'FeatureCollection',
  features: filteredFeatures,
};

// Write the filtered GeoJSON to the output file
try {
  fs.writeFileSync(outputFile, JSON.stringify(filteredGeoJSON, null, 2));
  console.log(`Filtered GeoJSON saved to ${outputFile}`);
  console.log(
    `Selected ${filteredFeatures.length} countries out of ${geojsonData.features.length}`,
  );

  // Show which countries were found
  const foundCountries = filteredFeatures.map((f) => f.properties.SOVEREIGNT);
  console.log('Found countries:', foundCountries.join(', '));
} catch (error) {
  console.error(`Error writing output file: ${error.message}`);
  process.exit(1);
}
