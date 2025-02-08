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
</script>

<h1>MUNoC 2025</h1>
<p>
  Welcome to <a href="https://munoc.tela.org.uk/">MUNoC</a> 2025
</p>

<MapLibre
  class="h-[75vh] min-h-[300px]"
  style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
  zoom={2}
  center={{ lng: -100.486052, lat: 37.830348 }}
>
  <GlobeControl />
  <Projection type="globe" />
  <GeoJSONSource
    data="https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson"
  >
    <FillLayer
      paint={{
        'fill-color': '#00ff55',
        // Change the opacity for the hovered feature
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.4,
          0.1,
        ],
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
        'line-color': '#00ff55',
        // Change the opacity for the hovered feature
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.3,
        ],
        'line-width': 1,
      }}
    />
    {#if hoveredFeature}
      <!-- Set the hover state on the source for the hovered feature -->
      <FeatureState id={hoveredFeature.id} state={{ hover: true }} />
      <Popup {lnglat} closeButton={false}
        >{hoveredFeature.properties.STATE_NAME}</Popup
      >
    {/if}
  </GeoJSONSource>
</MapLibre>
