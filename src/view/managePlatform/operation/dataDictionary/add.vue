<template>
	<div>
        <el-row :gutter="20">
		<el-form label-position="top" :model="form" :rules="rules" ref="addForm">
			
            <el-col :span="12">
			<el-form-item :label="$t('dD.texttype')" prop="type">
				<el-input v-model.trim="form.type" size="small" :maxlength='4'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="12">
            <el-form-item :label="$t('dD.typeName')" prop="typename">
				<el-input v-model.trim="form.typename" size="small" :maxlength='32'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="12">
            <el-form-item :label="$t('dD.choess')" prop="code">
				<el-input v-model.trim="form.code" size="small" :maxlength='6'></el-input>
			</el-form-item>
             </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('dD.drivert')" prop="codeText">
				<el-input v-model.trim="form.codeText" size="small" :maxlength='64'></el-input>
			</el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item :label="$t('dD.bei')" prop="remark">
				<el-input
  				type="textarea"
  				:rows="3"
          resize='none'
  				v-model.trim="form.remark"
          :placeholder="$t('placeholder.inputValue')"
          :maxlength='64'
				size="small">
			</el-input>
			</el-form-item>
    </el-col>
		</el-form>
		
         </el-row>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading='loading' type="primary" @click="confirm">{{$t('action.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
       
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
                form: {
                        type: "",
						typename: "",
						code:"",
						codeText:"",
						remark:""
                },
                loading:false,
                rules: {
					         type: [
						        {required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change'},
                    { min:0, max: 4, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:4}) }
						        ],
                    typename: [
						         {required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change'},
						          {pattern:/^[\u4e00-\u9fa5_a-zA-Z]+$/,message:this.$t('filter.type5')},
                       { min:0, max:32, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:32}) }
                    ],
                    code: [
						          {required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change'},
						          { pattern: /^[0-9]*$/, message: this.$t('filter.type2') },
                        { min:0, max: 6, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:6}) }
                    ],
                    codeText:[
                      { min:0, max: 64, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:64}) }
                    ],
                    remark:[
                      { min:0, max: 64, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:64}) }
                    ]
                    
				}
			
			
			}
		},
		methods: {
			confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
                            type: this.form.type,
                            typename: this.form.typename,
                            code: this.form.code,
                            codeText: this.form.codeText,
                            remark: this.form.remark
						};
                      
                       	this.loading = true;
						this.$store.dispatch('insertDictDataInfo', params).then(data => {
              this.loading = false;
							if (!data.flag && !!data.errorCode){
								  // this.$notify.error({message: this.$t("error."+data.errorCode)});
                  this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
                  this.options.flag=false;
									this.$emit('confirm');
									// this.$notify.success(this.$t('action.addSuccess'));
                  this.$message.success(this.$t('action.addSuccess'));
									
							}
						}).catch(error=>{
              this.loading = false;
            })  
						
					}else{
						return false
					}
					
				})
			}
		
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['addForm'].resetFields()
				}
			}
		}
	}
</script>

<style lang="scss">
	.dialog-footer{
    margin:20px 0 40px 0;
  }
</style>