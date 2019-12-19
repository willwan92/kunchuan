<template>
	<div class="page">
		<div class="section query">
			<div class="query-title">
				<img :src="searchImg" class="icon">
				<span>筛选查询</span>
			</div>
			<el-form 
				:inline="true"
				label-width="75px">
				<el-row class="form-input">
					<el-form-item label="查询时段:">
						<el-date-picker
					      v-model="timeRange"
				       	  value-format="yyyy-MM-dd hh:mm:ss"
					      type="datetimerange"
					      unlink-panels
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="订单类型:">
						<el-select v-model="searchParams.businessType">
						    <el-option
						      v-for="item in orderType"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
					</el-form-item>
				  	<el-form-item label="物流状态:">
				  		<el-select v-model="searchParams.logisticsStatus">
						    <el-option
						      v-for="item in logisticStatus"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
				  	</el-form-item>
				</el-row>
				<el-row class="form-input">
				  	<el-form-item label="订单状态:">
				  		<el-select v-model="searchParams.payStatus">
						    <el-option
						      v-for="item in orderStatus"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
				  	</el-form-item>
					<el-form-item label="订单编号:">
						<el-input v-model="searchParams.orderNo" placeholder="请输入订单编号"></el-input>
					</el-form-item>
					<el-form-item label="用户昵称:">
				  		<el-input v-model="searchParams.nickname" placeholder="请输入用户昵称"></el-input>
				  	</el-form-item>
				  	<el-form-item label="用户手机:">
				  		<el-input v-model="searchParams.mobile" placeholder="请输入用户手机"></el-input>
				  	</el-form-item>
				</el-row>
				<el-row type="flex" justify="center">
					<el-button class="btn-lg" type="primary" @click="search">查 询</el-button>
					<el-button class="btn-lg" @click="reset">重 置</el-button>
				</el-row>
			</el-form>
		</div>

		<div class="section list">
			<div class="list-title">
				<div class="fl">
					<img :src="listImg" class="icon">
					<span>订单列表</span>
				</div>
				<div class="fr btn-wrapper">
					<el-button class="fr" size="small" @click="exportList()">导出报表</el-button>
				</div>
			</div>
		
			<div class="list-table" v-loading="isFetchingData">
				<el-table :data="orderList" style="width: 100%" border ref="multipleTable" tooltip-effect="dark">
					<el-table-column label='订单编号' prop="orderNo" align="center">
					</el-table-column>
					<el-table-column label="订单类型" prop="businessType" align="center">
					</el-table-column>
					<el-table-column label="支付方式" prop="payWay" align="center">
					</el-table-column>
					<el-table-column label="昵称" prop="nickname" align="center">
					</el-table-column> 
					<el-table-column label="手机" prop="mobile" align="center">
					</el-table-column>
					<el-table-column label="商品信息" prop="name" align="center">
					</el-table-column>
					<el-table-column label="金额/元" prop="totalAmount" align="center">
					</el-table-column>
					<el-table-column label="下单时间" prop="createTime" align="center">
					</el-table-column>
					<el-table-column label="拼团状态" prop="groupStatus" align="center">
					</el-table-column>
					<el-table-column label="订单状态" prop="payStatus" align="center">
					</el-table-column>
					<el-table-column label="物流状态" prop="logisticsStatus" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div class="pagination" v-if="curPageSize">
					<el-pagination @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="curPageSize" layout="prev, pager, next" background :total="curTotal">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import searchImg from 'assets/sousuo.png'
	import listImg from 'assets/list.png'
	import { getOrderList } from 'api/order/order'
	import {  judgePayStatus, judgeLogisticsStatus, commonExport, deepCopy } from 'common/utils'

	export default {
		data() {
			return {
				searchImg,
				listImg,
				dataRange: '',
				orderType: [
					{
						label: '所有',
						value: ''
					},
					{
						label: '单独',
						value: '1'
					},
					{
						label: '拼团',
						value: '2'
					}
				],
				orderStatus: [
					{
						label: '所有',
						value: ''
					},
					{
						label: '待支付',
						value: '1'
					},
					{
						label: '已付款',
						value: '2'
					},
					{
						label: '已关闭',
						value: '3'
					},
					{
						label: '退款中',
						value: '4'
					},
					{
						label: '已退款',
						value: '5'
					}
				],
				logisticStatus: [
					{
						label: '所有',
						value: ''
					},
					{
						label: '待发货',
						value: '2'
					},
					{
						label: '待收货',
						value: '3'
					},
					{
						label: '已完成',
						value: '1'
					}
				],
				timeRange: ['', ''],
				searchParams: {
					createTime: '',
					endTime: '',
					businessType: '',
					logisticsStatus: '',
					payStatus: '',
					orderNo: '',
					nickname: '',
					mobile: ''
				},
				orderList:[],
				isFetchingData:false,
				currentPage: 1,
				curPageSize: 10,
				curTotal: 0
			}
		},
		methods: {
			handleCurrentChange(page) {
				this.currentPage = page;
				this.fetchData();
			},
			//查询
			search(){
				this.currentPage = 1;
				this.fetchData();
			},
			reset() {
				let searchParams = this.searchParams;
				for (let item in searchParams) {
					searchParams[item] = '';
				}
				if(this.timeRange && this.timeRange.length) {
					this.timeRange[0] = '';
					this.timeRange[1] = '';
				}
			},
			createParams() {
				let params = {};
				let searchParams = this.searchParams;
				for (let item in searchParams) {
					if (searchParams[item]) {
						params[item] = searchParams[item];
					}
				}

				if(this.timeRange && this.timeRange.length) {
					if(this.timeRange[0]) {
						params['createTime'] = encodeURI(this.timeRange[0]);
					}
					if(this.timeRange[1]) {
						params['endTime'] = encodeURI(this.timeRange[1]);
					}
				}
				
				return params;
			},
			// 请求列表数据
			fetchData() {
				this.isFetchingData = true;

				let params = this.createParams();
				params.pageNum = this.currentPage;

				getOrderList(params)
				.then((res) => {
					this.isFetchingData = false;

					let data = res.data;
					if (data.code === 2000000 && data.data) {
						this.orderList = data.data.dataList.map(item => {
							return {
								totalAmount: (item.totalAmount / 100).toFixed(2),
				                orderNo: item.orderNo,
				                orderId: item.orderId,
				                createTime: item.createTime,
				                nickname: item.nickname,
				                mobile: item.mobile,
				                name: item.name,
				                payWay: item.payWay === '1' ? '微信' : item.payWay === '2' ? '支付宝' : '微信小程序',
				                groupStatus: item.groupStatus === '0' ? '未成团' : item.groupStatus === '1' ? '拼团中' : '已成团',
				                businessType: item.businessType === '1' ? '单独购买' : '拼团',
				                payStatus: judgePayStatus(item.payStatus),
				                logisticsStatus: judgeLogisticsStatus(item.logisticsStatus)
							}
						});
						this.curTotal = data.data.total;
						this.currentPage = data.data.pageNum;
					}
					else {
						self.$message.error(data.msg);
					}

				})
				.catch(err => {
					this.isFetchingData = false;
					console.log(err);
					this.$message.error('出现错误，请稍后再试！');
				})
			},
			//导出列表
			exportList(){
				let params = this.createParams();
				let url = '/api/pj-operation/order/orderExportReport';
				commonExport(params, '订单列表', url);
			},
			viewDetail(row) {
				this.$router.push({
					path: '/order/orderDetail',
					query: {
						id: row.orderId
					}
				})
			}
		},
		beforeRouteEnter(to, from, next) {
			next( vm => {
				vm.$nextTick( () => {
					vm.fetchData();
				});
			})
		},
		mounted() {
			this.$nextTick(() => {
				this.fetchData();
			})
		}
	}
</script>
<style lang="less" scoped>
.page {
	.section {
		padding: 20px;
		border:1px solid #ccc;
		border-radius: 5px;
		background:#fff;
		box-shadow:0 2px 4px rgba(0,0,0,.15);
		-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
		margin-bottom:30px;
		&:hover{
			box-shadow:0 4px 8px rgba(0,0,0,.15);
			-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
		}
	}
}



.query-title {
	margin-bottom: 30px;
	padding:5px;
	height:35px;
	color: @blue;
	border-bottom:1px solid #ccc;
	.icon {
		float:left;
		width: 22px;
		margin:-1px 8px 0 0;
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}

.list-title {
	height:50px;
	color: @blue;
	.icon {
		float:left;
		width: 22px;
		margin:-1px 8px 0 0;
	}
	.btn-wrapper {
		margin-top: -5px;
	}
}

.pagination {
	margin-top:15px;
	text-align: right;
}

</style>
