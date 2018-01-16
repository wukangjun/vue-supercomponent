<template>
	<div class="vehicleMaster-search">
		<el-form :inline='true'  label-position='top' :model='options.search' label-width="100px" :rules='rules' ref='searchForm'>
			<el-form-item :label="$t('terminal.company1')">
				<cv-dropdown-tree 
				style="width:260px"
				:placeholder="$t('common.enterprise.affiliated')"
				:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
				:is-default="false"
				v-model='options.search.enterpriseName'
				></cv-dropdown-tree>
			</el-form-item>
			<el-form-item label="手机号" prop='mobilephone'>
				<el-input v-model.trim="options.search.mobilephone" size='small' :maxlength='11' >
				</el-input>
			</el-form-item>
			<el-form-item label="姓名:" prop='username'>
				<el-input v-model.trim="options.search.username" size='small' :maxlength='10' >
				</el-input>
			</el-form-item>
			<el-form-item label="身份证号:" prop='idcards'>
				<el-input v-model.trim="options.search.idcards" size='small' :maxlength='18' >
				</el-input>
			</el-form-item>
            <el-form-item label="性别:"  placeholder="请选择">
				<el-select v-model="options.search.sexy" placeholder="请选择" clearable filterable>
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
			</el-form-item>
            <el-tooltip placement="top" :disabled="(time[0] == '' || time[0] == null)" :enterable="false">
				<div slot="content">
					{{/NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss')}}
					-
					{{/NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss')}}
				</div>
				<el-form-item label="注册起始时间:">
                    <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0' style='width:260px;'  :clearable="false " :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
                </el-form-item>
			</el-tooltip>
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary"  @click="confirm">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
</template>
<script>
	import port from './index.js'
	export default{
		mixins: [port],
		props: {
			options: {}
		},
		data(){
			return{
				pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                time: ['',''],
                rules:{
                    mobilephone:{pattern:/^[0-9]+$/,message:this.$t("filter.type2"),trigger:'blur,change'},
                    idcards:{pattern:/^[0-9]+$/,message:this.$t("filter.type2"),trigger:'blur,change'},
                }
			}
		},
		methods: {
			confirm(){
                this.options.search.startTime=/NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss'),
				this.options.search.endTime=/NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss'),
                this.$refs['searchForm'].validate(valid => {
					if (valid) {
                        this.$emit('confirm', true);
                        this.options.flag = false;
                    }
                });
			},
			// getCompany(val){
			// 	val.id == 'empty'?(this.options.search.enterpriseId=''):(this.options.search.enterpriseId=val.id);
			// }
		},
		watch: {
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
				}
			}
		}
	}
</script>
<style lang='scss'>
.vehicleMaster-search{
    .el-select,.el-input{
        width: 260px;
	}
	.tree-area >.el-input{
        width: 240px;
    }
}
</style>