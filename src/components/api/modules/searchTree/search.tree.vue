<template>
	<div class='searchTrees'>
		<h1>搜索树</h1>
        <search-tree
			style="position:absolute;width:240px;bottom:0;top:45px;"
			:interface="$COMMON.baseUrl+'/fleet/findFleetInfoList'"
			:enterprise-id="111111111"
			:is-default="true"
			:is-edit="true">
        </search-tree>
	</div>
</template>

<script>
     import searchTree from '../../../search-tree/search.tree.vue'
    export default{
        components: {searchTree},
        props: {
            options: {}
        },
	}
</script>