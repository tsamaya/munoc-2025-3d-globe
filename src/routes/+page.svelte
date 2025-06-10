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
  let clickedFeature: maplibregl.MapGeoJSONFeature | undefined = $state.raw();

  let lnglat = $state.raw(new maplibregl.LngLat(0, 0));

  let isMobile = $state(false);
  // Detect if device is mobile/touch-enabled
  $effect(() => {
    isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  // Determine which feature to show based on device type
  // Determine which feature to show based on device type
  let displayedFeature = $derived(isMobile ? clickedFeature : hoveredFeature);
</script>

<MapLibre
  class="map h-[100vh] min-h-[300px]"
  style="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
  zoom={3}
  center={{ lng: -0.486052, lat: 37.830348 }}
>
  <GlobeControl />
  <Projection type="globe" />
  <GeoJSONSource data="/munoc-2025.geojson">
    <FillLayer
      paint={{
        'fill-color': '#172F54',
        'fill-opacity': 0.6,
      }}
      onmousemove={(ev) => {
        // Listen to mousemove events to track the hovered feature
        // Only handle hover on non-mobile devices
        if (!isMobile) {
          hoveredFeature = ev.features?.[0];
          lnglat = ev.lngLat; // cursor location
        }
      }}
      onmouseleave={() => {
        if (!isMobile) {
          hoveredFeature = undefined;
        }
      }}
      onclick={(ev) => {
        // Handle click/tap for mobile devices
        if (isMobile) {
          const feature = ev.features?.[0];
          if (feature) {
            // If clicking the same feature, hide popup
            if (
              clickedFeature?.properties?.adm0_a3 ===
              feature.properties?.adm0_a3
            ) {
              clickedFeature = undefined;
            } else {
              clickedFeature = feature;
              lnglat = ev.lngLat;
            }
          } else {
            clickedFeature = undefined;
          }
        }
      }}
    />
    <LineLayer
      paint={{
        'line-color': '#172F54',
        'line-width': 2,
      }}
    />
    {#if displayedFeature}
      <!-- Set the hover state on the source for the hovered feature -->
      <FeatureState
        id={displayedFeature.properties.id}
        state={{ hover: true }}
      />
      <Popup {lnglat} closeButton={false}>
        <div class="popup-container">
          <h2 class="country-name">{displayedFeature.properties.NAME}</h2>
          <p class="official-name">{displayedFeature.properties.FORMAL_EN}</p>
          {#if isMobile}
            <button
              class="close-button"
              onclick={() => (clickedFeature = undefined)}
            >
              ×
            </button>
          {/if}
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

  .close-button {
    position: absolute;
    top: 8px;
    right: 12px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #718096;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .close-button:hover {
    background-color: #f7fafc;
    color: #2d3748;
  }
</style>
