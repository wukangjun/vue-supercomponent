<template>
	<el-row :gutter="20">
		<el-form :model="options.search" label-position="top" :rules="rules" label-width="80px" ref="searchForm"> 
			<!-- 所属企业 -->
			<el-col :span="12">
				<el-form-item :label="$t('dm.company')" prop="enterpriseName">
					<cv-dropdown-tree 
					:placeholder="$t('common.enterprise.affiliated')"
					:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
					v-model="options.search.enterpriseName"
					@label="enterpriseId"></cv-dropdown-tree>
				</el-form-item>
			</el-col>
			<!-- 车牌号码  -->
			<el-col :span="12">
				<el-form-item :label="$t('cE.carNumber')" prop="plateCode">
					<el-input v-model.trim="options.search.plateCode" size='small' :maxlength='10'></el-input>
				</el-form-item>
			</el-col>
			<!-- 注册状态  -->
			<el-col :span="12">
				<el-form-item :label="$t('cE.regStatus')" prop="isLogout">
					<el-select v-model="options.search.isLogout" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small'> 
						<el-option :label="$t('filter.register')" value="0"></el-option>
						<el-option :label="$t('filter.noregister')" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<!--  使用状态 -->
			<el-col :span="12">
					<el-form-item :label="$t('cE.useStatus')" prop="useStatus">
						<el-select v-model="options.search.useStatus"  clearable  :placeholder="$t('terminal.placeholder')" class="code" size='small'> 
							<el-option :label="$t('filter.onStatus')" value="0"></el-option>
							<el-option :label="$t('filter.noStatus')" value="1"></el-option>
						</el-select>
					</el-form-item>
			</el-col>
			<!-- 在线状态  -->
			<el-col :span="12">
					<el-form-item :label="$t('cE.onlineStatus')" prop="onlineStatus">
						<el-select v-model="options.search.onlineStatus"  clearable  :placeholder="$t('terminal.placeholder')" class="code" size='small'> 
							<el-option :label="$t('filter.online')" value="1"></el-option>
							<el-option :label="$t('filter.offline')" value="0"></el-option>
						</el-select>
					</el-form-item>
			</el-col>
			<!-- 终端手机号  -->
			<el-col :span="12">
					<el-form-item :label="$t('cE.endPhone')" prop="mobileCode">
						<el-input v-model.trim="options.search.mobileCode" size='small' :maxlength='12'></el-input>
					</el-form-item>
			</el-col>
			<!-- 设备编码  -->
			<el-col :span="12">
					<el-form-item label="终端编号" prop="terminalCode">
						<el-input v-model.trim="options.search.terminalCode" size='small' :maxlength='7'></el-input>
					</el-form-item>
			</el-col>
		</el-form>
		<el-col :span="24">
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
		</el-col>
	</el-row>
</template>

<script>
import {COMMON} from '@/utils'
	export default{
		props: {
			options: {}
		},
		data(){
			return {
				rules:{
					mobileCode:[
						{pattern:/^[0-9]+$/,message:this.$t("filter.type2"),trigger:'blur,change'}
					],
					terminalCode:[
						{pattern:/^[A-Z0-9]+$/,message:this.$t("filter.type7"),trigger:'blur,change'}
					],
					plateCode: [
						{pattern:/^[\u4e00-\u9fa5|WJ]|[A-Za-z]|[0-9]+$/,message:this.$t("filter.type6"),trigger:'blur,change'}
					],
				}
			}
		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			},
			enterpriseId(val){
				if(val.id!='empty'){
					this.options.search.id = val.id;
				}else{
					this.options.search.id='';
				}
			}
		}

	}
</script>
<style lang="scss" scoped>
	.code{width:270px}
</style>
