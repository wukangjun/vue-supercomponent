<template>
	<div 
	:style="{'line-height': size=='small'?'36px':'28px'}"
	:class="['cv-power-tool', position ? 'cv-tool-'+position:'cv-tool-right']">
		<el-button native-type="button" icon="search" :size="size" v-show="search" @click.prevent="searchEvent()" v-if="isSearch" :disabled='disabled'>{{$t('power.search')}}</el-button>
		<el-button native-type="button" icon="plus" :size="size" v-show="add" @click.prevent="addEvent()" v-if="isAdd">{{$t('power.add')}}</el-button>
		<el-button native-type="button" icon="edit" :size="size" v-show="modify" @click.prevent="modifyEvent()" v-if="isModify">{{$t('power.modify')}}</el-button>		
		<el-button native-type="button" icon="delete" :size="size" v-show="remove" @click.prevent="removeEvent()" v-if="isRemove">{{$t('power.remove')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="down" @click.prevent="exportEvent()" v-if="isExport">{{$t('power.export')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="sendDelAll" @click.prevent="sendDelAllEvent()" v-if="isSenddelall">{{$t('power.sendDelAll')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="sendUpdate" @click.prevent="sendUpdateEvent()" v-if="isSendupdate">{{$t('power.sendUpdate')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="sendAdd" @click.native="sendAddEvent()" v-if="isSendadd">{{$t('power.sendAdd')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="sendEdit" @click.native="sendEditEvent()" v-if="isSendedit">{{$t('power.sendEdit')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="send" @click.native="sendEvent()" v-if="isSend">{{$t('power.send')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="sendDown" @click.native="sendDownEvent()" v-if="isSenddown">{{$t('power.sendDown')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="upload" @click.native="uploadEvent()" v-if="isUpload">{{$t('power.upload')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="reset" @click.native="resetEvent()" v-if="isReset">{{$t('power.reset')}}</el-button>
		<el-button native-type="button" icon="upload" :size="size" v-show="imports" @click.native="importEvent()" v-if="isImport">导入</el-button>
	</div>
</template>
<script>
	export default{
		name: 'cvTool',
		props: {
			position: {
				type: String,
				default: 'right'
			},
			data: {
				default(){
					return []
				}
			},
			name: {},
			isSearch: {
				type: Boolean,
				default: true
			},
			isAdd: {
				type: Boolean,
				default: true
			},
			isRemove: {
				type: Boolean,
				default: true
			},
			isModify: {
				type: Boolean,
				default: true
			},
			isExport:{
				type: Boolean,
				default: true
			},
			isSenddelall:{
				type: Boolean,
				default: true
			},
			isSendupdate: {
				type: Boolean,
				default: true
			},
			isSendadd: {
				type: Boolean,
				default: true
			},
			isSendedit: {
				type: Boolean,
				default: true
			},
			isSend: {
				type: Boolean,
				default: true
			},
			isSenddown: {
			 	type: Boolean,
			 	default: true
			},
			isUpload:{
				type: Boolean,
				default: true
			},
			isReset:{
				type: Boolean,
				default: false
			},
			isImport:{
				type: Boolean,
				default: false
			},
			size: {
				default: 'small'
			},
			disabled:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				search: true,
				add: false,
				remove: false,
				modify: false,
				down:false,
				sendDelAll: false,
				sendUpdate: false,
				sendAdd: false,
				sendEdit: false,
				send: false,
				sendDown: false,
				upload:false,
				reset:false,
				imports:false
			}
		},
		methods: {
			isPower(data){
				data.forEach(val => {
					switch(val){
						case 'add': return this.add = true
						case 'search': return this.search = true
						case 'remove': return this.remove = true
						case 'modify': return this.modify = true
						case 'export': return this.down = true
						case 'sendDelAll': return this.sendDelAll = true
						case 'sendUpdate': return this.sendUpdate = true
						case 'sendAdd': return this.sendAdd = true
						case 'sendEdit': return this.sendEdit = true
						case 'send': return this.send = true
						case 'sendDown': return this.sendDown = true
						case 'upload': return this.upload = true
						case 'reset': return this.reset = true
						case 'import': return this.imports = true
					}
				})
			},
			addEvent(){
				this.$emit('add', {title: this.$t('power.add'), name: 'add'})
			},
			searchEvent(){
				this.$emit('search', {title: this.$t('power.search'), name: 'search'})
			},
			removeEvent(){
				this.$emit('remove', {title: this.$t('power.remove'), name: 'remove'})
			},
			modifyEvent(){
				this.$emit('modify', {title: this.$t('power.modify'), name: 'modify'})
			},
			exportEvent(){
				this.$emit('export', {title: this.$t('power.export'), name: 'export'})
			},
			importEvent(){
				this.$emit('imports', {title: '导入', name: 'import'})
			},
			sendDelAllEvent(){
				this.$emit('sendDelAll', {title: this.$t('power.sendDelAll'), name: 'sendDelAll'})
			},
			sendUpdateEvent(){
				this.$emit('sendUpdate', {title: this.$t('power.sendUpdate'), name: 'sendUpdate'})
			},
			sendAddEvent(){
				this.$emit('sendAdd');
			},
			sendEditEvent(){
				this.$emit('sendEdit');
			},
			sendEvent(){
				this.$emit('send');
			},
			sendDownEvent(){
				this.$emit('sendDown',{title: this.$t('power.sendDown'), name: 'sendDown'});
			},
			resetEvent(){
				this.$emit('reset',{title: this.$t('power.reset'), name: 'reset'});
			},
			uploadEvent(){
				this.$emit('upload');
			},
			getPowers(menus){
				let powers = {};
				menus.forEach(val => {
					if(this.$service.isArray(val.child)&&val.child.length>0){
						val.child.forEach(child => {
							if(child.child.length == 0){
								let key = this.$service.urlLastStr(child.url);
								powers[key] = child.power.split(',');
							}else{
								child.child.forEach(val => {
									let key = this.$service.urlLastStr(val.url);
									powers[key] = val.power.split(',');
								})
							}						
						})
					}
				})
				this.isPower(powers[this.name])
			},
			getMnitorPowers(menus){
				let powers = {};
				console.log(menus)
			}
		},
		mounted(){
			if(this.$service.isArray(this.data) && this.data.length > 0){
				this.getPowers(this.data);
			}		
		},
		watch: {
			'$store.getters.manageMenus'(newVal){			
				this.getPowers(newVal)			
			},
			'$store.getters.monitorMenu'(newVal){			
				this.getPowers(newVal)			
			}
		}	
	}
</script>

<style lang="scss">	
	.cv-tool-left{
		float: left
	}
	.cv-tool-right{
		float: right
	}
	.cv-power-tool{
		margin: 10px;
	}
</style>


