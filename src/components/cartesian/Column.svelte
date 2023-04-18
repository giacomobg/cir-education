<!--
  @component
  Generates an SVG column chart.
 -->
 <script>
    import { getContext } from 'svelte';
  
    const { data, xGet, yGet, yRange, xScale, x } = getContext('LayerCake');

    /** @type {Array} [colors=['#00e047']] - The shape's fill color. */
    export let colors;
  
    console.log($data[0]);
    console.log($x($data[0]))
    console.log($xGet);
    console.log($xScale.range());
    $: columnWidth = d => {
      const vals = $xGet(d);
      return Math.max(0, (vals[1] - vals[0]));
    };
  
    $: columnHeight = d => {
      return $yRange[0] - $yGet(d);
    };
  
    /** @type {String} [fill='#00e047'] - The shape's fill color. */
    export let fill = '#368ae2';
  
    /** @type {String} [stroke='#000'] - The shape's stroke color. */
    export let stroke = '#000';
  
    /** @type {Number} [strokeWidth=0] - The shape's stroke width. */
    export let strokeWidth = 0;
  
  </script>
  
  <g class="column-group">
    {#each $data as d, i}
      <rect
        class='group-rect'
        data-id="{i}"
        y="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
        x="{$yGet(d)}"
        height="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
        width="{columnHeight(d)}"
        fill={colors?.[i] || fill}
        {stroke}
        stroke-width="{strokeWidth}"
      />
    {/each}
  </g>
  
  