<script>
    // import { createEventDispatcher } from 'svelte';
    // const dispatch = createEventDispatcher();
    import Slider from '@bulatdashiev/svelte-slider';    
    import { onMount } from 'svelte';

    export let timePeriods;
    export let timeIndex;
    export let animated = true;
    let playing = animated;
    let animationDelay = 3000;
    let intervalID = null;
    let svgWidth = null;


    // dispatch('message', timePeriods[timeIndex]);

    function goBack() {
        timeIndex = Math.max(0, timeIndex - 1);
    }
    function goForwards() {
        timeIndex = Math.min(timePeriods.length-1, timeIndex+1);
    }

    function animate() {
        if (playing) {
            if (timeIndex == timePeriods.length-2) {
                playing = false;
            };
            if (timeIndex == timePeriods.length-1) {
                timeIndex = 0;
            } else {
                goForwards();
            }
        }
    }
    function play() {
        intervalID = setInterval(animate, animationDelay);
    }

    if (playing) play(); // set to play automatically from start
    $: if (!playing) clearInterval(intervalID);

    $: console.log("timeIndex: ", timeIndex);
    let value = [0,100];
    $: setTimeIndex(value[0]);
    $: setValue(timeIndex);

    function setValue(t) {
        value[0] = t;
    }
    function setTimeIndex(v) {
        timeIndex = v;
    }

    onMount(() => {
        if (document.getElementById('axis')) svgWidth = document.getElementById('axis').getBoundingClientRect().width;
    });


</script>

<div class="time-controls-container">
    <!-- <h2 class="month">{timePeriods[timeIndex].toLocaleString("en-GB", { year: "numeric", month: "long"})}</h2> -->
    <button on:click={() => {playing = !playing; if (playing) {animate();play();}} } class="play-pause">{playing ? 'Pause' : (timeIndex == timePeriods.length-1 ? 'Replay' : 'Play')}</button>
    <div class="slider-container">
        <Slider bind:value min=0 max={timePeriods.length-1}
            on:input={() => playing=false}
            >
            <h2 class="month">{timePeriods[timeIndex].toLocaleString("en-GB", { year: "numeric", month: "long"})}</h2>
            <h2 class="line">|</h2>
            <h3 class="circle">&#11044;</h3>
            
        </Slider>
        <svg id="axis">
            <line x1="20" y1="0" x2="20" y2="8" stroke="black"></line>
            <text y="20">Feb '22</text>
            {#if svgWidth}
                <line x1={svgWidth-46} y1="0" x2={svgWidth-46} y2="8" stroke="black"></line>
                <text x={svgWidth-70} y="20">Feb '23</text>
            {/if}
        </svg>
    </div>
    <!-- <button on:click={goBack} class="back">&lt;</button> -->
    <!-- <button on:click={goForwards} class="forward">&gt;</button> -->
    <br class="clear"/>    
</div>

<style>

    .time-controls-container {
        padding-top: 20px;
        overflow-x: hidden;
    }
    .slider-container {
        position: relative;
        margin-bottom: 20px;
    }
    @media (max-width:450px) {
        .time-controls-container {
           padding-top: 0px;
        }
        .slider-container {
            margin-top: 30px;
        }
        .play-pause {
            display: block;
            margin: 0 auto;
            float: none;
        }
    }
    svg#axis {
        width: calc(100% + 50px);
        height: 30px;
        position:absolute;
        left: -10px;
        top: 25px;
    }

    button, .slider-container {
        float: left;
    }
    button {
        margin-left: 20px;
        width: 100px;
    }
    button:hover {
        opacity: 0.7;
    }
    button:focus {
        margin-top: -2px;
        border: #222 solid 3px;
    }
    .month {
        position: absolute;
        top: -50px;
        width: 200px;
    }
    .line {
        position: absolute;
        top: -34px;
        /* width: 200px; */
    }
    .circle {
        position: absolute;
        top: -23px;
        left: -6px;
        color: #566979;
        /* width: 200px; */
        cursor: grab;
    }

    .clear {
        clear: both;
    }

    .slider-container {
        width: 200px;
        margin-left: 20px;
    }

    :root {
    --track-bg: #B2BFCC;
    --progress-bg: #B2BFCC;
    --thumb-bg: #566979;
    }
</style>