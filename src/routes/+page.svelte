<script lang="ts">
  import maplibregl from 'maplibre-gl';
  import {
    FeatureState,
    FillLayer,
    GeoJSONSource,
    GlobeControl,
    LineLayer,
    MapLibre,
    Popup,
    Projection,
  } from 'svelte-maplibre-gl';

  let hoveredFeature: maplibregl.MapGeoJSONFeature | undefined = $state.raw();
  let lnglat = $state.raw(new maplibregl.LngLat(0, 0));

  // Format GDP with proper suffix
  // function formatGDP(gdp: number): string {
  //   if (gdp >= 1) {
  //     return `${gdp.toFixed(2)} trillion USD`;
  //   } else {
  //     return `${(gdp * 1000).toFixed(2)} billion USD`;
  //   }
  // }
  // Format population with commas
  function formatPopulation(pop: number): string {
    return pop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
</script>

<!-- style="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json" -->

<MapLibre
  class="map h-[100vh] min-h-[300px]"
  style="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
  zoom={3}
  center={{ lng: -0.486052, lat: 37.830348 }}
>
  <GlobeControl />
  <Projection type="globe" />
  <!-- <GeoJSONSource
    data="https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson"
  > -->
  <GeoJSONSource data="/munoc-2025.geojson">
    <FillLayer
      paint={{
        'fill-color': '#172F54',
        'fill-opacity': 0.6,
      }}
      onmousemove={(ev) => {
        // Listen to mousemove events to track the hovered feature
        hoveredFeature = ev.features?.[0];
        lnglat = ev.lngLat; // cursor location
      }}
      onmouseleave={() => (hoveredFeature = undefined)}
    />
    <LineLayer
      paint={{
        'line-color': '#172F54',
        'line-width': 2,
      }}
    />
    {#if hoveredFeature}
      <!-- Set the hover state on the source for the hovered feature -->
      <FeatureState
        id={hoveredFeature.properties.adm0_a3}
        state={{ hover: true }}
      />
      <Popup {lnglat} closeButton={false}>
        <div class="popup-container">
          <h2 class="country-name">{hoveredFeature.properties.NAME}</h2>
          <p class="official-name">{hoveredFeature.properties.FORMAL_EN}</p>
          <!-- <div class="data-row">
            <span class="label">Population:</span>
            <span class="value"
              >{formatPopulation(hoveredFeature.properties.POP_EST)} ({hoveredFeature
                .properties.POP_YEAR})</span
            >
          </div> -->
          <!-- <div class="data-row">
            <span class="label">GDP:</span>
            <span class="value"
              >{formatGDP(hoveredFeature.properties.GDP_MD)} ({hoveredFeature
                .properties.GDP_YEAR})</span
            >
          </div> -->
        </div>
      </Popup>
    {/if}
  </GeoJSONSource>
</MapLibre>

<style>
  .popup-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 16px;
    max-width: 300px;
    border: 1px solid #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
  }

  .country-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 4px 0;
  }

  .official-name {
    font-size: 0.875rem;
    font-style: italic;
    color: #4a5568;
    margin: 0 0 12px 0;
  }

  /* .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .data-row:last-child {
    margin-bottom: 0;
  } 

  .label {
    color: #4a5568;
  }

  .value {
    font-weight: 500;
  }*/
</style>
