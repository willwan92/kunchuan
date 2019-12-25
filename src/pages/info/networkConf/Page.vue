<template>
	<div class="page">
		<div class="section query">
			<div class="list-title">
				<span>网卡设置</span>
			</div>

			<div class="list-table" v-loading="isFetchingData">
				<el-table :data="tableData" border>
					<el-table-column label='接口名称' prop="userId" align="center">
					</el-table-column>
					<el-table-column label="IP地址" prop="nickname" align="center">
					</el-table-column>
					<el-table-column label="子网掩码" prop="account" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="viewDetail(scope.row)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<el-dialog
			title="添加"
			:visible.sync="dialogShow"
			width="600px"
			@close="dialogShow = false">
			<el-form :model="form" ref="form" label-width="100px">
				<el-form-item label="接口名称">
					<el-input v-model="form.pjname"></el-input>
				</el-form-item>
				<el-form-item label="IP地址">
					<el-input v-model="form.pjname"></el-input>
				</el-form-item>
				<el-form-item label="子网掩码">
					<el-input v-model="form.pjname"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer">
				<el-button @click="dialogShow = false">取 消</el-button>
				<el-button type="primary" @click="handleComfirmClick">确 定</el-button>
			</span>
		</el-dialog>

		<div class="section list">
			<div class="query-title">
				<span>路由设置</span>
			</div>
			<el-form 
				width="600px"
				label-width="90px">
				<el-form-item label="目的地址:">
					<el-input v-model="form.nickname"></el-input>
				</el-form-item>
				<el-form-item label="目的掩码:">
					<el-input v-model="form.account"></el-input>
				</el-form-item>
				<el-form-item label="下一跳地址:">
					<el-input v-model="form.mobile"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" size="small" @click="exportList">保存设置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import searchImg from 'assets/sousuo.png'
	import listImg from 'assets/list.png'
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				dialogShow: false,
				form: {
					account: '',
					mobile: '',
					brmid: '',
					nickname: ''
				},
				tableData: [],
				isFetchingData:false,
			}
		},
		methods: {
			handleComfirmClick() {

			},
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
