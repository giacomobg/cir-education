<script>
	// import AxisX from '../components/cartesian/AxisX.svelte';
	// import AxisY from '../components/cartesian/AxisY.svelte';
    import { scaleLinear, scaleBand } from 'd3-scale';
    import { onMount, setContext } from 'svelte';
    
    import { select } from 'd3-selection';
    import { axisLeft, axisTop } from 'd3-axis';
    import 'd3-transition';
    
    import Columnd3 from '../components/cartesian/Columnd3.svelte';

    export let data;
    export let config;
    let margin = config.margin;
    export let timeIndex;
    let xScale;
    let yScale;
    let innerXScale;

    const dates = Object.keys(data[0]).filter(d => (d !== config?.xKey) & (d !== config?.xKeyCode));
    const oblasts = data.map(d => d.oblast)
    const oblast_codes = data.map(d => d.oblast_code)
    data.forEach(d => {
        dates.forEach(date => {
            d[date] = +d[date]
        })
    });


    const max = data.map(d =>
        Math.max(...Object.values(d).filter(val => Number.isInteger(val)))
    );

    console.log(data);
    console.log(dates);
    console.log(oblasts);
    console.log(max);

    setContext("dates", dates);
    setContext("oblasts", oblasts);
    setContext("oblast_codes", oblast_codes);
    setContext("max", max);


    onMount(() => {

        let svg = select("svg#graphic");

        let height = parseInt(svg.style("height"))-margin.top-margin.bottom;
        let width = parseInt(svg.style("width"))-margin.left-margin.right;

        xScale = scaleBand()
            .domain(oblasts)
            .range([0, width]);

        innerXScale = scaleLinear()
            .domain([0, Math.max(...max)+2])
            .range([0,xScale.bandwidth()-12]);
        yScale = scaleBand()
            .domain(dates)
            .range([0, height]);
        

        let yAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(axisLeft(yScale));
        yAxis.select('.domain')
            .attr("stroke-width", 0);
        // let xAxis = svg.append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(axisTop(xScale)
        //         // .tickSize(-height)
        //         .tickSize(0)
        //     );
        // xAxis.select('.domain')
        //     .attr("stroke-width", 0);
        // xAxis.selectAll('.tick line')
        //     .attr("x1", -xScale.bandwidth()/2)
        //     .attr("x2", -xScale.bandwidth()/2)

        // highlight current time
        select("rect.highlight-rect")
            .attr("x", margin.left)
            .attr("y", yScale(dates[timeIndex]) + margin.top)
            .attr("width", width)
            .attr("height", yScale.bandwidth())
            .style("fill", "none")
            // .style("fill", "#F5EAD1")
            .style("stroke", "#BF8C19")
            .style("stroke-width", "2px")

    });

    $: if (yScale) {
        timeIndex,
        console.log(select("rect.highlight-rect")),
        select("rect.highlight-rect")
            .transition()
            .duration(600)
            .attr("y", yScale(dates[timeIndex]) + margin.top);
    }

</script>

    <svg id="graphic">
        <!-- <AxisX gridlines={false} formatTick={config?.formatX}/>
        <AxisY formatTick={config?.formatY} /> -->
        
        {#if xScale && yScale && innerXScale}
            {#each data as d}
                <Columnd3 data={d} {config}
                {xScale} {yScale} {innerXScale}
                /> 
            {/each}
        {/if}

        <rect class="highlight-rect"></rect>

    </svg>

<style>
    svg {
        width: 100%;
        height: calc(100% - 50px);
    }
</style>
