<template>
<div>
	<div class="mapbase" :id="id" style="z-index:0;">
	</div>
	<change-map v-show="isMap"></change-map>
	</div>
</template>

<script>
import changeMap from "./changeMap.vue"
import { service } from '../../utils'
import MapApi from './src/google.map.js'
export default {
	 components:{
        changeMap
    },
		name: 'googleMap',
		props: {
			isMap:{
				default:false
			},
			id: {
				default: 'map'
			},
			zoom: {
				type: [Number],
				default: 9
			},
			center: {},
			control: {}
		},
		methods: {
			mapInit() {
				let latlng = new google.maps.LatLng(31.2303904, 121.47370209999997),
					map = new google.maps.Map(document.getElementById(this.id), {
						center: latlng,
						zoom: 8
					});
			 this.$map[this.id] = new MapApi(map);
			},
			getMapScript() {
				if (!global.selfMap) {
					let key = this.$map.key;
					let language=localStorage.getItem("language");
					global.selfMap = {}
					global.selfMap._preloader = new Promise((resolve, reject) => {
						global._initGoogleMap = function () {
							resolve(global.selfMap)
							global.document.body.removeChild($script)
							global.selfMap._preloader = null
							global._initGoogleMap = null
						}
						const $script = document.createElement('script');
						global.document.body.appendChild($script);
						$script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing&language=${language}&callback=_initGoogleMap`;
					})
					return global.selfMap._preloader
				} else if (!global.selfMap._preloader) {
					return Promise.resolve(global.selfMap)
				} else {
					return global.selfMap._preloader
				}
			},
		},
		mounted() {
			const {getMapScript, mapInit} = this;
			getMapScript().then(mapInit)
		}
	}
</script>
<style>
.mapbase {
	min-width: 100px;
	min-height: 100px;
}
</style>