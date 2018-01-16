<template>
	<div class="vehicleMaster-add" v-loading="loading">
		<el-form :inline='true'  label-position='top' :model='add' label-width="100px" :rules='rules' ref='addForm'>
			<el-form-item :label="$t('terminal.company1')" prop="enterpriseName">
				<cv-dropdown-tree 
				style="width:260px"
				:placeholder="$t('common.enterprise.affiliated')"
				:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
				:is-default="false"
				v-model='add.enterpriseName'
				@label="getCompany"></cv-dropdown-tree>
			</el-form-item>
            <el-form-item label="账号:" prop='account'>
				<el-input v-model.trim="add.account" size='small' :maxlength='15' >
				</el-input>
			</el-form-item>
            <el-form-item label="姓名:" prop='username'>
				<el-input v-model.trim="add.username" size='small' :maxlength='10' >
				</el-input>
			</el-form-item>
			<el-form-item label="身份证号:" prop='idcards'>
				<el-input v-model.trim="add.idcards" size='small' :maxlength='18' >
				</el-input>
			</el-form-item>
            <el-form-item label="生日:" prop="birthday">
                <el-date-picker v-model="add.birthday" :picker-options='pickerOptions0' size='small'  :clearable="false " :editable="false" type="date" prop='time'></el-date-picker>
            </el-form-item>
			<el-form-item label="住址:" prop='address'>
				<el-input v-model.trim="add.address" size='small' :maxlength='30' >
				</el-input>
			</el-form-item>
            <el-form-item label="性别:">
				<el-select v-model="add.sexy" placeholder="请选择" clearable filterable>
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="昵称:">
				<el-input v-model.trim="add.shortname" size='small' :maxlength='10' >
				</el-input>
			</el-form-item>	
            <el-form-item label="手机号:" prop='mobilephone'>
				<el-input v-model.trim="add.mobilephone" size='small' :maxlength='11' >
				</el-input>
			</el-form-item>	
            <el-form-item label="电话:" prop='phone'>
				<el-input v-model.trim="add.phone" size='small' :maxlength='11' >
				</el-input>
			</el-form-item>	
            <el-form-item label="邮箱:" prop='email'>
				<el-input v-model.trim="add.email" size='small' :maxlength='18' >
				</el-input>
			</el-form-item>	
            <el-form-item label="传真:" prop='fox'>
				<el-input v-model.trim="add.fox" size='small'  >
				</el-input>
			</el-form-item>	
            <el-form-item label="用户描速:">
				<el-input v-model.trim="add.remark" size='small' :maxlength='30' type='textarea' >
				</el-input>
			</el-form-item>	
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary"  @click="confirm" v-loading="btnLoading">{{ $t('action.confirm') }}</el-button>
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
                loading:false,
                btnLoading:false,
                account:'',
                add:{
                    account:'',
                    username:'',
                    idcards:'',
                    enterpriseName:'',
                    enterpriseId:'',
                    remark:'',
                    mobilephone:'',
                    phone:'',
                    birthday:'',
                    address:'',
                    shortname:"",
                    sexy:"",
                    email:"",
                    fox:''
                },
                rules:{
                    enterpriseName:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
                    account:[ 
                        {required: true,message: this.$t("filter.notEmpty"),trigger: "blur,change"},
                        { validator: this.verificationAccount, trigger: "blur" },
                        {pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,message: this.$t("filter.type4")}
                    ],
                    username:[ 
                        {required: true,message: this.$t("filter.notEmpty"),trigger: "blur,change"},
                        {pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,message: this.$t("filter.type4")}
                    ],
                    idcards:[
                        {required: true,message: this.$t("filter.notEmpty"),trigger: "blur,change"},
                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message: this.$t("filter.type11")}
                    ],
                    mobilephone:{ pattern:/^1[34578]\d{9}$/, message:this.$t("filter.type6"),trigger: 'blur,change' },
                    email:{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
                    fox:{ pattern:/^(\d{3,4}-)?\d{7,8}$/, message:'请输入正确的传真',trigger: 'blur,change' },
                    phone:{ pattern:/^(\d{3,4}-)?\d{7,8}$/, message:'请输入正确的电话',trigger: 'blur,change' }
                }
			}
		},
		methods: {
            //校验登陆用户是否存在
            verificationAccount(rules, value, callback) {
                if (!this.$service.isContext(value)) {
                    if (value != this.account) {
                        this.checkEntUser({ account: value }).then(data => {
                            if (!data.flag) {
                                callback(new Error(this.$t("error.4000")));
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }
            },
            confirm(){
                let _self=this;
                _self.$refs['addForm'].validate(valid => {
					if (valid) {
                        _self.btnLoading = true;
                        if(!(typeof(_self.add.birthday) == 'string')){
                            _self.add.birthday=_self.$filter.format(_self.add.birthday,'yyyy-MM-dd');
                        }
                        let _par=_self.getData();
                        _self.addVehicleMaster(_par).then(data => {
                            if (data.flag) {
                                _self.options.id ?(_self.$message.success(_self.$t('action.modifySuccess'))):(_self.$message.success(_self.$t('action.addSuccess')));
                                _self.options.flag = false;
                                _self.$emit('confirm');
                            } else {
                                _self.$message.error(_self.$t('error.'+data.errorCode));
                            }
                            _self.btnLoading = false;
                        }).catch(_ => {
                            _self.btnLoading = false;
                        });
                    }
                });
            },
            getData(){
                let par={
                    account:this.add.account,
                    username:this.add.username,
                    idcards:this.add.idcards,
                    enterpriseName:this.add.enterpriseName,
                    enterpriseId:this.add.enterpriseId,
                    remark:this.add.remark,
                    mobilephone:this.add.mobilephone,
                    phone:this.add.phone,
                    birthday:this.add.birthday,
                    address:this.add.address,
                    shortname:this.add.shortname,
                    sexy:this.add.sexy,
                    email:this.add.email,
                    fox:this.add.fox
                };
                this.options.id ? (par.id=this.options.id) :(par.id="");
                return par;
            },
			getCompany(val){
				val.id == 'empty'?(this.add.enterpriseId=''):(this.add.enterpriseId=val.id);
			}
        },
		watch: {
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
				}
			}
        },
        mounted(){
			if(this.options.id){
                this.loading=true;
                this.updataInit({id:this.options.id}).then(data=>{
                    if (data.flag) {
                        this.add=data.data;
                        this.account=data.data.account;
                    } else {
                        this.$message.error(this.$t('error.'+data.errorCode));
                    }
                    this.loading = false;
                }).catch(_ => {
                    this.loading = false;
                });
            }
		}
	}
</script>
<style lang='scss'>
.vehicleMaster-add{
    .el-select,.el-input,.el-textarea{
        width: 260px;
    }
    .tree-area >.el-input{
        width: 240px;
    }
}
</style>