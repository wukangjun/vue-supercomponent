<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm">
			<el-form-item :label="$t('vehicleInfo.plateCode')" prop="plateCode">
				<el-input v-model="options.search.plateCode" size="small" :maxlength='100'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vehicleInfo.mobileCode')" prop="mobileCode">
				<el-input v-model="options.search.mobileCode" size="small" :maxlength='100'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vehicleInfo.driverName')" prop="driverName">
				<el-input v-model="options.search.driverName" size="small" :maxlength='100'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vehicleInfo.enterpriseName')" prop="enterpriseName">
				<el-input v-model="options.search.enterpriseName" size="small" :maxlength='100'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vehicleInfo.fleetName')" prop="fleetName">
				<el-input v-model="options.search.fleetName" size="small" :maxlength='100'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vehicleInfo.onlineStatus')" prop="onlineStatus">
				 <el-select v-model="options.search.onlineStatus" style="width:360px;" size="small">
                        <el-option :label="$t('filter.all')" value=""></el-option>
                        <el-option :label="$t('filter.online')" value="1"></el-option>
						<el-option :label="$t('filter.offline')" value="0"></el-option>
                </el-select>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
import {COMMON} from '@/utils'
	export default{
	
		props: {
			options: {}
		},
		data(){
			return{
			 
			}

		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			}
		}
	}
</script>