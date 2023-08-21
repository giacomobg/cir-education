<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/mapbox-gl@1.13.2/dist/mapbox-gl.css"
	/>
</svelte:head>

<script>
	import { createEventDispatcher } from 'svelte';

	import { onMount } from 'svelte';
	import mapbox from 'mapbox-gl';
	// import 'mapbox-gl/dist/mapbox-gl.css';
	mapbox.accessToken = "pk.eyJ1IjoiZ2lhY29tb2JnIiwiYSI6ImNsZ2Zic21xNzAwNGozcXJyNnAzcXIybHAifQ.yDFQ-IvMuP_r6y4SESSSFw";
    
	const dispatch = createEventDispatcher();
  
    export let locations;
	export let oblasts;
	export let ukraine;
    export let time;
	export let hoveredOblastId = null;

	// time is the month. timeStart is the month start, timeEnd is the month end, mapbox needs it converted to epoch
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


	let ukraineBounds = [[27.2, 52.1], [40.9, 45.4]]

	let map;
	let mapLoaded = false;
	let style = "mapbox://styles/mapbox/light-v10";
	let transition = 500;

	// filterSchools filters all the locations within desired month
	// filterOther is everything else
	let filterSchools;
	let filterOther;
	$: filterSchools = ['all',
		['>=', ['get', 'timestamp'], timeStart],
		['<', ['get', 'timestamp'], timeEnd]
	];
	$: filterOther = ['!', filterSchools];
	
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
				'line-color': "#A1A5AD",
			}
		})
		// invisible fill layer for hovering over
		map.addLayer({
			'id': 'oblasts-fill-hover',
			'type': 'fill',
			'source': 'oblasts',
			'layout': {},
			'paint': {
				'fill-opacity': 0,
				// 'fill-opacity': [
				// 	'case',
				// 	['boolean', ['feature-state', 'hover'], false],
				// 	0.6,
				// 	0
				// ],
			}
		})
		// fill layer filtered by hovered oblast
		map.addLayer({
			'id': 'oblasts-fill',
			'type': 'fill',
			'source': 'oblasts',
			'filter': ['==', 'a', 'b'],
			'layout': {},
			'paint': {
				'fill-opacity': 0.4,
				'fill-color': "#507262"
			}
		});
		// country outline for style purposes
		map.addLayer({
			'id': 'ukraine-line',
			'type': 'line',
			'source': 'ukraine',
			'layout': {},
			'paint': {
				// 'fill-opacity': 0,
				'line-color': "#666",
				'line-width': 1.5
			}
		})

		// locations for other months to sit back on map
		map.addLayer({
			'id': 'schools-other',
			'type': 'circle',
			'source': 'schools',
			'layout': {},
			'filter': filterOther,
			'paint': {
				'circle-color': "#506372",
				'circle-opacity': 0.3,
				// 'circle-stroke-color': "#222",
				'circle-stroke-width': 0,
				// 'circle-stroke-opacity': 0.5
			}
		});
		// location for current month to be highlighted on map
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
				'circle-stroke-color': "#222",
				'circle-stroke-width': 1,
				'circle-stroke-opacity': 0.9,
				'circle-stroke-opacity-transition': {'duration': transition}
			}
		});


		// select oblast if hovered
		map.on('mousemove', 'oblasts-fill-hover', (e) => {
			hoveredOblastId = e.features[0].properties.ADM1_PCODE;
			filterByOblast();
		});
		
		// deselect oblast
		map.on('mouseleave', 'oblasts-fill-hover', () => {
			hoveredOblastId = null;
			filterByOblast();
		});
	};

	// highlight currently selected oblast
	function filterByOblast() {
		map.setFilter('oblasts-fill', [
			'==',
			['get', 'ADM1_PCODE'],
			hoveredOblastId
		]);
	}
	
	// the order of operations is a little complicated.
	$: if (time && map && map.getLayer('schools-other') && map.getLayer('schools-current')) {
		// Transition out old locations, add them back into background
		map.setFilter('schools-other', ['all', true])
		map.setPaintProperty('schools-current', 'circle-opacity', 0)
			.setPaintProperty('schools-current', 'circle-stroke-opacity', 0);
		// Then transition in new locations, then remove them from background
		setTimeout(() => {
			map.setFilter('schools-current', filterSchools);
			map.setPaintProperty('schools-current', 'circle-opacity', 1)
				.setPaintProperty('schools-current', 'circle-stroke-opacity', 1);
			setTimeout(() => {
				map.setFilter('schools-other', filterOther);
			}, transition);
		}, transition);
	};
	// when hoveredOblastId changes, update filtered oblast
	$: if (hoveredOblastId && map && map.getLayer('oblasts-fill')) {
		filterByOblast();
	}

  </script>

	<div id="map" class="App"></div>
	<!-- <div class="map-source source-text">Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a></div>   -->
  <style>

	#map {
		height: 300px;
		/* width: 100vw; */
		/* max-width: 600px; */
		max-height: 80vh;  /* This must match the one for vis-container in app.svelte !! */
	}

  </style>