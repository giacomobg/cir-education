<script>
  import { onMount } from 'svelte';
  import { csvParse } from 'd3-dsv';
  import { format } from 'd3-format';
  import {feature} from 'topojson-client';

  import html2canvas from 'html2canvas';

  import Map from './graphics/map.svelte';
  import Cartesian from './graphics/cartesian.svelte';
  import Column from './components/cartesian/Column.svelte';
  import TimeControls from './components/TimeControls.svelte';

  let isLoaded=false;

  let timeIndex = 0;
  let timePeriods = [ // Feb '22 to Feb '23
      new Date("2022", "01"),
      new Date("2022", "02"),
      new Date("2022", "03"),
      new Date("2022", "04"),
      new Date("2022", "05"),
      new Date("2022", "06"),
      new Date("2022", "07"),
      new Date("2022", "08"),
      new Date("2022", "09"),
      new Date("2022", "10"),
      new Date("2022", "11"),
      new Date("2023", "00"),
      new Date("2023", "01"),
  ];
  let time = getTime();

  function getTime() {
    return timePeriods[timeIndex]
  };

  $: timeIndex, time = getTime();

  onMount(() => {
      window.pymChild.sendHeight();
      setTimeout(() => isLoaded = true, 250);
  });

</script>

<div class="embed-container">
  <h1>Damage to schools and other places of education in Ukraine</h1>
  <h2>Monthly from February 2022 to February 2023</h2>
  <TimeControls bind:timeIndex={timeIndex} {timePeriods} animated={true}></TimeControls>
  <div class="vis-container">
      <Map {time} />
      <!-- <Cartesian>
        <Column/> 
      </Cartesian> -->
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

