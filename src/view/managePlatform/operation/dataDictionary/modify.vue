<template>
	<div>
        <el-row :gutter="20">
		<el-form :model="formData" :rules="rules" ref="modify">
		  <el-col :span="12">
			<el-form-item :label="$t('dD.texttype')" prop="type">
				<el-input v-model.trim="formData.type" size="small" :maxlength='4'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="12">
            <el-form-item :label="$t('dD.typeName')" prop="typename">
				<el-input v-model.trim="formData.typename" size="small" :maxlength='32'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="12">
            <el-form-item :label="$t('dD.choess')" prop="code">
				<el-input v-model.trim="formData.code" size="small" :maxlength='6'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="12">
            <el-form-item :label="$t('dD.drivert')" prop="codeText">
				<el-input v-model.trim="formData.codeText" size="small" :maxlength='64'></el-input>
			</el-form-item>
             </el-col>
            <el-col :span="24">
            <el-form-item :label="$t('dD.bei')" prop="remark">
					<el-input
  				type="textarea"
  				:rows="3"
          resize='none' 
          :placeholder="$t('placeholder.inputValue')"
          :maxlength='64'
  				v-model.trim="formData.remark"
				size="small">
			</el-input>
			</el-form-item>
             </el-col>
		</el-form>
		</el-row>
		<div class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
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
        formData:{
                type:'',
                typename:'',
                code:'',
                codeText:'',
                remark:'',
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
                       { min:0, max: 32, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:32}) }
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
				this.$refs['modify'].validate(valid => {
					if(valid){
						let params = {
                           	type: this.formData.type,
							              typename: this.formData.typename,
                            code: this.formData.code,
                            codeText:this.formData.codeText,
                            remark:this.formData.remark,
							              id: this.options.modify.id
							         }
                        this.loading = true;
                      this.$store.dispatch('updateSysDictDataInfo', params).then(data => {
                            this.loading = false
							          if (!data.flag && !!data.errorCode){
								            // this.$notify.error({message: this.$t("error."+data.errorCode)});
                            this.$message.error({ message: this.$t("error."+data.errorCode) });
									      }else{
                            this.options.flag=false;
									          this.$emit('confirm');
									          // this.$notify.success(this.$t('action.modifySuccess'));
                             this.$message.success(this.$t('action.addSuccess'));
									        
								}
						}).catch(error=>{
              this.loading = false;
            })  
					}
				})
			}
		},
    watch:{
      'options.flag'(newVal){
          if(!newVal){
              this.options.name = '';
              this.loading = false
          }
      }
     },
    mounted(){
        this.formData.type = this.options.modify.type,
        this.formData.typename=this.options.modify.typename,
        this.formData.code=this.options.modify.code,
        this.formData.codeText=this.options.modify.codeText,
        this.formData.remark=this.options.modify.remark
    },
	}
</script>







