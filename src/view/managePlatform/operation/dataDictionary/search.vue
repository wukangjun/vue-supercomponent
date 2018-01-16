<template>
	<div>
		<el-form :model="options.search" label-position="top" ref="searchForm" :rules="rules">
		
			<el-form-item :label="$t('dD.texttype')" prop="type">
				<el-input v-model.trim="options.search.type" size="small" :maxlength='4'></el-input>
			</el-form-item>
            <el-form-item :label="$t('dD.typeName')" prop="typename">
				<el-input v-model.trim="options.search.typename" size="small" :maxlength='32'></el-input>
			</el-form-item>
         
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				 rules: {
					    type: [
                     { min:0, max: 4, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:4}) }
						        ],
                    typename: [
                      	{ min:0, max: 32, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:32}) }
                    ],    
                    
				}
			}
		},
		methods: {
			confirm(){
				this.$emit('confirm');
                this.options.flag = false;
            }
		},
		// watch: {
		// 	'options.flag'(newVal){
		// 		if(!newVal){
		// 			this.$refs['searchForm'].resetFields()
		// 		}
		// 	}
		// }
	}
</script>

<style lang="scss">
	
</style>