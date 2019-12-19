<template>
	<div class="page">
		<div class="section">
			<div class="title">
				<span>基本信息</span>
			</div>
			<div class="container clearfix" id="user-info" v-loading="isLoading">
				<figure class="fl user-avatar">
					<img :src="userInfo.portraitUrl">
					<figcaption>用户头像</figcaption>
				</figure>
				<div class="user-info">
					<table cellspacing="0">
						<tbody>
							<tr>
								<td>用户ID</td>
								<td>{{ userInfo.userId }}</td>
								<td>BRM账号</td>
								<td>{{ userInfo.brmid }}</td>
							</tr>
							<tr>
								<td>用户名</td>
								<td>{{ userInfo.account }}</td>
								<td>手机</td>
								<td>{{ userInfo.mobile }}</td>
							</tr><tr>
								<td>昵称</td>
								<td>{{ userInfo.nickname }}</td>
								<td>性别</td>
								<td>{{ userInfo.gender === 1 ? '男' : userInfo.gender === '2' ? '女' : '未知' }}</td>
							</tr><tr>
								<td>生日</td>
								<td>{{ userInfo.birthday }}</td>
								<td>注册时间</td>
								<td>{{ userInfo.createTime }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>


			<div class="title">
				<span>收件信息</span>
			</div>
			<el-table 
				border 
				style="width: 100%" 
				v-loading="isLoading"
				ref="multipleTable"
				:data="userAddressList" 
				tooltip-effect="dark">
				<el-table-column label='编号' prop="addressId" align="center">
				</el-table-column>
				<el-table-column label="收件人姓名" prop="receiver" align="center">
				</el-table-column>
				<el-table-column label="联系方式" prop="receiverMobile" align="center">
				</el-table-column>
				<el-table-column label="所在地区" prop="area" align="center">
				</el-table-column> 
				<el-table-column label="详细地址" prop="address" align="center">
				</el-table-column>
			</el-table>

			<el-row class="btn-wrapper" type="flex" justify="center">
				<el-button class="btn-lg" type="primary" @click="back">返 回</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
	import userAvatar from 'assets/images/user-avatar.png'
	import { getUserDetail } from 'api/user/user.js'
	import { deepCopy } from 'common/utils.js'

	export default {
		data() {
			return {
				userInfo: {},
				userId: '',
				userAddressList: [],
				isLoading: false
			}
		},
		methods: {
			back() {
				this.$router.back();
			},
			// 请求列表数据
			fetchData(params) {
				let self = this;
				self.isLoading = true;
				getUserDetail(params)
				.then(res => {
					self.isLoading = false;

					let data = res.data;
					if (data.code === 2000000 && data.data) {
						self.userAddressList = deepCopy(data.data.userAddressList);
						self.userInfo = deepCopy(data.data.userDetails);
					}
					else {
						self.$message.error(data.msg);
					}
				})
				.catch(err => {
					this.isLoading = false;
					self.$message.error('出现错误，请稍后再试！');
				})
			}
		},
		beforeRouteEnter(to, from, next) {
			next( vm => {
				vm.userId = to.query.id;
			})
		},
		mounted() {
			this.$nextTick(() => {
				this.fetchData({ userId: this.userId });
			})
		}
	}
</script>
<style lang="less" scoped>
.section {
	padding: 20px;
	border:1px solid #ccc;
	background:#fff;
	border-radius: 5px;
	box-shadow:0 2px 4px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
	&:hover{
		box-shadow:0 4px 8px rgba(0,0,0,.15);
		-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
	}
}

.title {
	margin-top: 30px;
	margin-bottom: 20px;
	padding:5px;
	height:35px;
	color: @blue;
	border-bottom:1px solid #ccc;
}

#user-info {
	height: 184px;
}

.btn-lg {
	width:150px;
	margin-right:30px;
}

.btn-wrapper {
	padding: 30px;
}

.user-avatar {
	widht: 150px;
	img {
		margin-bottom: 15px;
		width: 150px;
		height: 150px;
	}
	figcaption {
		text-align: center;
	}
}

.user-info {
	padding-left: 180px;
	width: 100%;
	table {
		width: 100%;
		border: 1px solid #ebeef5;
		td {
			line-height: 40px;
			text-align: center;
			border-right: 1px solid #ebeef5;
			border-bottom: 1px solid #ebeef5;
		}
		td:last-of-type {
			border-right: 0;
		}
		tr:last-of-type > td {
			border-bottom: 0;
		}
		td:first-of-type {
			font-weight: 700;
		}
		td:nth-child(3) {
			font-weight: 700;
		}
	}
}

</style>
