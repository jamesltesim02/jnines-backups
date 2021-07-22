<template>
	<!-- 项目弹窗组件 -->
	<view class="booking_type">
		<!-- 标签栏 -->
		<scroll-view class="tabbar" 
		scroll-x="true" 
		:scroll-left="scrollLeft">
			<view 
			v-for="(item,index) in tabsList"
      :key="index"
			:class="['tabbar_item',current === index && 'active']" 
			@click="tabsChange(index)">
				<view>{{item}}</view>
			</view>
		</scroll-view>
		<!-- 相关项目 -->
		<swiper class="swiper" :current='current' @change='swiperChange'>
			<swiper-item v-for="item in tabsItem" :key="item._id">
				<booking-swiper-item :list='item' @selected='selectedItem'></booking-swiper-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import bookingSwiperItem from './booking-swiper-item.vue'
	export default {
		components: {
			bookingSwiperItem
		},
		data() {
			return {
				current: 0,
				scrollLeft: 0,
			}
		},
		props: ['itemList'],
		computed: {
			// 分类标签
			tabsList() {
				return this.itemList.map(item => {
					return item.groupName[this.$t('lang.lang')]
				})
			},
			// 分类项目
			tabsItem() {
				return this.itemList.map(item => {
					return item.items
				})
			}
		},
		methods: {
			// 选择标签栏
			tabsChange(index) {
				this.current = index
			},
			// 监听Swiper change事件
			swiperChange(event) {
				const detail = event.detail
				this.current = detail.current
				// 用户滑动的情况下设置tag位置
				if (detail.source === 'touch') {
					this.$nextTick(() => {
						const query = uni.createSelectorQuery().in(this);
						//获取多个tag节点
						query.selectAll(".tabbar_item").boundingClientRect(data => {
							// 将tag标签移动到对应位置
							const left = data.reduce((acc,cur,index)=>{
								return index < detail.current?acc + cur.width:acc
							},0)
							this.scrollLeft = left
						}).exec();
					})
				}
			},
			// 项目类别分类
			filterGroup(groupId) {
				return this.itemList.filter(item => item.itemGroup == groupId)
			},
			selectedItem(id, name, min, price) {
				this.$emit('selected', id, name, min, price)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.booking_type {
		padding-top: 88rpx;

		.swiper {
			height: 625rpx;
		}

		.tabbar {
			white-space: nowrap;
			height: 84rpx;
			width: 100%;

			&_item {
				display: inline-block;
				line-height: 80rpx;
				font-size: 28rpx;
				text-align: center;
				padding: 0 30rpx;
				color: #666666;

				&.active {
					view {
						color: #000000;
						font-weight: 500;
						border-bottom: 4rpx solid $uni-bg-color;
					}
				}
			}
		}
	}
</style>
