<template>
	<el-row class="container" :gutter="20">	
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				<el-form-item :label="$t('information.infoTypeContent')" prop="infoType">
					<el-select v-model.trim="formData.infoType" size="small"  style="width:360px;" >
					      <el-option
							v-for="item in SELECT_DATA"
							:key="item.infotype"
							:label="item.infoname"
							:value="item.infotype">
							</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('information.startSendTimeStr')" prop="startSendTimeStr">
					 <el-date-picker
					   style="width:360px;"
						v-model="formData.startSendTimeStr"
						type="datetime"
						placeholder="选择日期和时间"
						align="right"
						size="small" 
						value-format="String"
						:editable="false"
						@change="dateStartTimeChange">
						</el-date-picker>
				    </el-form-item>
				<el-form-item :label="$t('information.endSendTimeStr')" prop="endSendTimeStr">
					 <el-date-picker
					   style="width:360px;"
						v-model="formData.endSendTimeStr"
						type="datetime"
						placeholder="选择日期和时间"
						align="right"
						size="small"
						:editable="false"
						@change="dateEndTimeChange">
						</el-date-picker>
				    </el-form-item>
				</el-form-item>
				<el-form-item :label="$t('information.information')" prop="information">
					<el-input type="textarea" rows="3" v-model.trim="formData.information " size="small" ></el-input>
				</el-form-item>
			</el-form>
			</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
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
			return{
				SELECT_DATA:[],
				formData:{
					infoType : '',
					startSendTimeStr : '',
					endSendTimeStr:'',
					startSendTime: '',
					endSendTime:'',
					information:''
				},
				loading:false,
				rules: {
					infoType : [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
					],
					information : [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ min:1, max: 500, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:500}) }
					],
					startSendTimeStr : [
						{ type: 'date', required: true, message: this.$t('filter.noempty'), trigger: 'change' }
					],
					endSendTimeStr : [
						{ type: 'date',required: true, message: this.$t('filter.noempty'), trigger: 'change' }
					],
				}
			}
		},
		methods: {
		    dateStartTimeChange(){
				this.formData.startSendTime=this.formData.startSendTimeStr==null?"":this.$filter.format(this.formData.startSendTimeStr,"yyyy-MM-dd HH:mm:ss");
			},
			dateEndTimeChange(){
				this.formData.endSendTime=this.formData.endSendTimeStr==null?"":this.$filter.format(this.formData.endSendTimeStr,"yyyy-MM-dd HH:mm:ss");
			},
		   confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
							infoType :this.formData.infoType ,
							startSendTimeStr :this.formData.startSendTime, 
							endSendTimeStr :this.formData.endSendTime, 
							information :this.formData.information
						};
						console.log(params);

						if(!this.$filter.CompareDate(params.startSendTimeStr,params.endSendTimeStr)){
							this.$message.error({ message: this.$t("information.timeInvalidAlert") });
							return ;
						}
						this.loading = true;
						this.$store.dispatch('insertInformation', params).then(data => {
							this.loading = false
							if (!data.flag && !!data.errorCode){
								// this.$notify.error({message: this.$t("error."+data.errorCode)});
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.$emit('confirm')
								// this.$notify.success(this.$t('action.addSuccess'));
								this.$message.success(this.$t('action.addSuccess'));
								this.options.flag = false;
							}
						}).catch(error=>{
							this.loading = false;
						})	
					}else{
							return false
					}
				})
			},
			loadSelectData(){
				this.$store.dispatch('getAllInformationTypeList').then(data =>{
					if(data.flag && data.data.length!=0){
						this.SELECT_DATA=data.data;
						for(var i=0;i<this.SELECT_DATA.length;i++){
                            this.SELECT_DATA[i].infotype+="";
                        }
					}else{
						this.SELECT_DATA =[];
					}
				});
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['addForm'].resetFields()
				}
			}
		},
		mounted(){
			this.loadSelectData();
		}
	}
</script>
<style lang="scss" scoped>

</style>
