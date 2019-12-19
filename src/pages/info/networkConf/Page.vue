<template>
	<div class="page">
		<div class="section query">
			<div class="list-title">
				<span>网卡设置</span>
			</div>

			<div class="list-table" v-loading="isFetchingData">
				<!-- <el-table :data="userList" style="width: 100%" border ref="multipleTable" tooltip-effect="dark">
					<el-table-column label='用户ID' prop="userId" align="center">
					</el-table-column>
					<el-table-column label="昵称" prop="nickname" align="center">
					</el-table-column>
					<el-table-column label="用户名" prop="account" align="center">
					</el-table-column>
					<el-table-column label="手机" prop="mobile" align="center">
					</el-table-column> 
					<el-table-column label="性别" prop="gender" align="center">
					</el-table-column>
					<el-table-column label="生日" prop="birthday" align="center">
					</el-table-column>
					<el-table-column label="注册时间" prop="createTime" align="center">
					</el-table-column>
					<el-table-column label="BRM账号" prop="brmid" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
						</template>
					</el-table-column>
				</el-table> -->
			</div>
		</div>

		<div class="section list">
			<div class="query-title">
				<div class="fl">
					<span>路由设置</span>
				</div>
				<div class="fr btn-wrapper">
					<el-button class="fr" type="" size="small" @click="exportList">保存设置</el-button>
				</div>
			</div>
			<el-form 
				width="600px"
				label-width="90px">
				<el-form-item label="目的地址:">
					<el-input v-model="searchParams.nickname"></el-input>
				</el-form-item>
				<el-form-item label="目的掩码:">
					<el-input v-model="searchParams.account"></el-input>
				</el-form-item>
				<el-form-item label="下一跳地址:">
					<el-input v-model="searchParams.mobile"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import searchImg from 'assets/sousuo.png'
	import listImg from 'assets/list.png'
	import { getUserList } from 'api/user/user'
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				searchImg,
				listImg,
				searchParams: {
					account: '',
					mobile: '',
					brmid: '',
					nickname: ''
				},
				userList: [],
				isFetchingData:false,
				exportDetail:'',
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
				this.fetchData();
			},
			reset() {
				let searchParams = this.searchParams;
				for (let item in searchParams) {
					searchParams[item] = '';
				}
			},
			createParams() {
				let params = deepCopy(this.searchParams);
				params.pageNum = this.currentPage;
				return params;
			},
			// 请求列表数据
			fetchData() {
				this.isFetchingData = true;

				// let params = 
				getUserList(this.createParams())
					.then((res) => {
						let data = res.data;
						if (data.code === 2000000 && data.data) {
							this.userList = data.data.dataList.map(item => {
								return {
						            birthday: item.birthday,
						            brmid: item.brmid,
						            gender: item.gender === 1 ? '男' : item.gender === '2' ? '女' : '未知' ,
						            createTime: item.createTime,
						            nickname: item.nickname,
						            mobile: item.mobile,
						            userId: item.userId,
						            account: item.account
						        }
							});
							this.currentPage = data.data.pageNum;
							this.curTotal = data.data.total;
						}
						this.isFetchingData = false;
					})
					.catch(err => {
						this.isFetchingData = false;
					})
			},
			//导出列表
			exportList(){
				let params = deepCopy(this.searchParams);
				let url = '/api/pj-operation/user/userExportReport';
				commonExport({}, '用户列表', url);
			},
			viewDetail(row) {
				this.$router.push({
					path: '/user/userDetail',
					query: {
						id: row.userId
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
		.el-form {
			width: 60%;
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
