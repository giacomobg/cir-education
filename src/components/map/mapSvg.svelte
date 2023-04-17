<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/mapbox-gl@1.13.2/dist/mapbox-gl.css"
	/>
</svelte:head>

<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { geoPath } from 'd3-geo';
	import { raise } from 'layercake';

	import { onMount, onDestroy } from 'svelte';
	import mapbox from 'mapbox-gl';
	// import 'mapbox-gl/dist/mapbox-gl.css';
	mapbox.accessToken = "pk.eyJ1IjoiZ2lhY29tb2JnIiwiYSI6ImNsZ2Zic21xNzAwNGozcXJyNnAzcXIybHAifQ.yDFQ-IvMuP_r6y4SESSSFw";
    
	const dispatch = createEventDispatcher();
  
    export let locations;
	export let oblasts;
	export let ukraine;
    export let time;
	// let timeStart = getEpoch(time);
	// let timeEnd = getEpoch(getTimeEnd());
	let timeStart;
	let timeEnd;
	$: time,
		timeStart = getEpoch(time),
		timeEnd = getEpoch(getTimeEnd());
	
	function getTimeEnd() {
		return new Date(time.getFullYear(), time.getMonth()+1);
	};
	function getEpoch(t) {
		return t.getTime()/1000; // seconds not ms
	}

	let hoveredOblastId = null;

	let ukraineBounds = [[22.2, 52.6], [40.9, 44.2]]

	let map;
	let mapLoaded = false;
	let style = "mapbox://styles/mapbox/light-v10";
	let transition = 500;

	let filterSchools;
	let filterOther;
	$: filterSchools = ['all',
		['>=', ['get', 'timestamp'], timeStart],
		['<', ['get', 'timestamp'], timeEnd]
	];
	$: filterOther = ['!', filterSchools];
	// $: filterOther = ['any',
	// 	['<', ['get', 'timestamp'], timeStart],
	// 	['>=', ['get', 'timestamp'], timeEnd]
	// ];
	
	onMount(() => {
		map = new mapbox.Map({
			container: 'map',
			style,
			center: [31.5, 48.6],
			zoom: 3,
			minZoom: 2.01,
			maxZoom: 13.99
		});

		map.addControl(new mapbox.NavigationControl());
		map.dragRotate.disable();
		map.touchZoomRotate.disableRotation();

		map.on('load', () => {
			map.fitBounds(ukraineBounds, {padding: 10})
			mapLoaded = true;
			addLocations();
		});
	}); // end onMount

	function addLocations() {
		// Add sources
        map.addSource('schools', {
			'type': 'geojson',
			'data': {
				'type': 'FeatureCollection',
				'features': locations
			}
		});
		map.addSource('oblasts', {
			'type': 'geojson',
			'data': {
				'type': 'FeatureCollection',
				'features': oblasts
			},
			'generateId': true
		})
		map.addSource('ukraine', {
			'type': 'geojson',
			'data': {
				'type': 'FeatureCollection',
				'features': ukraine
			},
			'generateId': true
		})

		// Add layers
		map.addLayer({
			'id': 'oblasts-line',
			'type': 'line',
			'source': 'oblasts',
			'layout': {},
			'paint': {
				'line-color': "#98a2b3",
			}
		})
		map.addLayer({
			'id': 'oblasts-fill',
			'type': 'fill',
			'source': 'oblasts',
			'layout': {},
			'paint': {
				'fill-opacity': [
					'case',
					['boolean', ['feature-state', 'hover'], false],
					0.6,
					0
				],
				'fill-color': "#98a2b3"
			}
		})
		map.addLayer({
			'id': 'ukraine-line',
			'type': 'line',
			'source': 'ukraine',
			'layout': {},
			'paint': {
				// 'fill-opacity': 0,
				'line-color': "#666",
			}
		})

		map.addLayer({
			'id': 'schools-other',
			'type': 'circle',
			'source': 'schools',
			'layout': {},
			'filter': filterOther,
			'paint': {
				'circle-color': "#889999",
				'circle-opacity': 0.5,
				// 'circle-stroke-color': "#222",
				'circle-stroke-width': 0,
				// 'circle-stroke-opacity': 0.5
			}
		});
		map.addLayer({
			'id': 'schools-current',
			'type': 'circle',
			'source': 'schools',
			'layout': {},
			'filter': filterSchools,
			'paint': {
				'circle-color': "#BF8C19",
				'circle-opacity': 0.9,
				'circle-opacity-transition': {'duration': transition},
				// 'circle-stroke-color': "#222",
				'circle-stroke-width': 0
				// 'circle-stroke-opacity': 0.5
			}
		});

		// When the user moves their mouse over the state-fill layer, we'll update the
		// feature state for the feature under the mouse.
		map.on('mousemove', 'oblasts-fill', (e) => {
			if (e.features.length > 0) {
				if (hoveredOblastId !== null) { // removes hover over old oblast
					map.setFeatureState(
						{ source: 'oblasts', id: hoveredOblastId },
						{ hover: false }
					);
				}
				hoveredOblastId = e.features[0].id;
				map.setFeatureState(
					{ source: 'oblasts', id: hoveredOblastId },
					{ hover: true }
				);
			}
		});
		
		// When the mouse leaves the state-fill layer, update the feature state of the
		// previously hovered feature.
		map.on('mouseleave', 'oblasts-fill', () => {
			if (hoveredOblastId !== null) {
				map.setFeatureState(
					{ source: 'oblasts', id: hoveredOblastId },
					{ hover: false }
				);
			}
			hoveredOblastId = null;
		});

		// map.on('mouseenter', (e) => {
        //     console.log(e);
        // });
		// // 	var tooltipText = "This area of "+e.features[0].properties.SOVEREIGNT+" that would go underwater is <strong>" + e.features[0].properties.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</strong> km²";
		// // 	popup.setLngLat(e.lngLat).setHTML(tooltipText).addTo(map);
		// // 	popup.trackPointer();
		// map.on('mouseleave', () => {
		// 	// map.setPaintProperty(id, 'fill-outline-color', "#D82D1D");
		// // 	popup.remove();
		// });
	};

	function handleMousemove(feature) {
		dispatch('mousemove', feature);
	}

	$: if (time && map && map.getLayer('schools-other') && map.getLayer('schools-current')) {
		map.setFilter('schools-other', ['all', true])
		map.setPaintProperty('schools-current', 'circle-opacity', 0);
		setTimeout(() => {
			map.setFilter('schools-current', filterSchools);
			map.setPaintProperty('schools-current', 'circle-opacity', 1);
			setTimeout(() => {
				map.setFilter('schools-other', filterOther);
			}, transition);
		}, transition);
	};


  </script>

	<div id="map" class="App"></div>
	<!-- <div class="map-source source-text">Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a></div>   -->
  <style>

	#map {
		height: 600px;
		width: 100vw;
		/* max-width: 600px; */
		max-height: 55vh;
	}

  </style>