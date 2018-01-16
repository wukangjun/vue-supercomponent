<template>
	<div class="cv-search-tree-operation">
		<el-card>
			<div class="area" @click="addEvent()">
				<cv-span type="success">{{$t('power.add')}}</cv-span>
			</div>
			<div class="area" @click="removeEvent()">
				<cv-span type="danger">{{$t('power.remove')}}</cv-span>
			</div>
			<div class="area" @click="modifyEvent()">
				<cv-span type="warning">{{$t('power.modify')}}</cv-span>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default{
		methods:{
			addEvent(){
				this.$emit('add', this.$t('power.add'))
			},
			removeEvent(){
				this.$emit('remove', this.$t('power.remove'))
			},
			modifyEvent(){
				this.$emit('modify', this.$t('power.modify'))
			}
		}
	}
</script>

<style lang="scss">
	$areaH: 28px;
	.cv-search-tree-operation{
		.el-card__body{
			width: 80px;
			padding: 0;
		}
		.area{
			width: 100%;
			height: $areaH;
			line-height: $areaH;
			text-align: center;
			margin-top: 6px;
			&:hover{
				background: #e4e8f1
			}
			&:last-child{
				margin-bottom: 6px;
			}
		}
	}
</style>