<template>
	<!-- 技师弹窗组件 -->
	<view class="technician">
		<!-- 搜索框 -->
		<view class="search">
			<image src="@/static/image/icon/magnifier.svg"></image>
			<input type="text" v-model.trim="searchText" :placeholder="$t('lang.booking.searchNameWork')" />
		</view>
		<!-- 推荐标签栏，搜索后隐藏 -->
		<view class="tags_box" v-if="searchText.length < 1">
			<view
				:class="['tags_item',selectedTagList.includes(item) && 'tags_item-selected']"
				v-for="(item,index) in tagsList"
				:key="index"
				@click="selectTag(item)"
			>
				{{item}}
			</view>
		</view>
		<!-- 技师列表 -->
		<view class="teacher_box">
			<view class="teacher_item" v-for="item in searchList" :key="item._id">
				<image class="avatar" :src="item.workIcon||'../../../static/image/icon_user.png'"></image>
				<view class="info" @click="sendWorker(item.workName,item.workNum)">
					<view class="name">
						{{item.workName[$t('lang.lang')]}}
					</view>
					<view class="skill">
						{{$t('lang.booking.goodAt')}}：{{item.workGoodAt}}
					</view>
				</view>
			</view>
		</view>
			<view class="save btn_green" @click="sendTag">
				{{$t('lang.common.save')}}
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagsList: ['无偏好', '男', '女', '高级', '普通'],
				searchText: '',
				searchList: [],
				selectedTagList: [],
				workerName: '',
				workNum: '',
			}
		},
		props: ['techList'],
		methods:{
			selectTag(tagName) {
				const index = this.selectedTagList.indexOf(tagName)
				if (index !== -1){
					this.selectedTagList.splice(index,1)
				}else{
					this.selectedTagList.push(tagName)
				}
			},
			sendTag(){
				if(this.selectedTagList.length !==0 ){
					this.$emit('selected',this.selectedTagList.join())
				}else{
					console.log('请选择技师或者标签')
				}
			},
			sendWorker(name,id) {
				this.workerName = name
				this.workNum = id
				this.$emit('selected',name,id)
			}
		},
		watch: {
			searchText(val) {
				if (val !== '') {
					this.searchList = this.techList.filter(item => {
						return item.workName[this.$t('lang.lang')].includes(val) || item.workNum.includes(val)
					})
				}else{
					this.searchList = []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.technician {
		padding-top: 148rpx;

		.search {
			position: relative;
			width: 630rpx;
			height: 100rpx;
			margin: 0 auto;
			border: 1px solid #999999;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
			border-radius: 12rpx;
			font-size: 32rpx;

			input {
				width: 100%;
				height: 100%;
				padding-left: 100rpx;
			}

			image {
				width: 48rpx;
				height: 48rpx;
				position: absolute;
				opacity: .8;
				left: 40rpx;
				transform: translateY(50%);
			}
		}

		.tags_box {
			width: 630rpx;
			margin: 0 auto;
			padding-top: 60rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			&::after {
				content: '';
				width: 190rpx;
			}

			.tags_item {
				box-sizing: border-box;
				margin-bottom: 30rpx;
				width: 190rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: #EEEEEE;
				font-size: 32rpx;
				color: #333333;
				border-radius: 12rpx;
				font-weight: normal;
				&-selected{
					background-color: #FFFFFF;
					border: 1px solid $uni-bg-color;
				}
			}
		}

		.teacher_box {
			width: 630rpx;
			margin: 0 auto;

			.teacher_item {
				display: flex;
				height: 160rpx;
				align-items: center;
				border-bottom: 1px solid #DDDDDD;

				&:last-child {
					border-bottom: none;
				}

				.avatar {
					width: 96rpx;
					height: 96rpx;
					border-radius: 50%;
				}

				.info {
					margin-left: 34rpx;
					line-height: 48rpx;

					.name {
						font-size: 36rpx;
						font-weight: 500;
					}

					.skill {
						font-weight: normal;
						font-size: 28rpx;
						color: #BBBBBB;
					}
				}
			}
		}

		.save {
			position: fixed;
			bottom: 30rpx;
			right: 30rpx;
			width: 210rpx;
			height: 96rpx;
		}
	}
</style>
