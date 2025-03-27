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

  // let popupOpen = $state(false);
  // let offset = $state(24);
  // let offsets: maplibregl.Offset = $derived({
  //   top: [0, offset],
  //   bottom: [0, -offset],
  //   left: [offset + 12, 0],
  //   right: [-offset - 12, 0],
  //   center: [0, 0],
  //   'top-left': [offset, offset],
  //   'top-right': [-offset, offset],
  //   'bottom-left': [offset, -offset],
  //   'bottom-right': [-offset, -offset],
  // });
</script>

<MapLibre
  class="map h-[75vh] min-h-[300px]"
  style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
  zoom={3}
  center={{ lng: -0.486052, lat: 37.830348 }}
>
  <GlobeControl />
  <Projection type="globe" />
  <!-- <GeoJSONSource
    data="https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson"
  > -->
  <GeoJSONSource data="/world_countries.geojson">
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
      <FeatureState
        id={hoveredFeature.properties.adm0_a3}
        state={{ hover: true }}
      />
      <Popup {lnglat} closeButton={false}
        >{hoveredFeature.properties.name}</Popup
      >
    {/if}
  </GeoJSONSource>
</MapLibre>
