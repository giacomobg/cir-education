<script>

    import { onMount, getContext } from 'svelte';
    import { select } from 'd3-selection';

    const dates = getContext("dates");

    export let data;
    export let config;
    let margin = config.margin;
    export let hoveredOblastId;
    let currentOblastHovered = hoveredOblastId == data.oblast_code;
    export let xScale;
    export let yScale;
    export let innerXScale;

    let chart_data = dates.map(date => ( {key: date, value: data[date]} ));

    onMount(() => {
        let g = select("g.column."+data.oblast)
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");
        
        g.selectAll("rect")
            .data(chart_data)
            .enter()
            .append("rect")
            .attr("class", d => data.oblast + " " + d.key)
            .attr("x", xScale(data.oblast) )
            .attr("y", function(d) { return yScale(d.key); })
            .attr("width", function(d) { return innerXScale(d.value); })
            .attr("height", yScale.bandwidth() )
            .attr("fill", "#566979")
        
        g.selectAll("text.labels")
            .data(chart_data)
            .enter()
            .append("text")
            .attr("x", d => xScale(data.oblast) + innerXScale(d.value) + 2 )
            .attr("y", d => yScale(d.key) + yScale.bandwidth()/4*3)
            .text(d => d.value)
            .style("fill", '#666')

        g.append("text")
            .datum(data.oblast)
            .text(d => d)
            .attr("x", 2+xScale(data.oblast))
            .attr("y", -3)
            // .attr("y", -5-15*(oblasts.indexOf(data.oblast)%2))
        // g.append("line")
        //     .attr("x1", xScale(data.oblast))
        //     .attr("x2", xScale(data.oblast))
        //     .attr("y2", -18-15*(oblasts.indexOf(data.oblast)%2))
        //     .style("stroke", "#222")
    })

    function hover() {
        hoveredOblastId = data.oblast_code;
    }
    function mouseLeave() {
        hoveredOblastId = null;
    }

    $: currentOblastHovered = hoveredOblastId == data.oblast_code;

</script>

<g class={"column " + data.oblast}></g>
<rect class="hover-rect"
    x={xScale(data.oblast)+margin.left}
    y=0
    width={xScale.bandwidth()}
    height={yScale.range()[1]+margin.top}
    style={
        "fill:"+ (currentOblastHovered ? "#507262" : '#fff')+";"+
        "opacity:"+ (currentOblastHovered ? 0.4 : 0) +";"
    }
    on:mouseenter={hover}
    on:touchstart={hover}
    on:mouseleave={mouseLeave}
    >
</rect>
