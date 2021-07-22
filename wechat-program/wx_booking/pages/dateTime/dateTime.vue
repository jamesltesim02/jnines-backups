<template>
	<view class="dataTime">
		<!-- navBar -->
		<nav-bar :text='isChange?$t("lang.common.changeAppoint"):$t("lang.common.appoint") + " " + clubName[$t("lang.lang")]'></nav-bar>
		<date-time-picker ref='dateTimePicker' :isChange='isChange'></date-time-picker>
		<!-- footer -->
		<i-footer>
			<view v-if='!isChange' @click="goAppoint">{{$t('lang.common.next')}}</view>
			<view v-else @click="checkAppoint">{{$t('lang.common.changeAppoint')}}</view>
		</i-footer>
	</view>
</template>

<script>
	import dateTimePicker from '@/components/dateTimePicker/dateTimePicker.vue'
	export default {
		components: {
			dateTimePicker,
		},
		onLoad(options) {
			const _options = JSON.parse(decodeURIComponent(options.query))
			this.isChange = _options.change
			this.clubName = _options.clubName
			this.clubId = _options.clubId
			this.orderId = _options.orderId
			
			this.userInfo = uni.getStorageSync('userInfo')
		},
		data() {
			return {
				isChange: false,
				clubName: {},
				clubId: '',
				userInfo: {},
				orderId: ''
			}
		},
		methods: {
			// 前往技师选择
			goAppoint() {
				// 检查时间,不能比当前时间早
				const now = new Date().getTime()
				const appointmentTime = new Date(this.$refs.dateTimePicker.appointmentTime).getTime()
				// 提示框
				if (now > appointmentTime) {
					uni.showToast({
						title: this.$t('lang.dateTime.toastA'),
						icon: 'none'
					})
				} else {
					// 前往技师项目选择页
					const query = {
						appointmentTime,
						clubName: this.clubName,
						clubId: this.clubId,
					}
					uni.navigateTo({
						url: `/pages/booking/booking?query=${encodeURIComponent(JSON.stringify(query))}`
					})
				}
			},
			// 查看是否可约
			async checkAppoint() {
				
				// 检查时间,不能比当前时间早
				const now = new Date().getTime()
				const appointmentTime = new Date(this.$refs.dateTimePicker.appointmentTime).getTime()
				
				if (now > appointmentTime) {
					uni.showToast({
						title: this.$t('lang.dateTime.toastA'),
						icon: 'none'
					})
				}else {
					const params =  {
						userId: this.userInfo._id,
						vipAccount: this.userInfo.vipAccount,
						orderTime:  appointmentTime,
						_id: this.orderId
					}
					const res = await this.$api.updateOrder(params)
					if (res.code === 200) {
						uni.showToast({
							title: '修改预约成功',
							icon: 'none',
							complete: () => {
								setTimeout(() => {
									uni.reLaunch({
										url: '../appointment/appointment'
									})
								},500)
							}
						})
					}else {
						uni.showToast({
							title: '修改预约失败，请重试',
							icon: 'none'
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
