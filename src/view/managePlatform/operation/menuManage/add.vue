<template>
    <div class="main">
      <el-row :gutter="20">
		<el-form label-position="top" :model="form" :rules="rules" ref="add">
           <!-- 菜单名称			 -->
            <el-col :span="12">
			         <el-form-item :label="$t('mM.Menuname')" prop="title">
				        <el-input v-model.trim="form.title" size="small" :maxlength='128'></el-input>
			         </el-form-item>
            </el-col>
            <!-- 访问地址 -->
             <el-col :span="12">
              <el-form-item :label="$t('mM.Accessaddress')" prop="href">
                <el-input v-model.trim="form.href" size="small" :maxlength='256'></el-input>
              </el-form-item>
             </el-col>
             <!-- 类型 -->
          <el-col :span="12">
            <el-form-item :label="$t('mM.menuType')" prop="id">
            <el-select v-model="form.id" size="small" style="width:100%">
                  <el-option
                    v-for="item in form.menuType"
                    :key='item.id+""'
                    :label="item.name"
                    :value='item.id+""'>
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <!-- 图标 -->
           <el-col :span="12">
                <el-popover ref="photo" placement="top" width="400" trigger="hover">
                  <photo-group @show-name="showIconName"></photo-group>
                </el-popover>
                <el-form-item :label="$t('mM.icon')" prop="icon">
                  <el-input v-model="form.icon" v-popover:photo size="small"></el-input>
                </el-form-item>
             </el-col>
             <!-- 菜单排序 -->
          <el-col :span="12">
            <el-form-item :label="$t('mM.Menusorting')" prop="sort">
				        <el-input-number v-model="form.sort" :min="0" :max="1000" size="small" style="width:100%"></el-input-number>
			      </el-form-item>
          </el-col>
            <!-- 菜单描述 -->
         <el-col :span="12">
           <el-form-item :label="$t('mM.Menudescription')" prop="remark">
             <el-input v-model.trim="form.remark" size="small" :maxlength='20'></el-input>
           </el-form-item>
         </el-col>
         <!-- 菜单权限 -->
		<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('mM.Menufunction')}}</el-checkbox>
  			<el-checkbox-group v-model="checkedCities" @change="handleCheckedPowerChange">
    		<el-checkbox v-for="power in cities" :label="power.id" :key="power.name">{{power.name}}</el-checkbox>
  		</el-checkbox-group>
			   
			</el-form>
            <el-col :span="24" class="dialog-footer">
                <el-button :loading="loading"type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
                <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
            </el-col>
         </el-row>
    </div>
</template>
<script>
import photoGroup from "@/components/photo-group/photo.group.vue"
import {COMMON} from '@/utils'
export default{
	 components:{photoGroup},
		props: {
			options: {}
		},
		data(){
			return{
				checkAll:true,
        checkedCities: [],
        cities:[],
        isIndeterminate: true,
				form: {
					title: "",
					sort: "",
					href: "",
					icon: "",
					remark: "",
					menuType: "",
					menuPower:'',
					id:'',
					postPower:'',
					icon:''
				},
       			
				loading:false,
                rules: {
					title: [
						{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
            { min:0, max: 128, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:128}) },
					],
         icon: [
         { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
         ],
					href: [
						{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
            { min:0, max:256, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:256}) },
					],
					remark: [
            { min:0, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20}) },
					],
					id:[
						{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' }
					]
				
                    
				}
			}
		},
		methods: {
			 showIconName(val){
            		this.form.icon=val;
        	},
			confirm() {
				this.$refs['add'].validate(valid => {
					if (valid) {
						let params = {
							title: this.form.title,
							sort: this.form.sort,
							icon: this.form.icon,
							href: this.form.href,
							remark: this.form.remark,
							menuType: this.form.id,
							actionIds:this.checkedCities.join(',')
						};
						this.loading = true;
						this.$store.dispatch('insertMenuInfo', params).then(data => {
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
					} else {
						return false
					}
				})
			},
			//获取菜单类型
			menuFun(){
				let params={}
				this.$store.dispatch('menuStuats', params).then(data =>{
				this.form.menuType=data.data;
				})
			},
			//获取权限
			powerAdd(){
				let params={}
				this.$store.dispatch('findAllAction',params).then(data =>{
				this.form.menuPower=data.data;
				this.cities=this.form.menuPower;	
				})
			},
			//点击权限全选
			handleCheckAllChange(event){
        let arr = [];
        this.cities.forEach((data) => {
          arr.push(parseInt(data.id));
        });
				this.checkedCities = event.target.checked ? arr : [];
        this.isIndeterminate = false;
      
      },
     	handleCheckedPowerChange(value){
        		let checkedCount = value.length;
				    this.checkAll = checkedCount === this.cities.length;
				    this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      	}
			
		

		},
		mounted(){
			 this.menuFun();
			 this.powerAdd()
		 	},
		watch: {
			'options.flag'(newVal) {
        !newVal?
        (this.$refs['add'].resetFields(),this.loading = false) : null;
			}
		}
	}
</script>
<style lang="scss">

.main {
	.right {
		.submit {
			padding: 10px;
			.box {
				margin-right: 10px
			}
			.el-col {
				margin: 20px 20px;
				.input {
					margin: 10px 0;
				}
			}
		}
	}
	.el-input-number__decrease, .el-input-number__increase{
  top:2px;
}
.el-checkbox{
  margin:0 20px 10px 0;
}
.el-checkbox-group{
  padding:0 10px;
}
}

</style>