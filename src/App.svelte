<script>
  import { onMount } from 'svelte';
  import { csvParse } from 'd3-dsv';
  import { format } from 'd3-format';
  import {feature} from 'topojson-client';

  import html2canvas from 'html2canvas';

  import Map from './graphics/map.svelte';
  let isLoaded=false;


  onMount(() => {
      window.pymChild.sendHeight();
      setTimeout(() => isLoaded = true, 250);
  });

</script>

<div class="embed-container">
  <h1>Damage to schools and other places of education in Ukraine</h1>
  <h2>With change over time</h2>
  <div class="vis-container">
      <Map />
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

