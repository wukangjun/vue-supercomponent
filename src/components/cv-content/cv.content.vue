<template>
	<cv-scrollbar 
	:style="{left: fill&&'10px'}"
	tag="ul"
  	wrap-class="heightStyle"
	:class="['cv-content', $store.getters.isToggleTree?'isToggleContent':'']">
		<slot></slot>
	</cv-scrollbar>
</template>

<script>
	export default{
		name: 'cvContent',
		props: {
			fill: {
				default: false
			}
		}
	}
</script>

<style lang="scss">
	.cv-content{
		position: absolute !important;
		overflow: auto;
		top: 60px;
		right: 10px;
		left: 325px;
		bottom: 10px;
		background-color:rgba(255, 255, 255, 0.98);
		transition: all .2s ease-in-out;
		.heightStyle{
			width: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
		}
	}
	.isToggleContent{
		left: 25px;
		transition: all .2s ease-in-out;
	}
</style>