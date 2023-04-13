<script>
  import { feature } from 'topojson-client';

  import MapSvg from '../components/map/mapSvg.svelte';
  import Select from 'svelte-select';

    export let locations;
    let map;
    // let targetLayer;
    let countryLayer;
    let selectedCountry;
    let flying = false;
    let countryLayerStyle = {color:'#222', fillOpacity: 0.2, weight: 2, opacity: 1};
    // let targetLayerStyle = {color: '#B21C0E', fillColor: '#d82d1d', weight: 2, opacity: 1, fillOpacity: 0.3 };

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

</script>

<svelte:window />

<div class="chart-container">
  <MapSvg
    {locations}
    />
</div>

<style>

  :global(.chart-container .layercake-container) {
    position: absolute !important;
    top: 0;
  }

</style>
