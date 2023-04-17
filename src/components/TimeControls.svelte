<script>
    // import { createEventDispatcher } from 'svelte';
    // const dispatch = createEventDispatcher();
    

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

</script>

<div class="time-controls-container">
    <button on:click={goBack} class="back">&lt;</button>
    <p class="month">{timePeriods[timeIndex].toLocaleString("en-GB", { year: "numeric", month: "long"})}</p>
    <button on:click={goForwards} class="forward">&gt;</button>
    <button on:click={() => {playing = !playing; if (playing) {animate();play();}} } class="play-pause">{playing ? 'Pause' : (timeIndex == timePeriods.length-1 ? 'Replay' : 'Play')}</button>
    <br class="clear"/>    
</div>

<style>

    button, p {
        float: left;
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

</style>