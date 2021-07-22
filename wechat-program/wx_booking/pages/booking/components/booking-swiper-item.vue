<template>
	<scroll-view class="swiper_wrap" scroll-y="true">
		<view class="swiper-item"
          v-for="(item,index) in list"
          :key="index"
          @click="selectedItem(item._id,item.itemName,item.itemMinute,item.regularPrice)"
    >
			<view class="info">
				<view class="name">
					<text>{{item.itemName[$t('lang.lang')]}}</text>
					<text class="sign" v-if="item.tagName">
						{{item.tagName[$t('lang.lang')]}}
					</text>
				</view>
				<view class="time">
					{{item.itemMinute}} mins
				</view>
			</view>
			<view class="price">
				₱{{item.regularPrice}}
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props:['list'],
		methods:{
			selectedItem(id,name,min,price) {
				this.$emit('selected',id,name,min,price)
			}
		}
	}
</script>

<style lang="scss" scoped>
		.swiper_wrap {
			height: 100%;
		}
	
		.swiper-item {
			height: 210rpx;
			width: 630rpx;
			border-bottom: 1px solid #dddddd;
			margin: 0 auto;
			padding-top: 60rpx;
	
			.info {
				display: flex;
				justify-content: space-between;
	
				.name {
					font-size: 32rpx;
					font-weight: 500;
	
					.sign {
						font-size: 24rpx;
						padding: 6rpx 18rpx;
						color: $uni-bg-color;
						border: 1px solid $uni-bg-color;
						border-radius: 20px;
						margin-left: 10px;
					}
				}
			}
	
			.price,
			.time {
				font-size: 28rpx;
				color: #666666;
			}
	
			.price {
				margin-top: 10px;
			}
		}
</style>
