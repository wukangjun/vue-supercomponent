<template>
	<div>
        <el-row :gutter="20">
		<el-form :model="options.modify" :rules="rules" ref="modify">
		  <el-col :span="12">
          <el-form-item :label="$t('pM.permissionName')" prop="name">
            <el-input v-model.trim="formData.name" :maxlength='20'></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item :label="$t('pM.permissionCode')" prop="code">
            <el-input v-model.trim="formData.code" :maxlength='10'></el-input>
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
               name: "",
               code: ""
            },
				loading:false,
				rules: {
          name: [
          {required: true, message: this.$t('filter.noempty'), trigger: 'blur,change'},
          { min:0, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20}) },
          ],
          code:[
          {required: true, message: this.$t('filter.noempty'), trigger: 'blur,change'},
          { min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:10}) },
          ]
        },
      
			}
		},
		methods: {
			confirm(){
				this.$refs['modify'].validate(valid => {
					if(valid){
						let params = {
                           	name: this.formData.name,
							              code: this.formData.code,
                            id:this.formData.id
							         }
                        this.loading = true;
                      this.$store.dispatch('updateActionById', params).then(data => {
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
        this.formData.name = this.options.modify.name;
        this.formData.code = this.options.modify.code;
        this.formData.id = this.options.modify.id;
    },
	}
</script>







