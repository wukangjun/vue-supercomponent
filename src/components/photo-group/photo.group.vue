<template>
	<div class="cv-photo-group">
		<el-scrollbar 
			class="slider-area"
			tag="ul"
	      	wrap-class="el-select-dropdown__wrap"
	      	view-class="el-select-dropdown__list">
			<li ref="photoGroup">
				<div class="photo-item" v-for="p in photo" :key="p" :name="p">
					<cv-icon :name="p" size="24"></cv-icon>
				</div>
			</li>
		</el-scrollbar>
	</div>
</template>

<script>
	import photo from './index.js'
	import {myJq, service} from '@/utils'
	export default{
		data(){
			return{
				photo: photo
			}
		},
		mounted(){
			myJq.on(this.$refs['photoGroup'], 'click', (e) => {
				let theEvent = window.event || e, target = theEvent.target || theEvent.srcElement;
				while(target){
					if(typeof target.className === 'string'){
						if(target.className === 'photo-item'){
							let attr = myJq.attr(target, 'name');
							this.$emit('show-name', attr);
							return myJq.hide(this.$parent.$refs.popper)
						}else{
							target = target.parentNode;
						}					
					}else{
						target = target.parentNode;
					}
				}
				
			})
		}
	}
</script>

<style lang="scss">
	$phsize: 36px;
	.cv-photo-group{
		.photo-item{
			width: $phsize;
			height: $phsize;
			line-height: 52px;
			float: left;
			margin: 5px;
			text-align: center;			
			&:hover{
				box-shadow: 0px 0px 2px #8391a5;
				cursor: pointer;
			}
		}
	}
</style>