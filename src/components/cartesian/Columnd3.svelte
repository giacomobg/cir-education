<script>

    export let data;
    export let config;

    const dates = Object.keys(data[0]).filter(d => (d !== config?.xKey) & (d !== config?.xKeyCode));
    data.forEach(d => {
        dates.forEach(date => {
            d[date] = +d[date]
        })
    });

    console.log(data);
    console.log(dates);

</script>

<svg>

</svg>

<style>
    svg {
        width: 100%;
        height: 100%;
    }
</style>