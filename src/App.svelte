<script>
  import { onMount } from 'svelte';
  import { csvParse } from 'd3-dsv';
  import { format } from 'd3-format';
  import {feature} from 'topojson-client';

  import html2canvas from 'html2canvas';

  import Map from './graphics/map.svelte';
  let isLoaded=false;
  let locations;


  onMount(() => {
      window.pymChild.sendHeight();
      setTimeout(() => isLoaded = true, 250);
  });

  // TODO: load in countries individually as requested?
  fetch('./data/damage-locations.json', {mode: 'cors', cache: 'no-store' })
  .then(response => { return response.json() })
  .then(data => {
    locations= feature(data, data.objects["damage-locations"]).features.filter(d => d.geometry)
                .map(d => ({
                  ...d,
                  lat: +d.properties.Lat, 
                  lon: +d.properties.Long,
                  timestamp: +d.properties.Timestamp
                }));
  });
  
</script>

<div class="embed-container">
  <h3>Damage to educational establisments in Ukraine</h3>
  <h4>With change over time</h4>
  <div class="vis-container">
    {#if locations}
      <Map {locations} />
    {/if}
  </div>
  <!-- <div class="source-text">Note:</div> -->
  <div class="source-text">Source: Centre for Information Resilience</div>
</div>

<style>
  /* MAP_INCL */
  .vis-container {
    position: relative; /* 100% turns into 100vh if you don't */
    max-height: 50em;
    height: 95vh;
  }
  /* MAP_INCL_END */

</style>

