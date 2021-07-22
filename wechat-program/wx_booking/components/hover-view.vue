<template>
	<view hover-class="_hover" hover-stay-time="50">
		<slot></slot>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	._hover{
		opacity: .9;
		transform: scale(0.95,0.95);
		box-shadow: 0px 0px 5px rgba(0,0,0,.1) inset;
	}
</style>
