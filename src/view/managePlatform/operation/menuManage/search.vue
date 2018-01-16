<template>
	<el-row>
		
		<el-form :model="options.search" label-position="top" ref="searchForm" :rules="rules">
			
			
			<el-form-item :label="$t('mM.Menuname')" prop="title">
				<el-input v-model.trim="options.search.title" size="small" :maxlength='128' ></el-input>
			</el-form-item>
		
			
      <el-form-item :label="$t('mM.menuType')" prop="menuType">
				<el-select v-model="options.search.id" size="small" clearable :placeholder="$t('terminal.placeholder')" clearable style="width:360px;">
						<el-option
							v-for="item in options.search.menuType"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
			</el-form-item>
     
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	
</el-row>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				 rules: {
					title: [
           { min:0, max:128, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:128}) },
					]
				}
			}
		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			 },
			menuFun(){
				let params={}
				this.$store.dispatch('menuStuats', params).then(data =>{
				this.options.search.menuType=data.data;

				})
			}
		
		},
		 mounted(){
		 	this.menuFun();
		 },

		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.options.name=""
					
				}
			}
		}
	}
</script>

<style lang="scss">	
</style>