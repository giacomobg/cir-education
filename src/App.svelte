<svelte:head>
  <script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>

</svelte:head>


<script>
  import { onMount } from 'svelte';
  import { csvParse } from 'd3-dsv';
  import { format } from 'd3-format';
  import {feature} from 'topojson-client';

  import html2canvas from 'html2canvas';

  import Map from './graphics/map.svelte';
  import Cartesiand3 from './graphics/cartesiand3.svelte';
  import TimeControls from './components/TimeControls.svelte';

  import data from './data/data.csv'
  import { each } from 'svelte/internal';

  console.log('Data visualisation by Giacomo Boscaini-Gilroy');

  let pymChild = null;
  let unique = {};

  let hoveredOblastId;
  let config = {
    margin: {
      top: 13,
      right: 3,
      bottom: 10,
      left: 50
    },
    xKey: "oblast",
    yKey: [0,1],
    xKeyCode: "oblast_code",
  };

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
      console.log('pym child');
      pymChild = new pym.Child({renderCallback: onResize});
      // isLoaded = true;
      setTimeout(() => isLoaded = true, 250);
  });

  function onResize() {
    console.log('resize');
    unique = {};
  }


</script>

<div class="embed-container">

  <h1>Damage to educational facilities in Ukraine</h1>
  <h2>Monthly incidents are <span class="yellow-circle">&#11044;</span> highlighted on the map and in the <div class="key-yellow-box">yellow box</div> on the bar chart.</h2>

  <TimeControls bind:timeIndex={timeIndex} {timePeriods} animated={true}></TimeControls>

  <div class="grid">
    <!-- <h2>{time.toLocaleString("en-GB", { year: "numeric", month: "long"})}</h2> -->
    <div class="vis-container">
      <Map {time} bind:hoveredOblastId={hoveredOblastId}/>
    </div>
    <div class="vis-container">
      {#key unique}
        {#if isLoaded}
          <Cartesiand3 {data} {config} {timeIndex} bind:hoveredOblastId={hoveredOblastId}>
          </Cartesiand3>
        {/if}
      {/key}
    </div>
    <!-- <div class="source-text">Note:</div> -->
  </div>

  <div class="source-text">Source: Centre for Information Resilience</div>

</div>

<style>

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    column-gap: 1em;
  }
  .key-yellow-box {
    display: inline-block;
    border: #BF8C19 2px solid;
  }
  .yellow-circle {
    color: #BF8C19;
  }

  /* MAP_INCL */
  h1, h2, .source-text {
    /* margin-left: 1px; */
    line-height: 1.4em;
  }
  .vis-container {
    position: relative; /* 100% turns into 100vh if you don't */
    height: 300px;
    /* max-height: 50em; */
    max-height: 80vh;
    grid-column: span 1;
    grid-row: span 1;
  }
  @media (max-width:599px) {
    .vis-container {
      grid-column: span 2;
    }
  }

  /* MAP_INCL_END */

</style>

