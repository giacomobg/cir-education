<script>
  import { feature } from 'topojson-client';

  import MapSvg from '../components/map/mapSvg.svelte';
  import Select from 'svelte-select';

  let locations;
  let oblasts;

  // const createMap = (node) => {
  //   let m = L.map(node,{})
  //   return m;
  // }
  // const mapInit = (node) => {
  //   map = createMap(node);
  //   L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',{
  //     tileSize: 256,
  //     zoomOffset: 0,
  //     minZoom: 1,
  //     attribution: `Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.<br>Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>`,
  //     crossOrigin: true,
  //   }).addTo(map);

  //   // add outline of ukraine at start
  //   countryLayer = L.geoJSON(countries.find(d => d.value=='Ukraine'), {
  //       style: countryLayerStyle,
  //       coordsToLatLng: function (coords) {
  //           return new L.LatLng(coords[1], coords[0]); // swap [lon,lat] to [lat,lon]
  //       }
  //   }).addTo(map);

  //   // move map to ukraine
  //   map.fitBounds(countryLayer.getBounds())

  //   return {
  //     destroy: () => {
  //       map.remove();
  //       map = null;
  //     }
  //   };
  // }

  // const handleChangeCountry = (e) => {
  //   flyToCountry(e.detail);
  // }

  // const handleClear = (e) => {
  //   // remove previously selected country layer
  //   if (countryLayer) countryLayer.remove();
  // }
  // const flyToCountry = (detail) => {
  //   // remove previous country shape and add new one
  //   if (countryLayer) countryLayer.remove();
  //   countryLayer = L.geoJSON(detail, {
  //     style: countryLayerStyle,
  //       coordsToLatLng: function (coords) {
  //           return new L.LatLng(coords[1], coords[0]); // swap [lon,lat] to [lat,lon]
  //       }
  //   }).addTo(map);
    
  //   flying=true;
  //   // fly to country, or hardcoded point if France

  //   if (detail.value == 'France') {
  //     map.flyTo( { lat: 46.75, lng: 2.9 })
  //   } else if (detail.value == 'Russian Federation') {
  //     let bounds = countryLayer.getBounds()
  //     bounds._southWest.lng = 26;
  //     map.flyToBounds(bounds);
  //   } else if (detail.value == 'United States') {
  //     let bounds = countryLayer.getBounds()
  //     bounds._northEast.lng = -66;
  //     map.flyToBounds(bounds);
  //   } else {
  //     map.flyToBounds( countryLayer.getBounds(), {maxZoom: 4.5} );
  //   } 
  // }

  fetch('./data/damage-locations.json', {mode: 'cors', cache: 'no-store' })
    .then(response => { return response.json() })
    .then(data => {
      locations= feature(data, data.objects["damage-locations"]).features.filter(d => d.geometry)
                .map(d => ({
                  ...d,
                  lat: +d.properties.Lat, 
                  lon: +d.properties.Long,
                  timestamp: +d.properties.Timestamp
                }));
  });

  fetch('./data/oblasts.json', {mode: 'cors', cache: 'no-store' })
    .then(response => { return response.json() })
    .then(data => {
      oblasts= feature(data, data.objects.features).features.filter(d => d.geometry)
                // .map(d => ({
                //   ...d
                // }));
  });

</script>

<svelte:window />

<div class="chart-container">
  {#if locations && oblasts}
    <MapSvg
      {locations} {oblasts}
    />
  {/if}
</div>

<style>

  :global(.chart-container .layercake-container) {
    position: absolute !important;
    top: 0;
  }

</style>
