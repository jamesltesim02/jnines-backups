<template>
	<view class="login">
		<!-- navbar -->
		<nav-bar :isBack="false" :text="$t('lang.login.title')"></nav-bar>
		<view class="logo">
			<image src="@/static/image/Logo.png" mode=""></image>
		</view>
		<!-- 登录 -->
		<view class="login_box">
			<view class="login_input">
				<text>{{$t('lang.login.username')}}</text>
				<input type="text" v-model.trim="username" />
			</view>
			<view class="login_input">
				<text>{{$t('lang.login.password')}}</text>
				<input type="password" v-model.trim="password" />
			</view>
		</view>
		<hover-view>
			<view class="btn_green submit" @click="login">
				{{$t('lang.login.login')}}
			</view>
		</hover-view>
		<view class="footer">
			© 2019 Breeze Valley, Inc. All rights reserved.
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			async login() {
				 // 用户名密码检测
				if (/[@#\$%\^&\<>\!*\`~\()\+=\)*]+/g.test(this.username)) {
					uni.showToast({
						icon: 'none',
						title: this.$t('lang.login.userNameIllegal')
					})
					return;
				} 
				if (this.username === '' || this.password === '') {
					uni.showToast({
						icon: 'none',
						title: this.$t('lang.login.enterUsernamePassword')
					})
					return;
				}
				// 发送请求
				const res = await this.$api.userLogin({
					mobile: this.username,
					passWord: this.password
				})
				if (res.code !== 200) {
					uni.showToast({
						icon: 'none',
						title: this.$t('lang.login.wrongUsernamePassword')
					})
				} else {
					let _this = this
					// 用户信息存储本地storage成功后跳转首页
					uni.setStorage({
						key: 'userInfo',
						data: res.data,
						success() {
							uni.showToast({
								icon: 'none',
								title: _this.$t('lang.login.loginSuccess'),
								success() {
									uni.switchTab({
										url: '/pages/index/index'
									})
								}
							})
						},
						fail() {
							uni.showToast({
								icon: 'none',
								title: this.$t('lang.login.loginFaild'),
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		.logo {
			text-align: center;
			margin: 60rpx 0;

			image {
				width: 308rpx;
				height: 170rpx;
			}
		}

		&_input {
			margin: 0 auto;
			display: flex;
			align-items: center;
			width: 630rpx;
			font-size: 32rpx;
			height: 160rpx;
			border-bottom: 1px solid #DDDDDD;

			text {
				font-weight: 500;
				width: 160rpx;
			}
			input{
				height: 100rpx;
			}
		}

		.submit {
			margin: 60rpx;
		}

		.footer {
			position: absolute;
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			color: #999999;
			bottom: 40rpx;
		}
	}
</style>
