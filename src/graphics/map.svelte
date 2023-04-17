<script>
  import { feature } from 'topojson-client';

  import MapSvg from '../components/map/mapSvg.svelte';
  import Select from 'svelte-select';

  export let time;
  let locations;
  let oblasts;
  let ukraine;

  fetch('./data/damage-locations.json', {mode: 'cors', cache: 'no-store' })
    .then(response => { return response.json() })
    .then(data => {
      locations= feature(data, data.objects["damage-locations"]).features.filter(d => d.geometry)
                .map(d => ({
                  ...d,
                  lat: +d.properties.Lat, 
                  lon: +d.properties.Long,
                  properties: {
                    timestamp: +d.properties.Timestamp
                  }
                }));
  });

  fetch('./data/oblasts.json', {mode: 'cors', cache: 'no-store' })
    .then(response => { return response.json() })
    .then(data => {
      oblasts= feature(data, data.objects.features).features.filter(d => d.geometry)
                // .map(d => ({
                //   ...d
                // }));
  });

  fetch('./data/ukraine.json', {mode: 'cors', cache: 'no-store' })
    .then(response => { return response.json() })
    .then(data => {
      ukraine= feature(data, data.objects.features).features.filter(d => d.geometry)
                // .map(d => ({
                //   ...d
                // }));
  });

</script>

<svelte:window />

<div class="chart-container">
  {#if locations && oblasts && ukraine && time}
    <MapSvg
      {locations} {oblasts} {ukraine} {time}
    />
  {/if}
</div>

<style>

  :global(.chart-container .layercake-container) {
    position: absolute !important;
    top: 0;
  }

</style>
