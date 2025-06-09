This script takes an input GeoJSON file (like Natural Earth admin countries) and filters it based on country names or ISO codes you specify.

Here's how to use it:

```bash
Usage:
  node geojson-country-filter.js input.geojson output.geojson input.csv
```

example:

```bash
node geojson-country-filter.js world_countries_10m.geojson ../static/munoc-2025.geojson munoc-2025.csv
```

# Features:

- Filter by country names using the --countries flag
- Filter by ISO codes using the --iso flag
- Handles common property names found in Natural Earth data
- Case-insensitive matching for country names
- Outputs a valid GeoJSON file with only the selected countries
- Provides a summary of how many countries were selected

The script works with standard Natural Earth properties like NAME, NAME_LONG, ISO_A2, ISO_A3, etc. Is there anything specific you'd like me to explain or modify about this script?
