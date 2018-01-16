<template>
  <div id="app">
  	<transition >
  		<router-view></router-view>
  	</transition>    
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
  body{
    font-size: 12px;
	}
</style>
