/**
 * GeoJSON Country Filter
 *
 * This script filters a Natural Earth admin countries GeoJSON file
 * by country names or ISO codes.
 *
 * Usage: node geojson-country-filter.js input.geojson output.geojson --countries "USA,Canada" --iso "FRA,DEU"
 */

import fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    'Usage: node geojson-country-filter.js input.geojson output.geojson [--countries "country1,country2..."] [--iso "ISO1,ISO2..."]',
  );
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

let countries = [];
let isoCodes = [];

// Parse optional arguments
for (let i = 2; i < args.length; i += 2) {
  if (args[i] === '--countries' && args[i + 1]) {
    countries = args[i + 1].split(',').map((c) => c.trim().toLowerCase());
  } else if (args[i] === '--iso' && args[i + 1]) {
    isoCodes = args[i + 1].split(',').map((c) => c.trim().toUpperCase());
  }
}

// Check if any filter is provided
if (countries.length === 0 && isoCodes.length === 0) {
  console.error(
    'Error: No filter criteria provided. Use --countries or --iso options.',
  );
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

// Filter the features based on country names or ISO codes
const filteredFeatures = geojsonData.features.filter((feature) => {
  const properties = feature.properties;

  // Check for common property names in Natural Earth data
  const nameFields = ['NAME', 'NAME_LONG', 'ADMIN', 'SOVEREIGNT', 'name'];
  const isoFields = ['ISO_A2', 'ISO_A3', 'ADM0_A3', 'iso_a2', 'iso_a3'];

  // Check if any country name matches
  const countryMatch =
    countries.length > 0 &&
    nameFields.some((field) => {
      return (
        properties[field] && countries.includes(properties[field].toLowerCase())
      );
    });

  // Check if any ISO code matches
  const isoMatch =
    isoCodes.length > 0 &&
    isoFields.some((field) => {
      return (
        properties[field] && isoCodes.includes(properties[field].toUpperCase())
      );
    });

  return countryMatch || isoMatch;
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
} catch (error) {
  console.error(`Error writing output file: ${error.message}`);
  process.exit(1);
}
