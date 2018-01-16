<template>	
	<div class="cv-map-tool">
		<el-dropdown class="toolItem">
			<span class="el-dropdown-link">
				<cv-icon name="tool-cabinet_icon" size="14"></cv-icon>
				工具箱<i class="el-icon-caret-bottom el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown" style="background:rgba(0,0,0,0.70);border:1px solid rgba(0,0,0,0.70);color:#fff;">
				<el-dropdown-item @click.native="screenshot">屏幕截屏</el-dropdown-item>
			    <el-dropdown-item @click.native="areaEnlarge">区域放大</el-dropdown-item>
			    <el-dropdown-item @click.native="distance">测距</el-dropdown-item>
			    <el-dropdown-item @click.native="print">打印</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>	
		<el-input 
		class="toolItem" size="mini" style="width: 100px;" 
		placeholder="搜索位置"
		@keyup.native.enter="searchLocation"
		v-model="locationSearch"
		v-show="isSearch">
		</el-input>	
		<!-- <el-dropdown class="toolItem">
			<span class="el-dropdown-link">
				指令下发<i class="el-icon-caret-bottom el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>拍照下发</el-dropdown-item>
			    <el-dropdown-item>文本下发</el-dropdown-item>
			    <el-dropdown-item>点名下发</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>		 -->
		<slot></slot>
		<span class="toolItem" @click="fullBtn">
			<i :class="['fullBtn', isFull?'el-icon-tsp-fullscreen-exit':'el-icon-tsp-fullscreen']"></i>
		</span>	
	</div>	
</template>

<script>
	import screenshot from './model/html2canvas'
	import zero from '@/assets/img/map/red.png'
	export default {
		props: {
			value: {
				default: true
			},
			mapName: {},
			isSearch: {
				default: true
			}
		},
		data(){
			return {
				// 地图全屏收缩标志
				isFull: false,
				isMulti: true,
				rectangleZoom: null,
				// 地图位置搜索
				locationSearch: "",
				// 全屏的主体
				fullPoster: null,
				timer: null
			}
		},
		methods: {
			fullBtn(){
				this.isFull = !this.isFull;
				if(this.isFull){
					this.fullPoster.style.top = 0 + 'px';
				}else{
					this.fullPoster.style.top = 90 + 'px';
				}
			},
			// 截屏功能
			screenshot(){
				const _vm = this;
				const flashAnimation = url => {
					const div = document.createElement('div');
		            div.className = 'screenshot-item';
		            const photo = document.createElement('img');
					photo.src = url;
					photo.className = 'screenshot-img';		
		            document.body.appendChild(photo);
		            document.body.appendChild(div);
		            setTimeout(_ => {
		            	document.body.removeChild(div);
		            	photo.className = photo.className + ' ' + 'screenshot-img-move';
		            	setTimeout( _ => { document.body.removeChild(photo) }, 500);
		            }, 0);
				};
				screenshot(document.body, {
					onrendered(canvas) {
						let url = canvas.toDataURL("image/png"); 
						if(_vm.$service.isIe()){
							let bstr = window.atob(url.split(',')[1])
							let len = bstr.length;
							let u8arr = new Uint8Array(len);
							while(len--){
								u8arr[len] = url.charCodeAt(len);
							}
							let blob = new Blob([u8arr]);
							window.navigator.msSaveOrOpenBlob(blob, 'hello.png');
						}else{
							const save_link = document.createElement('a');
							save_link.href = url;
							save_link.download = name || 'jiankong';
							let event = document.createEvent('MouseEvents');
							event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
							save_link.dispatchEvent(event);
						}
						flashAnimation(url); 
					}
				});
			},
			// 区域放大
			areaEnlarge(){
				this.$store.dispatch('isToggleMonitorTree', false);
				this.rectangleZoom = this.$map[this.mapName].rectangleZoom();
				this.rectangleZoom.open();
			},
			// 测距
			distance(){
				const _vm = this;
				this.$store.dispatch('isToggleMonitorTree', false);
				const distance = this.$map[this.mapName].distanceTool({
					secIcon: this.$map[_vm.mapName].setIcon(zero, 32, 40)
				});
				distance.open();
			},
			// 搜索地址
			searchLocation(){
				this.$map[this.mapName].Geocoder(this.locationSearch);
			},
			// 打印页面
			print(){
				window.print();
			}
		},
		watch: {
			isMulti(newVal){
				this.$emit('input', newVal);
			}
		},
		mounted(){
			setTimeout(_ => {
				this.fullPoster = document.querySelector('#contents');
			}, 500)
			
		}
	}
</script>

<style lang="scss">
	.screenshot-item{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 9998;
		background: #fff;
	}

	.screenshot-img{
		width: 40%;
		border: 2px solid black;
		position: fixed;
		top: 15%;
		left: 50%;
		margin-left: -20%;
		z-index: 9999;
	}
	.screenshot-img-move{
		transition: all .5s ease-in-out;
		top: 100%;
		left: 20px;
	}
	.cv-map-tool{
		width: auto;
		padding: 6px 8px 6px 9px;
		box-shadow: 1px 2px 1px rgba(0,0,0,.15);
		border-radius: 2px;
		background: rgba(0,0,0,0.70);
		color:#fff;
		.el-dropdown{
			color:#fff;
		}
		.el-dropdown-link{
			cursor: pointer;
			width:100%;
		}
		.el-switch{
			vertical-align: top;
		}
		.el-button{
			background:rgba(0,0,0,0.70);
			color:#fff;
		}
		.toolItem{
			padding: 0 8px 0 6px;
			border-right: 1px solid #d1dbe5;	
			font-size: 12px;			
			vertical-align: sub;
			&:last-child{
				border: 0
			}
			.fullBtn{
				cursor: pointer;
				font-size:16px;
				color: #fff;
			}
		}
	}
</style>