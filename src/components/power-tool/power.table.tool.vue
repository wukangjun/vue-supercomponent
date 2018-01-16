<template>
	<div class="cv-table-tool">
		<cv-span type="success" v-show="modify" @click.native="modifyEvent()" v-if="isModify">{{$t('power.modify')}}</cv-span>
		<cv-span type="danger" v-show="remove" @click.native="removeEvent()" v-if="isRemove">{{$t('power.remove')}}</cv-span>
		<cv-span type="warning" v-show="resend" @click.native="resendEvent()" v-if="isResend">{{$t('power.resend')}}</cv-span>
		<cv-span type="success" v-show="sendAdd" @click.native="sendAddEvent()" v-if="isSendadd">{{$t('power.sendAdd')}}</cv-span>
		<cv-span type="success" v-show="sendEdit" @click.native="sendEditEvent()" v-if="isSendedit">{{$t('power.sendEdit')}}</cv-span>
		<cv-span type="success" v-show="sendDown" @click.native="sendDownEvent()" v-if="isSenddown">{{$t('power.sendDown')}}</cv-span>
	</div>
</template>

<script>
	import cvSpan from '../span/span.vue'
	export default{
		name: 'cvTableTool',
		components: {cvSpan},
		props: {
			isModify: {
				type: Boolean,
				default: true
			},
			isRemove: {
				type: Boolean,
				default: true
			},
			isResend:{
				type:Boolean,
				default:false
			},
			isSendadd: {
				type: Boolean,
				default: true
			},
			isSendedit: {
				type: Boolean,
				default: true
			},
			isSenddown: {
				type: Boolean,
				default: true
			},
			data: {
				default(){
					return []
				}
			},
			name: {},
			size: {
				default: 'small'
			}
		},
		data(){
			return{
				modify: false,
				remove: false,
				resend:false,
				sendAdd: false,
				sendEdit: false,
				sendDown: false
			}
		},
		methods: {
			isPower(data){
				data && data.forEach(val => {
					switch(val){
						case 'modify': return this.modify = true
						case 'remove': return this.remove = true
						case 'resend':return this.resend = true
						case 'sendAdd': return this.sendAdd = false
						case 'sendEdit': return this.sendEdit = false
						case 'sendDown': return this.sendDown = true
					}
				})
			},
			modifyEvent(){
				this.$emit('modify');
			},
			removeEvent(){
				this.$emit('remove');
			},
			resendEvent(){
				this.$emit('resend');
			},
			sendAddEvent(){
				this.$emit('sendAdd');
			},
			sendEditEvent(){
				this.$emit('sendEdit');
			},
			sendDownEvent(){
				this.$emit('sendDown');
			},
			getPowers(menus){
				let powers = {};
				menus.forEach(val => {
					// if(this.$service.isArray(val.child)){
					// 	val.child.forEach(child => {
					// 		let key = this.$service.urlLastStr(child.url);
					// 		powers[key] = child.power.split(',');
					// 	})
					// }
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
				powers[this.name] ? this.isPower(powers[this.name]) : null;				
			}
		},
		mounted(){
			if(this.$service.isArray(this.data) && this.data.length > 0){
				this.getPowers(this.data)	
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
	.cv-table-tool{
		display: inline;
	}
</style>


