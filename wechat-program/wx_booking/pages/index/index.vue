<template>
	<view class="home">
		<!-- navbar -->
		<nav-bar :isBack="false" :text="`${timeState},${userInfo && userInfo.nickName}`"></nav-bar>
		<!-- 首页bannner -->
		<view class="banner">
			<u-swiper :list="bannerList" height="320" @click="swiperClick"></u-swiper>
		</view>
		<view class="tit_lang">
			<view class="tit">
				{{$t('lang.index.appoint')}}
			</view>
			<view class='lang'>
				<view :class="[lang === 'zh-CN' && 'curLang']" @click="changeLang('zh-CN')">
					中
				</view>
				<view :class="[lang === 'en-US' && 'curLang']" @click="changeLang('en-US')">
					EN
				</view>
			</view>
		</view>
		<!-- 门店信息卡片 -->
		<view class="store_box">
			<store-card 
				v-for="item in cardList" 
				@click.native='goDateTime(item.clubName,item._id)' 
				:key='item._id' :address="item.clubAddress"
				 :title="item.clubName[$t('lang.lang')]" 
				 :isOpen="item.state"
			>
			</store-card>
		</view>
	</view>
</template>

<script>
	import storeCard from '../../components/store-card.vue'

	export default {
		components: {
			storeCard
		},
		data() {
			return {
				title: 'Hello',
				cardList: [],
				banners: [],
				userInfo: {},
				lang: ''
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.lang = uni.getStorageSync('language')
		},
		computed: {
			// 轮播图组件数据
			bannerList() {
				return this.banners.filter(item => item.state === 1).map(item => {
					return {
						image: item.imgUrl,
						title: item.remark,
						linkUrl: item.linkUrl
					}
				})
			},
			//当前时间段
			timeState() {
				// 获取当前小时
				let hours = new Date().getHours();
				// 设置默认文字
				let text = ``;
				// 判断当前时间段
				if (hours >= 0 && hours <= 14) {
					text = this.$t('lang.index.goodMorning');
				} else if (hours > 14 && hours <= 18) {
					text = this.$t('lang.index.goodAfternoon');
				} else if (hours > 18 && hours <= 24) {
					text = this.$t('lang.index.goodEvening');
				}
				// 返回当前时间段对应的状态
				return text;
			}
		},
		mounted() {
			this.getHomeInfo()
		},
		methods: {
			// 跳转到预约页面
			goDateTime(clubName, clubId) {
				const query = {
					clubName,
					clubId
				}
				uni.navigateTo({
					url: `../dateTime/dateTime?query=${encodeURIComponent(JSON.stringify(query))}`
				})
			},
			//获取首页会所列表
			async getHomeInfo() {
				const {
					data
				} = await this.$api.getHomeInfo()
				if (data) {
					this.cardList = data.clubs
					this.banners = data.banners
				}
			},
			// 轮播图跳转 小程序需要用webview
			swiperClick(index) {
				// #ifdef H5
				window.open(this.bannerList[index].linkUrl)
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/Web-view/Web-view?url' + this.bannerList[index].linkUrl
				})
				// #endif
			},
			// 更换语言
			changeLang(lang) {
				this.$i18n.locale = lang
				this.lang = lang
				uni.setStorageSync('language',lang)
			}
		}
	}
</script>

<style lang='scss' scoped>
	.home {
		.banner {
			height: 320rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.tit_lang {
			display: flex;
			justify-content: space-between;
			padding: 0 10px;

			.tit {
				font-size: 36rpx;
				font-weight: 500;
				height: 120rpx;
				line-height: 120rpx;
				padding-left: 30rpx;
			}

			.lang {
				display: flex;
				align-items: center;
				height: 120rpx;

				view {
					width: 60rpx;
					height: 46rpx;
					line-height: 46rpx;
					text-align: center;
					border-radius: 10px;
					transition: background-color .3s ease;

					&.curLang {
						background-color: #88CC00;
						color: #FFFFFF;
					}
				}
			}
		}

		.store_box {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
