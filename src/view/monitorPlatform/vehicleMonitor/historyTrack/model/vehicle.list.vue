<template>
	<div class="">
		<el-row>
			<el-col :span="3" class="tab-item">GPS速度(km/h)</el-col>
			<el-col :span="3" class="tab-item">行驶速度(km/h)</el-col>
			<el-col :span="2" class="tab-item">GPS时间</el-col>
			<el-col :span="2" class="tab-item">方向</el-col>
			<el-col :span="2" class="tab-item">海拔(m)</el-col>
			<el-col :span="2" class="tab-item">油耗(L)</el-col>
			<el-col :span="2" class="tab-item">报警总数</el-col>
			<el-col :span="8" class="tab-item">位置</el-col>
		</el-row>
		<cv-scrollbar :style="{height: height+'px'}" class="tab-content" ref="pagination" :toBottom="toBottomCallback" @click.native="scrollbarEvent($event)">
			<li 
				:num="index"
				ref="list" 
				class="tab-content-item" 
				:class="{'on': (currentId==data.vehicleId)&&data.vehicleId?true:false}"
				v-for="(data, index) in currentDatas"
				:key="data.vehicleId">
				<el-col :span="3" class="tab-item">{{data.gpsSpeed | isValue}}</el-col>
				<el-col :span="3" class="tab-item">{{data.dspeed | isValue}}</el-col>
				<el-col :span="2" class="tab-item"
				@mouseenter.native="handleCellMouseEnter($event, data)"
				@mouseleave.native="handleCellMouseLeave">
					{{data.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
				</el-col>
				<el-col :span="2" class="tab-item">{{data.direction|direction|isValue}}</el-col>	
				<el-col :span="2" class="tab-item">{{data.high|isValue}}</el-col>
				<el-col :span="2" class="tab-item">{{data.oilMass|isValue}}</el-col>
				<el-col :span="2" class="tab-item">{{data.alarmCount|isValue}}</el-col>
				<el-col :span="8" class="tab-item"
					@mouseenter.native="handleCellMouseEnter($event, data)"
					@mouseleave.native="handleCellMouseLeave">
					{{data.locationDesc|isValue}}
				</el-col>
			</li>
			<el-tooltip 
			:content="tooltipContent" 
			placement="top" 
			ref="tooltip" 
			effect="light"></el-tooltip>
		</cv-scrollbar>
	</div>	
</template>

<script>
	export default {
		props: {
			
		},
		data(){
			return{
				height: 170,
				timer: null,
				pagination: 0,
				// 显示当前数据集合
				currentDatas: [],
				// 显示当前的列表中的内容信息
				tooltipContent: "",
				currentId: ""
			}
		},
		methods: {
			toBottomCallback(){
				if(this.timer){
					return;
				}
				this.timer = setTimeout(_ => {
					let size = Math.ceil(this.height / 32);
					let pages = Math.ceil(this.$store.getters['trackLists'].length / size);
					clearTimeout(this.timer);
					this.timer = null;
					this.pagination = this.pagination + 1;
					if(this.pagination <= pages){
						this.setPagination(this.$store.getters['trackLists']);
					}			
				}, 300);
			},
			setPagination(sumCount){
				let size = Math.ceil(this.height / 32);
				this.currentDatas = this.currentDatas.concat(
					sumCount.slice(this.pagination * size, (this.pagination+1)*size)
				);
			},
			// 移入是否显示el-tooltip
			handleCellMouseEnter(event, list){
				const target = event.target;
				if(target.scrollWidth > target.offsetWidth){
					const tooltip = this.$refs.tooltip;					
					this.tooltipContent = target.innerText;
					/* 显示tooltip */
					tooltip.referenceElm = target;
					tooltip.$refs.popper.style.display = 'none';
			        tooltip.doDestroy();
			        tooltip.setExpectedState(true);
			        tooltip.handleShowPopper();	
				}	
			},
			// 去除tooltip
			handleCellMouseLeave(){
				const tooltip = this.$refs.tooltip;
			    if (tooltip) {
			        tooltip.setExpectedState(false);
			        tooltip.handleClosePopper();
			    }
			},
			scrollbarEvent(event){
				let li = this.$myJq.delegation(event);
				let list = this.$store.getters['trackLists'][Number(li.getAttribute('num'))];
				this.currentId = list.id;
				this.$emit('position', list);
			}
		},
		watch: {
			'$store.getters.trackLists'(newVal){
				this.pagination = 0;
				this.currentDatas = [];
				this.setPagination(newVal);
			}
		},
		mounted(){
			this.setPagination(this.$store.getters['trackLists']);	
		}
	}
</script>