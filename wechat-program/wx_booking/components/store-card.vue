<template>
	<view :class="['store_card',!isOpen && 'unopen']">
		<image class="white" src="@/static/image/breeze.svg"></image>
		<view class="info">
			<text>{{title}}</text>
			<text>{{address}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type: String,
				default: ''
			},
			address: {
				type: String,
				default: ''
			},
			isOpen: {
				type: [Boolean,String,Number],
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.store_card {
		position: relative;
		margin-bottom: 30rpx;
		width: 630rpx;
		height: 220rpx;
		border-radius: 12rpx;
		background-image: linear-gradient(90deg, #6666FF 0%, #66FFCC 100%);
		box-sizing: border-box;
		overflow: hidden;
		image {
			width: 150rpx;
			height: 112rpx;
			position: absolute;
			right: -40rpx;
			top: 54rpx;
			-webkit-filter: brightness(130%);
			filter: brightness(130%);
			opacity: .5;
		}
	
		&.unopen {
			background-image: none;
			border: 3rpx dashed #DDDDDD;
	
			.info {
				color: #666666;
			}
	
			image {
				filter: none;
			}
		}
	
		.info {
			color: #FFFFFF;
			margin: 60rpx 0 0 30rpx;
	
			text {
				display: block;
				font-size: 36rpx;
				font-weight: 500;
				line-height: 25px;
			}
	
			text:nth-child(2) {
				font-size: 28rpx;
				font-weight: 400;
			}
		}
	}
</style>
