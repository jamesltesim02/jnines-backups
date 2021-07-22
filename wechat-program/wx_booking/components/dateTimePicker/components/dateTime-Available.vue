<template>
	<view class="available">
		<u-popup v-model="showAvailable" mode="bottom" closeable width="100%" :height="isChange?'500':'840'" close-icon-pos="top-left">
			<view class="tit">太好了，此时段可预约</view>
			<image v-show="!isChange" class="availableBanner" src="@/static/image/img_available.png"></image>
			<view class="confirm">
				<text>请确认您的预约时间</text>
				<text>今天 19:00</text>
			</view>
			<i-footer :isBack='false'>
				<view @click="appoint">
					{{isChange?'确定更改':'立即预约'}}
				</view>
			</i-footer>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props:['isChange'],
		data() {
			return{
				showAvailable: false,
			}
		},
		methods:{
			appoint() {
				console.log('yes')
				uni.navigateTo({
					url:'/pages/book-success/book-success'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.available {
		.tit{
			font-size: 32rpx;
			font-weight: 500;
			line-height: 88rpx;
			text-align: center;
		}
		.availableBanner{
			width: 100%;
			height: 360rpx;
		}
		.confirm{
			text-align: center;
			height: 200rpx;
			line-height: 80rpx;
			margin-top: 30rpx;
			text{
				display: block;
				font-size: 36rpx;
				font-weight: 500;
				&:first-child{
					font-size: 28rpx;
					color: #666666;
				}
			}
		}
	}
</style>
