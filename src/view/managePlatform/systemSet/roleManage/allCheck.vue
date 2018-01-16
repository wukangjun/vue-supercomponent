<template>
	<div class="cv-allCheck">
		<el-checkbox  class="allCheck" v-model="checkAll" @change="handleCheckAll" :label="data.crumbs" :name="data.crumbs" :indeterminate="isIndeterminate" :disabled="checkDisabled">{{data.crumbs}}</el-checkbox>
		<el-checkbox-group v-model="checked" @change="handleChecked" class="checkGroup" :disabled="checkDisabled">
			<el-checkbox v-for="action in data.actions" :label="action.id" :key="action.id" :disabled="checkDisabled">{{action.name}}</el-checkbox>
		</el-checkbox-group>
	</div>
</template>

<script>
export default {
	props: {
		data: {},
		allChecked: {},
		checkDisabled: false
	},
	data() {
		return {
			checked: [],
			checkAll: false,
			isIndeterminate: false
		}
	},
	methods: {
		handleCheckAll(event) {
			let arr = [];
			this.data.actions.forEach((data) => {
				arr.push(parseInt(data.id));
			});
			this.checked = event.target.checked ? arr : [];
			this.isIndeterminate = false;
			this.$emit('checked', { id: this.data.menuId, checked: this.checked, moduleId: this.data.moduleId });
		},
		handleChecked(value) {
			this.$emit('checked', { id: this.data.menuId, checked: this.checked, moduleId: this.data.moduleId })
			let length = value.length;
			this.checkAll = length === this.data.actions.length;
			this.isIndeterminate = length > 0 && length < this.data.actions.length;
		}
	},
	mounted() {
		this.checked=[];
		let data = this.data;
			if (data) {
				if (data.actionIds != "") {
					this.checked=this.$service.numArr(data.actionIds);
					(this.checked.length === data.actions.length)?(this.checkAll = true):((this.checked.length == 0)?(this.checkAll = false):(this.isIndeterminate = true));
					this.$emit('checked', { id: this.data.menuId, checked: this.checked, moduleId: this.data.moduleId });
				}else{
					this.checked=[];
					this.checkAll = false;
				}

			}

	}, watch: {
		data(val) {
			let data = val;
			if (data) {
				if (data.actionIds != "") {
					this.checked=this.$service.numArr(data.actionIds);
					if(this.checked.length == val.actions.length){
						this.isIndeterminate = false;
						this.checkAll = true
					}
					if(this.checked.length != val.actions.length){
						if(this.checked.length == 0){
							this.isIndeterminate = false;
							this.checkAll = false
						}else{
							this.checkAll = false;
							this.isIndeterminate = true;
						}
					}
					this.$emit('checked', { id: this.data.menuId, checked: this.checked, moduleId: this.data.moduleId });
				}else{
					this.checked=[];
					this.isIndeterminate = false;
					this.checkAll = false;
				}
			}
		}
	}
}
</script>

<style lang="scss">
.cv-allCheck {
	.allCheck {
		clear: left;
		padding-right: 10px
	}
	.allCheck,
	.checkGroup {
		float: left
	}
}
</style>