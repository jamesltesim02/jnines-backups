<template>
	<view class="book-success">
		<!-- navBar -->
		<nav-bar text='预约成功'></nav-bar>
		<image class="suc-banner" src="../../static/image/img_success_booking.png" ></image>
		<view class="suc-info">
			<text class="tit">{{userInfo.nickName}},{{$t('lang.booking.bookingSuccess')}}</text>
			<text class="time">{{appointmentTime}}</text>
			<text class="project">{{optionItemName}}</text>
		</view>
		<view class="btn-box">
			<hover-view>
				<view class="btn_green" @click="goAppoint">
					{{$t('lang.booking.checkAppoint')}}
				</view>
			</hover-view>
			<hover-view>
				<view class="btn_gray" @click="close">
					{{$t('lang.common.close')}}
				</view>
			</hover-view>		
		</view>
		<tips></tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appointmentTime: '',
				optionItemName: '',
        userInfo: {}
			}
		},
    onShow () {
      this.userInfo = uni.getStorageSync('userInfo')
    },
		onLoad(option) {
			const query = JSON.parse(decodeURIComponent(option.query))
			this.appointmentTime = query.appointmentTime
			this.optionItemName = query.optionItemName
		},
		methods: {
			goAppoint() {
				uni.navigateTo({
					url:'/pages/appointment/appointment'
				})
			},
			close() {
				uni.switchTab({
					url:'/pages/user/user'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.book-success{
	.suc-banner{
		width: 750rpx;
		height: 360rpx;
	}
	.suc-info{
		text-align: center;
		text{
			display: block;
		}
		.tit{
			font-size: 32rpx;
			line-height: 44rpx;
			color: #666666;
			margin: 30rpx 0;
		}
		.time{
			font-size: 36rpx;
			font-weight: 500;
			line-height: 80rpx;
		}
		.project{
			font-weight: 500;
			font-size: 28rpx;
		}
	}
	.btn-box{
		margin: 60rpx 60rpx 70rpx 60rpx;
		view{
			margin-bottom: 30rpx;
		}
	}
}
</style>
