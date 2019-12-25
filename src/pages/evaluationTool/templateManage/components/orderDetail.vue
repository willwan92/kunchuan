<template>
	<div class="page">
		<div class="section">
			<div class="title">
				<span>订单信息</span>
			</div>
			<el-row class="order-info" v-loading="isFetchingData">
				<el-col :span="12">
					订单类型：{{ orderDetails.businessType === '1' ? '单独购买' : '拼团' }} <br>
					订单编号：{{ orderDetails.orderNo }} <br>
					拼团单号：{{ orderDetails.groupNo }} <br>
					拼团状态：{{ orderDetails.groupStatus === '0' ? '未成团' : orderDetails.groupStatus === '1' ? '拼团中' : '已成团',}} <br>
					拼团时段：{{ orderDetails.groCreateTime }} - {{ orderDetails.endTime }} <br>
					订单状态：{{ judgePayStatus(orderDetails.payStatus) }} <br>
					物流状态：{{ judgeLogisticsStatus(orderDetails.logisticsStatus) }} <br>
				</el-col>
				<el-col :span="12">
					昵称：{{ orderDetails.nickname }} <br>
					手机：{{ orderDetails.mobile }} <br>
					BRM账号：{{ orderDetails.brmid }} <br>
					支付方式：{{ orderDetails.payWay === '1' ? '微信' : orderDetails.payWay === '2' ? '支付宝' : '微信小程序' }} <br>
					支付时间：{{ orderDetails.payTime }} <br>
					第三方交易单号：{{ orderDetails.thirdpartyTradeno }} <br>
					商户号：{{ orderDetails.mchid }} <br>
				</el-col>
			</el-row>


			<div class="title">
				<span>商品信息</span>
			</div>
			<el-table v-loading="isFetchingData" :data="goodsList" style="width: 100%" border ref="multipleTable">
				<el-table-column width="180" label='商品图片' align="center">
					<template slot-scope="scope">
					  <img class="goods-img" :src="scope.row.picUrl" alt="商品图片">
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="name" align="center">
				</el-table-column>
				<el-table-column label="单价" prop="price" align="center">
				</el-table-column>
				<el-table-column label="数量" prop="qty" align="center">
				</el-table-column> 
				<el-table-column label="商品金额" prop="price" align="center">
				</el-table-column>
				<el-table-column label="物流保价费" prop="logisticsPrice" align="center">
				</el-table-column>
				<el-table-column label="下单时间" prop="createTime" align="center">
				</el-table-column> 
				<el-table-column label="订单金额" prop="totalAmount" align="center">
				</el-table-column>
			</el-table>

			<div class="title">
				<span>收件信息</span>
			</div>
			<el-table v-loading="isFetchingData" :data="receiverInfo" style="width: 100%" border ref="multipleTable">
				<el-table-column label='收件人姓名' prop="receiver" align="center">
				</el-table-column>
				<el-table-column label="联系方式" prop="receiverMobile" align="center">
				</el-table-column>
				<el-table-column label="所在地区" prop="receiverAddress" align="center">
				</el-table-column>
				<el-table-column label="详细地址" prop="receiverAddress" align="center">
				</el-table-column>
			</el-table>

			<div class="title">
				<span>配送信息</span>
			</div>
			
			<div  v-loading="isFetchingData">
				<el-row v-if="orderDetails" class="order-info">
					<el-col :span="2">
						配送公司:
					</el-col>
					<el-col :span="22">
						{{ orderDetails.companyName }}
					</el-col>
				</el-row>
				<el-row class="order-info">
					<el-col :span="2">
						快递单号:
					</el-col>
					<el-col :span="22">
						{{ orderDetails.logisticsNo }}
					</el-col>
				</el-row>
				<el-row class="order-info">
					<el-col :span="2">
						快递追踪:
					</el-col>
					<el-col :span="22">
						<p v-for="item in logisticDetails"><span class="time">{{ item.logisticTime }}</span> {{ item.location }}</p>
					</el-col>
				</el-row>
			</div>

			<el-row class="btn-wrapper" type="flex" justify="center">
				<el-button class="btn-lg" type="primary" @click="back">返 回</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
	import userAvatar from 'assets/images/user-avatar.png'
	import { deepCopy, judgePayStatus, judgeLogisticsStatus } from 'common/utils'

	export default {
		data() {
			return {
				orderDetails: {},
				logisticDetails: {},
				goodsList: [],
				receiverInfo: [],
				orderId: '',
				isFetchingData:false
			}
		},
		methods: {
			judgePayStatus: judgePayStatus,
			judgeLogisticsStatus: judgeLogisticsStatus,
			back() {
				this.$router.back();
			},
			mapData(data) {
				this.orderDetails = deepCopy(data.orderDetails);
				this.logisticDetails = deepCopy(data.logisticDetails);

				let goods = {};
				goods['name'] = data.orderDetails.name;
				goods['picUrl'] = data.orderDetails.picUrl;
				goods['price'] = data.orderDetails.price;
				goods['qty'] = data.orderDetails.qty;
				goods['logisticsPrice'] = data.orderDetails.logisticsPrice;
				goods['createTime'] = data.orderDetails.createTime;
				goods['totalAmount'] = data.orderDetails.totalAmount;
				this.goodsList.push(goods);

				let receiver = {};
				receiver['receiver'] = data.orderDetails.receiver;
				receiver['receiverMobile'] = data.orderDetails.receiverMobile;
				receiver['receiverAddress'] = data.orderDetails.receiverAddress;
				this.receiverInfo.push(receiver);
			},
			// 请求列表数据
			fetchData(params) {
				let self = this;
				self.isFetchingData = true;
				getOrderDetails(params)
				.then((res) => {
					self.isFetchingData = false;
					if (res.data.code === 2000000 && res.data.data) {
						let data =res.data.data;
						self.mapData(data);
					} else {
						self.$message.error(data.msg);
					}
				})
				.catch(err => {
					console.log(err);
					self.isFetchingData = false;
				})
			},
		},
		beforeRouteEnter(to, from, next) {
			next( vm => {
				vm.orderId = to.query.id;
			})
		},
		mounted() {
			this.$nextTick(() => {
				this.fetchData({ orderId: this.orderId });
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

.order-info {
	padding-left: 20px;
	line-height: 2;
	p {
		margin: 0;
		.time {
			margin-right: 10px;
		}
	}
}

.goods-img {
	width: 160px;
	height: 120px;
}

</style>
