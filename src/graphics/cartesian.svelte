<script>
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '../components/cartesian/AxisX.svelte';
	import AxisY from '../components/cartesian/AxisY.svelte';
    import { scaleLinear, scaleBand } from 'd3-scale';

    export let data;
    export let config;

    const dates = Object.keys(data[0]).filter(d => (d !== config?.xKey) & (d !== config?.xKeyCode));
    console.log(dates);
    data.forEach(d => {
        dates.forEach(date => {
            d[date] = +d[date]
        })
    });
    console.log(data);

	$: yMin = Math.min(...data.flat().map(d => d[config?.yKey || "value"]))
	$: yDomain = yMin < 0 ? [yMin, null] : [0, null];
</script>
<LayerCake
    padding={config?.padding || { right: 8, bottom: 32, left: 32, top: 8 }}
    x={config?.xKey || "key"}
    y={config?.yKey || "value"}
    xScale={config?.xScale || scaleBand}
    yScale={config?.yScale }
    yDomain={config?.yDomain || yDomain}
    zDomain={config?.zDomain || [0,30]}
    data={data}
    flatData={data.flat()}
>
    <Svg>
        <AxisX gridlines={false} formatTick={config?.formatX}/>
        <AxisY formatTick={config?.formatY} />
        <slot></slot>
    </Svg>
</LayerCake>