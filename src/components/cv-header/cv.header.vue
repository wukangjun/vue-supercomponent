<template>
	<el-form class="cv-header" :inline="true">
		<cv-icon 
		:name="dropdownFlag ?'shanglajiantou-copy':'xialajiantou'" 
		class="cv-header-dropdown" 
		@click.native="dropdown" 
		v-show="flag">
		</cv-icon>
		<slot></slot>
		<transition name="el-zoom-in-top">
			<el-form 
			class="cv-header-bottom" 
			:inline="true" 
			v-show="dropdownFlag" 
			v-clickoutside="outHide"
			ref="bottomContent">
				<slot name="bottom"></slot>
			</el-form>
		</transition>
	</el-form>
</template>

<script>
	export default{
		name: 'cvHeader',
		data(){
			return {
				dropdownFlag: false,
				flag: false
			}
		},
		methods: {
			dropdown(){
				if(!this.dropdownFlag){
					this.dropdownFlag =true;
				}else{
					this.dropdownFlag = false;
				}
				
			},
			outHide(){
				
			}
		},
		mounted(){
			let bottomContent = this.$refs['bottomContent'];
			if(bottomContent.$children && bottomContent.$children.length > 0){		
				this.flag = true;
			}
		}
	}
</script>

<style lang="scss">
	.cv-header{
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  background-color:#fbf9f7;
	  padding: 6px 10px 6px 40px;
	  border-bottom: 1px solid #eef1f6;
	  .el-form-item{
	    margin-bottom: 0;
	  }
	  .cv-header-dropdown{
	  	position: absolute;
	  	top: 15px;
	  	left: 5px;
	  }
	  .cv-header-bottom{
	  	border: 1px solid #ccc;
	  	position: absolute;
	  	top: 100%;
	  	left: 0;
	  	right: 0;
	  	z-index: 1999;
	  	padding: 0 40px;
	  	&:before{
	  		content: "";
	  		min-height: 100px;
			box-shadow: 0px 2px 2px #ccc;
	  		position: absolute;
	  		top: 0;
	  		left: 0;
	  		right: 0;
			background: #fff;
			opacity: 0.8;
			filter: alpha(opacity=80);
			z-index: -1;
	  	}
	  	.el-form-item{
	  		margin: 5px 5px 5px 0;
	  	}
	  }
	}
</style>

