<script>
	// import AxisX from '../components/cartesian/AxisX.svelte';
	// import AxisY from '../components/cartesian/AxisY.svelte';
    import { scaleLinear, scaleBand } from 'd3-scale';

    export let config;


</script>

        <!-- <AxisX gridlines={false} formatTick={config?.formatX}/>
        <AxisY formatTick={config?.formatY} /> -->
        <slot></slot>
