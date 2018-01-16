<template>
	<div class="modifyM">
		<el-row :gutter="20">
			<el-form label-position="top" :model="modifyData" :rules="rules" ref="options.modify">
					<el-col :span="12">
					<el-form-item :label="$t('mM.Menuname')" prop="title">
						<el-input v-model.trim="modifyData.title" size="small" :maxlength='128'></el-input>
					</el-form-item>
				</el-col>	
				<el-col :span="12">
					<el-form-item :label="$t('mM.Accessaddress')" prop="href">
						<el-input v-model.trim="modifyData.href" size="small" :maxlength='256'></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('mM.menuType')" prop="menuType">
						<el-select v-model="modifyData.menuType" placeholder="$t('select.placeholder')" style="width:100%" size="small" clearable :placeholder="$t('terminal.placeholder')">
							<el-option v-for="list in TypeOptions" :key="list.value+''" :label="list.label+''" :value="list.value+''">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-popover ref="photo" placement="top" width="400" trigger="hover">
						<photo-group @show-name="showIconName"></photo-group>
					</el-popover>
					<el-form-item :label="$t('mM.icon')" prop="icon">
						<el-input v-model="modifyData.icon" v-popover:photo size="small"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('mM.Menusorting')" prop="sort">
					 <el-input-number v-model="modifyData.sort" :min="0" :max="1000" style="width:100%" size="small"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('mM.Menudescription')" prop="remark">
						<el-input v-model.trim="modifyData.remark" size="small" :maxlength='20'></el-input>
					</el-form-item>
				</el-col>
				
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('mM.Menufunction')}}</el-checkbox>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedPowerChange">
					<el-checkbox v-for="power in menuPower" :label="power.id" :key="power.id">{{power.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form>
			<el-col :span="24" class="dialog-footer">
				<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
				<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import photoGroup from "@/components/photo-group/photo.group.vue"
export default {
	components: { photoGroup },
	props: {
		options: {}
	},
	data() {
		return {
			modifyData:{
				title : '',
				href : '',
				menuType : '',
				icon : '',
				sort : '',
				remark : ''
			},
			TypeOptions: [{
				value: '1',
				label: this.$t('mM.menuMessage')
			}, {
				value: '2',
				label: this.$t('mM.menuMotinon')
			}, {
				value: '3',
				label: 'APP'
			}, {
				value: '4',
				label: "CS"+this.$t('mM.customer')
			}],
			loading:false,
			menuPower:[],
			checkAll: true,
			checkedCities: [],
			cities: [],
			isIndeterminate: true,
			rules: {
				title: [
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
					 { min:0, max: 128, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:128}) },
				],

				href: [
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
					 { min:0, max:256, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:256}) },
				],
				menuType:[
				{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
				],
				icon:[
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' }
				],
				remark: [
          { min:0, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20}) },
					],

			}
		}
	},
	methods: {
		//菜单数据获取
		menuFtn() {
			let params = {
				id: this.options.modify.id
			}
			this.$store.dispatch('getMenuById', params).then(data => {
				for (let i = 0; i < data.data.actions.length; i++) {
					this.checkedCities.push(data.data.actions[i].id)
				}
			})

		},
		confirm(scope) {
			this.$refs['options.modify'].validate(valid => {
				if (valid) {
					let params = {
						title: this.modifyData.title,
						href: this.modifyData.href,
						sort: this.modifyData.sort,
						remark: this.modifyData.remark,
						icon: this.modifyData.icon,
						menuType: this.modifyData.menuType,
						id: this.modifyData.id,
						actionIds: this.checkedCities.join(',')
					}
					this.loading = true;
					this.$store.dispatch('updateMenu', params).then(data => {
					if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
					}else{
                this.options.flag=false;
								this.$emit('confirm');
								// this.$notify.success(this.$t('action.modifySuccess'));
								this.$message.success(this.$t('action.modifySuccess'));
								this.loading = false;
					}
					})
				}
			})
		},
		showIconName(val) {
			this.modifyData.icon = val;
		},
		//获取权限
		power() {
			this.$store.dispatch('findAllAction').then(data => {
				this.menuPower = data.data;
				this.cities=this.menuPower;	
			})
		},
		handleCheckAllChange(event) {
			let arr = [];
      this.cities.forEach((data) => {
          arr.push(parseInt(data.id));
      });
			this.checkedCities = event.target.checked ? arr : [];
       this.isIndeterminate = false;
		},
		handleCheckedPowerChange(value) {
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.cities.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
		},
	},
	mounted() {
		this.power();
		this.menuFtn();
		this.modifyData.title = this.options.modify.title;
		this.modifyData.href = this.options.modify.href;
		this.modifyData.sort = this.options.modify.sort;
		this.modifyData.remark = this.options.modify.remark;
		this.modifyData.icon = this.options.modify.icon;
		this.modifyData.menuType = (this.options.modify.menuType).toString();
		this.modifyData.id = this.options.modify.id;

	},
	watch: {
		'options.flag'(newVal) {
			if (!newVal) {
				this.options.name = ""

			}
		},
		'cities'(newVal){
			if(this.checkedCities.length==this.cities.length){
				this.isIndeterminate=false;
				this.checkAll=true;
			}
			
		},
		'checkedCities'(newVal){
			if(this.checkedCities.length==this.cities.length){
				this.isIndeterminate=false;
				this.checkAll=true;
			}
		}
		
	}
}

</script>
<style lang="scss">
.modifyM{
	.el-input-number__decrease{
	top:2px;
}
.el-input-number__increase{
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
