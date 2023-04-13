<script>
	import { LayerCake, Svg } from 'layercake';
	import AxisX from '../components/cartesian/AxisX.svelte';
	import AxisY from '../components/cartesian/AxisY.svelte';

    export let data;
    export let config;

	$: yMin = Math.min(...data.flat().map(d => d[config?.yKey || "value"]))
	$: yDomain = yMin < 0 ? [yMin, null] : [0, null];
</script>
<LayerCake
    padding={config?.padding || { right: 8, bottom: 32, left: 32, top: 8 }}
    x={config?.xKey || "key"}
    y={config?.yKey || "value"}
    xScale={config?.xScale}
    yDomain={config?.yDomain || yDomain}
    xDomain={config?.xDomain}
    data={data}
    flatData={data.flat()}
>
    <Svg>
        <AxisX gridlines={false} formatTick={config?.formatX}/>
        <AxisY formatTick={config?.formatY} />
        <slot></slot>
    </Svg>
</LayerCake>