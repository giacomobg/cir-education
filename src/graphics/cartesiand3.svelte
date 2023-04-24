<script>
	// import AxisX from '../components/cartesian/AxisX.svelte';
	// import AxisY from '../components/cartesian/AxisY.svelte';
    import { scaleLinear, scaleBand } from 'd3-scale';
    import { onMount, setContext } from 'svelte';
    import { timeParse, timeFormat } from 'd3-time-format';
    import { select } from 'd3-selection';
    import { axisLeft } from 'd3-axis';
    import 'd3-transition';
    
    import Columnd3 from '../components/cartesian/Columnd3.svelte';

    export let data;
    export let config;
    let margin = config.margin;
    export let timeIndex;
    export let hoveredOblastId;
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

    setContext("dates", dates);

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
        
        let format = timeFormat("%b '%y");
        let yAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(axisLeft(yScale)
                .tickFormat((tick) => {
                    return format(timeParse("%m/%Y")(tick))
                })
            );
        yAxis.select('.domain')
            .attr("stroke-width", 0);
        yAxis.style("font-family", "raleway");
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
            .attr("x", 3)
            .attr("y", yScale(dates[timeIndex]) + margin.top)
            .attr("width", width + margin.left - 20)
            .attr("height", yScale.bandwidth())
            .style("fill", "none")
            // .style("fill", "#F5EAD1")
            .style("stroke", "#BF8C19")
            .style("stroke-width", "2px")

    });

    $: if (yScale) {
        timeIndex,
        select("rect.highlight-rect")
            .transition()
            .duration(600)
            .attr("y", yScale(dates[timeIndex]) + margin.top);
    }

</script>

    <h2>Monthly verified incidents by oblast</h2>
    <p>Hover over to see them on the map</p>

    <svg id="graphic">
        <!-- <AxisX gridlines={false} formatTick={config?.formatX}/>
        <AxisY formatTick={config?.formatY} /> -->
        
        {#if xScale && yScale && innerXScale}
            {#each data as d}
                <Columnd3 data={d} {config}
                {xScale} {yScale} {innerXScale}
                bind:hoveredOblastId={hoveredOblastId}
                /> 
            {/each}
        {/if}

        <rect class="highlight-rect"></rect>

    </svg>

<style>

    h2 {
        margin-top: 0px;
    }
    svg {
        width: 100%;
        height: calc(100% - 55px);
    }

    @media (max-width:599px) {
        h2 {
            margin-top: 10px;
        }
    }
    @media (max-width:315px) {
        svg {
           height: calc(100% - 85px);
        }
    }



</style>
