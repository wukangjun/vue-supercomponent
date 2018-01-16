<template>
    <el-row class="container">
        <el-col :span="24">
            <el-popover ref="photo" placement="top" width="400" trigger="hover">
                <photo-group @show-name="showIconName"></photo-group>
            </el-popover>
            <el-form :model="moduleForm" :rules="rules" ref="moduleForm" label-width="80px">
                <el-form-item prop="name" :label="$t('companyManage.n')">
                    <el-input v-model="moduleForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="icon" :label="$t('companyManage.icon')">
                    <el-input v-model="moduleForm.icon" v-popover:photo ></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="dialog-footer" style="padding-top:20px;">
            <el-button @click="submitForm('moduleForm')" type="primary">{{$t('action.save')}}</el-button>
            <el-button @click="resetForm('moduleForm')">{{$t('action.cancel')}}</el-button>
        </el-col>
    </el-row>
</template>
<script>
import photoGroup from "@/components/photo-group/photo.group.vue"
export default {
    components:{photoGroup},
    props: {
        options: {}
    },
    data() {
        return {
            moduleForm: {
                name: '',
                icon: ''
            },
            rules: {
                name: [
                    { required: true, message: this.$t('companyManage.fk'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$t('companyManage.length')}
                ],
                icon:[
                    { required: true, message: this.$t('companyManage.fk'), trigger: 'blur,change' }
                ]
            }
        };
    }, methods: {
        showIconName(val){
            this.moduleForm.icon=val;
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // console.log(this.options)
                    let n = ++this.options.num
                    if(this.options.action.data.type == 2 && this.options.action.data.isModify){
                      this.options.action.data.text = this.moduleForm.name
                      this.options.action.data.icon = this.moduleForm.icon
                      this.options.flag = false
                    }else{
                    // debugger
                    this.options.action.data.children.push({id:n,text:this.moduleForm.name,icon:this.moduleForm.icon,type:2,children: []});
                    this.options.flag = false;
                    this.$refs[formName].resetFields();
                    }
                } else {
                    return false;
                    
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.options.flag = false;
        }
    },
    watch:{
        'options.flag'(newVal){
			if(!newVal){
				this.options.name='';
			}
		}
    },
    mounted(){
        // console.log(this.options)
        if(this.options.action.data.type != 1 && this.options.action.data.isModify){
            this.moduleForm.name = this.options.action.data.text;
            this.moduleForm.icon = this.options.action.data.icon;
        }
        // if(this.options.isModify)
        // console.log(this.options)
        // console.log(this.moduleForm)
        // this.moduleForm.name = this.options.action.data.text;
        // this.moduleForm.icon = this.options.action.data.icon;
    }
}
</script>
<style lang="sass">

</style>
