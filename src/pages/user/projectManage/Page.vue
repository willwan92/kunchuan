<template>
	<div class="page">
		<div class="section list">
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="单系统用户项目" name="1">
					</el-tab-pane>
					<el-tab-pane label="集团用户项目" name="2">
					</el-tab-pane>
					<!-- <app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table> -->
				</el-tabs>

				<el-button class="btn" type="primary" size="small" @click="add">添加</el-button>
			</div>
			
			<el-table :data="tableData" border>
				<el-table-column label="项目名称" prop="pjname"></el-table-column>
				<el-table-column label="项目类型" prop="pjtype"></el-table-column>
				<el-table-column label="项目地点" prop="address"></el-table-column>
				<el-table-column label="开始时间" prop="createTime"></el-table-column>
				<el-table-column label="项目描述" prop="description"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	// import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				tabName: '1',
				tableData: []
			}
		},
		created() {
			this.fetchTableData();
			
		},
		methods: {
			async fetchTableData() {
				let url = this.tabName === '1' ? '/projectInfo/getProjectInfoList' : '/projectInfo/getProjectInfosList';
				const data = await this.fetch({url: url, vm: this});
				this.tableData = this._.clone(data);
			},
			//查询
			search(){
				this.fetchData();
			},
			handleClick(tab) {
				this.fetchTableData();
			},
			handleEditClick(id) {

			},
			handleDelClick(id) {

			},
			editItem(id) {

			},
			createParams() {
				let params = deepCopy(this.searchParams);
				params.pageNum = this.currentPage;
				return params;
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
					// vm.fetchData();
				});
			})
		},
		mounted() {
			this.$nextTick(() => {
				// this.fetchData();
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

.tabs-wrapper {
	position: relative;
	.btn {
		position: absolute;
		right: 5px;
		top: 5px;
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}
</style>
