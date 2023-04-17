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
  <h1>Damage to educational faci in Ukraine</h1>
  <h2>From February 2022 to February 2023</h2>
  <!-- <h2>{time.toLocaleString("en-GB", { year: "numeric", month: "long"})}</h2> -->
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
  h1, h2, .source-text {
    margin-left: 10px;
  }
  .vis-container {
    position: relative; /* 100% turns into 100vh if you don't */
    /* height: 250px; */
    max-height: 50em;
    height: 55vh;
  }
  /* MAP_INCL_END */

</style>

