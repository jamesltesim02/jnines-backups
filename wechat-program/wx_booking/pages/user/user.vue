<template>
	<view class="user">
		<u-navbar :is-back="false" :border-bottom="false"></u-navbar>
		<!-- 用户信息 -->
		<view class="user_info level2">
			<view class="name">
				{{userInfo.nickName}}
			</view>
			<view class="info">
				<text></text>
				<text>{{levelName}}</text>
			</view>
			<image src="@/static/image/breeze.svg"></image>
		</view>
		<view class="user_booking_box">
			<view class="user_booking_item" @click="goAppointment">
				<text>{{$t('lang.appointment.myAppoint')}}</text>
				<image src="@/static/image/icon_calendar.png"></image>
			</view>
			<view class="user_booking_item" @click="shareApp">
				<text>{{$t('lang.user.share')}}</text>
				<image src="@/static/image/icon_share.png"></image>
			</view>
			<view class="user_booking_item">
				<text>{{$t('lang.user.contact')}}</text>
				<image src="@/static/image/icon_chat.png"></image>
			</view>
		</view>
		<share ref='share'></share>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		computed:{
			levelName () {
				let levelName = this.$t('lang.user.member')
				switch(this.userInfo.levelType) {
					case 10:
					levelName = this.$t('lang.user.goldCard');
					break;
					case 20:
					levelName = this.$t('lang.user.platinumCard');
					break;
					case 30:
					levelName = this.$t('lang.user.blackCard')
					break;
				}
				return levelName
			}
		},
		methods: {
			goAppointment() {
				uni.navigateTo({
					url:'../appointment/appointment'
				})
			},
			shareApp() {
				this.$refs.share.showShare = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user {
		.user_info {
			height: 280rpx;
			width: 630rpx;
			color: #FFFFFF;
			background-image: linear-gradient(135deg, #4D4D4D 0%, #1A1A1A 100%);
			background-position: bottom;
			box-shadow: 0 20px 20px 0 rgba(26, 26, 26, 0.20);
			border-radius: 12px;
			position: relative;
			overflow: hidden;
			margin: 60rpx 30rpx 20rpx 60rpx;
			filter: brightness(110%);
			image {
				position: absolute;
				opacity: .1;
				right: -50rpx;
				bottom: -20rpx;
				width: 300rpx;
				height: 184rpx;
			}
			&.level2 {
				color: #333333;
				background-image: linear-gradient(135deg, #f3e2a4 0%, #de9a4f 100%);
				box-shadow: 0 20px 20px 0 rgba(222, 154, 79, 0.20);
				
				.info {
					color: #333;
				}
				image {
					filter: brightness(130%);
					opacity: .2;
				}
			}
			&.level3 {
				color: #333333;
				background-image: linear-gradient(135deg, #e9eff9 0%, #bbc1db 100%);
				box-shadow: 0 20px 20px 0 rgba(187, 193, 289, 0.20);
				
				.info {
					color: #333;
				}
				image {
					filter: brightness(130%);
					opacity: .2;
				}
			}

			.name {
				font-size: 48rpx;
				font-weight: 500;
				margin: 40rpx 40rpx;
			}

			.info {
				margin: 100rpx 40rpx 0 40rpx;
				font-size: 28rpx;
				color: #a6a6a6;
				display: flex;
				justify-content: space-between;
				text:nth-child(1) {
					font-size: 32rpx;
				}
			}
		}

		.user_booking_box {
			display: flex;
			flex-direction: column;
			align-items: center;
			.user_booking_item {
				width: 630rpx;
				height: 160rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #DDDDDD;
				text{
					font-size: 32rpx;
					color: #333333;
				}
				image{
					width: 54rpx;
					height: 54rpx;
					
				}
			}
		}
	}
</style>