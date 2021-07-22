<template>
	<!-- 预约人数项目页面 -->
	<view class="booking">
		<!-- navBar -->
		<nav-bar :text="$t('lang.common.appoint') + ' ' +clubName[$t('lang.lang')]"></nav-bar>
		<!-- 预约栏 -->
		<view class="booking_box">
			<!-- 人数统计 -->
			<view class="booking_count">
				<text>{{$t('lang.booking.peoples')}}</text>
				<view class="counter">
					<image src="@/static/image/icon/jianhao.svg" v-if="personCount > 1" @click="changeCount(-1)">
					</image>
					<text>{{personCount}}</text>
					<image @click="changeCount(1)" src="@/static/image/icon/jiahao.svg"></image>
				</view>
			</view>
			<!-- 具体项目选择栏 -->
			<booking-detail 
			v-for="item in optionItem" 
			ref="detail" 
			:num='item.id' 
			:techList='techList' 
			:itemList='itemList'
			 @showPopup='showPopup'></booking-detail>
		</view>
		<!-- footer -->
		<i-footer>
			<view @click="checkAppoint">{{$t('lang.booking.appoint')}}</view>
		</i-footer>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import available from '../../components/dateTimePicker/components/dateTime-Available.vue'
	import bookingDetail from './components/booking-detail.vue'

	export default {
		components: {
			bookingDetail,
			available
		},
		data() {
			return {
				clubName: {},
				clubId: '',
				appointmentTime: '',
				personCount: 1,
				optionItem: [{
					id: 1
				}],
				techList: [],
				itemList: [],
				userInfo: {}
			}
		},
		onShow () {
			  this.userInfo = uni.getStorageSync('userInfo')
		},
		onLoad(option) {
			const _option = JSON.parse(decodeURIComponent(option.query))
			this.clubName = _option.clubName
			this.clubId = _option.clubId
			this.appointmentTime = _option.appointmentTime
			this.getTechnician()
			this.getItemList()
		},
		methods: {
			// 添加/删除 客人
			changeCount(num) {
				this.personCount += num
				num === -1 ?
					this.optionItem.pop() :
					this.optionItem.push({
						id: this.personCount
					})
			},
			// 获取当前会所的技师列表
			async getTechnician() {
				let query = {
					clubId: this.clubId,
					appointmentTime: new Date(this.appointmentTime).getTime()
				}
				const {
					data
				} = await this.$api.getTechnician(query)
				this.techList = data
			},
			// 获取当前会所的项目列表
			async getItemList() {
				const {
					data
				} = await this.$api.getItemList({
					clubId: this.clubId
				})
				this.itemList = data
			},
			// 下单
			async checkAppoint() {
				// 遍历每一个客人所选项目,项目为必选
				let optionItem = []
				for (let [index, value] of this.$refs.detail.entries()) {
					if (value.optionItem.itemId == '') {
						this.$refs.uToast.show({
							title: this.$t('lang.booking.toastA', {
								num: index + 1
							}),
							type: 'default'
						})
						break;
					} else {
						optionItem.push(value.optionItem)
					}
				}
				// 传参
				let orderData = {
					userId: this.userInfo._id,
					vipAccount: this.userInfo.vipAccount,
					clubId: this.clubId,
					clubName: this.clubName,
					personCount: this.personCount,
					priceCount: 2000,
					orderTime: new Date(this.appointmentTime).getTime(),
					optionItem: optionItem
				}
				// 发送请求
				if (optionItem.length > 0) {
					const res = await this.$api.placeOrder(JSON.stringify(orderData))
					// 下单失败
					if (res.code !== 200) {
						this.$refs.uToast.show({
							title: data.msg,
							type: 'default'
						})
					} else {
						// 成功下单
						const optionItemName = optionItem.map(item => item.itemName[this.$t('lang.lang')]).join('、')
						let query = {
							appointmentTime: this.appointmentTime,
							optionItemName: optionItemName
						}
						// 跳转成功页
						uni.redirectTo({
							url: '/pages/book-success/book-success?query=' + encodeURIComponent(JSON.stringify(query))
						})
					}
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.booking {
		&_box {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 170rpx;
		}

		&_count {
			position: sticky;
			background-color: #FFFFFF;
			top: 88rpx;
			height: 180rpx;
			width: 630rpx;
			font-size: 36rpx;
			font-weight: 500;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.counter {
				display: flex;
				align-items: center;

				image {
					width: 76rpx;
					height: 76rpx;
					opacity: .6;
				}

				text {
					margin: 0 30rpx;
					font-size: 40rpx;
				}
			}
		}
	}
</style>
