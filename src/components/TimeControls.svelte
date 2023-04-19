<script>
    // import { createEventDispatcher } from 'svelte';
    // const dispatch = createEventDispatcher();
    import Slider from '@bulatdashiev/svelte-slider';    

    export let timePeriods;
    export let timeIndex;
    export let animated = true;
    let playing = animated;
    let animationDelay = 3000;
    let intervalID = null;

    // dispatch('message', timePeriods[timeIndex]);

    function goBack() {
        console.log('go back');
        timeIndex = Math.max(0, timeIndex - 1);
    }
    function goForwards() {
        console.log('go forwards');
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

    $: console.log(timeIndex);
    let value = [0,100];
    $: console.log(value);
    $: setTimeIndex(value[0]);
    $: setValue(timeIndex);

    function setValue(t) {
        value[0] = t;
    }
    function setTimeIndex(v) {
        timeIndex = v;
    }


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
            <h2 class="circle">&#9679</h2>
            
        </Slider>
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
    button, p, .slider-container {
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
        top: -25px;
        left: -6px;
        color: #566979;
        /* width: 200px; */
        cursor: grab;
    }

    p {
        width: 100px;
        margin: 3px;
        font-size: 24px;
        line-height: 1.3em;
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