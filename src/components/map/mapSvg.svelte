
<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { geoPath } from 'd3-geo';
	import { raise } from 'layercake';

	import { onMount, onDestroy } from 'svelte';
	import maplibre from 'maplibre-gl';
	// import 'maplibre-gl/dist/maplibre-gl.css';
    
	const dispatch = createEventDispatcher();
  
    export let locations;
    export let time;

	let map;
	let mapLoaded = false;
	let style = {
		'version': 8,
		'sources': {
			'raster-tiles': {
				'type': 'raster',
				'tiles': [
					'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
				],
				'tileSize': 256,
			}
		},
		'layers': [{
			'id': 'raster',
			'type': 'raster',
			'source': 'raster-tiles',
			'minzoom': 2,
			'maxzoom': 14
		}],
		center: [31.5,48.6],
		zoom: 5,
		attributionControl: false
	};

	onMount(() => {
		map = new maplibre.Map({
			container: 'map',
			style,
			minZoom: 2.01,
			maxZoom: 13.99
		});

		// try loading map layers on map load
		map.on('load', () => {
			mapLoaded = true;
			addLocations();
		});
	}); // end onMount

	function addLocations() {
		console.log('Add layer to map');
        map.addSource('schools', {
				'type': 'geojson',
				'data': {
					'type': 'FeatureCollection',
					'features': locations
				}
			});
		map.addLayer({
			'id': 'schools',
			'type': 'circle',
			'source': 'schools',
			'layout': {},
			'paint': {
				'circle-color': '#70c5f9',
				'circle-opacity': 0.8,
				'circle-stroke-color': "#222",
				'circle-stroke-width': 1,
				'circle-stroke-opacity': 0.5
			}
		});
		map.on('mouseenter', (e) => {
            console.log(e);
        });
		// 	var tooltipText = "This area of "+e.features[0].properties.SOVEREIGNT+" that would go underwater is <strong>" + e.features[0].properties.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</strong> km²";
		// 	popup.setLngLat(e.lngLat).setHTML(tooltipText).addTo(map);
		// 	popup.trackPointer();
		map.on('mouseleave', () => {
			// map.setPaintProperty(id, 'fill-outline-color', "#D82D1D");
		// 	popup.remove();
		});
	};

	function handleMousemove(feature) {
		dispatch('mousemove', feature);
	}


  </script>

	<div id="map" class="App"></div>
	<div class="map-source source-text">Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a></div>  
  <style>

	#map {
		height: 600px;
		width: 100vw;
		/* max-width: 600px; */
		max-height: 85vh;
	}

  </style>