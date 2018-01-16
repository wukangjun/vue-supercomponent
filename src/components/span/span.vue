<template>
	<span class="cv-span" :class="[type ? 'cv-span-' + type : '']" ref="span"><slot></slot></span>
</template>

<script>
	export default{
		name: 'cvSpan',
		componentName: 'cvSpan',
		props: {
			type: {
				type: String,
				default: 'default'
			}
		}
	}
</script>

<style lang="scss">
	.cv-span{
		font-size: 12px;
		color: #1f2d3d;
		cursor: pointer;
	}
	.cv-span-primary{
		color: #20a0ff;
		&:active{
			color: #0689ea;
		}
	}
	.cv-span-success{
		color: #13ce66
	}
	.cv-span-warning{
		color: #f7ba2a
	}
	.cv-span-danger{
		color: #ff4949
	}
	.cv-span-info{
		color: #50bfff
	}
</style>