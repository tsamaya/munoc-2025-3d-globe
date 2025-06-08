This script takes an input GeoJSON file (like Natural Earth admin countries) and filters it based on country names or ISO codes you specify.

Here's how to use it:

```bash
Usage:
  node geojson-country-filter.js input.geojson output.geojson --countries "USA,Canada" --iso "FRA,DEU"
```

example:

```bash
  node geojson-country-filter.js world_countries_10m.geojson ../static/munoc-2025.geojson --countries "United States of America,Russian Federation,People's republic of China,France,Islamic Republic of Pakistan,Republic of Hungary,Kingdom of Denmark,Hellenic Republic,Republic of Turkey,Democratic Republic of the Congo,Republic of Ecuador,Republic of Panama,Republic of India,State of Israel,Islamic Republic of Iran,Ukraine,Argentine Republic,Palestine,Algeria,Belarus,Saudi Arabia,South Africa"
```

# Features:

- Filter by country names using the --countries flag
- Filter by ISO codes using the --iso flag
- Handles common property names found in Natural Earth data
- Case-insensitive matching for country names
- Outputs a valid GeoJSON file with only the selected countries
- Provides a summary of how many countries were selected

The script works with standard Natural Earth properties like NAME, NAME_LONG, ISO_A2, ISO_A3, etc. Is there anything specific you'd like me to explain or modify about this script?
