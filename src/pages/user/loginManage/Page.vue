<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="策略类别">
					<el-input v-model="searchParams.nickname" placeholder="请输入策略类别"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="search">查 询</el-button>
				</el-form-item>
			</el-form>
		
			<app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table>
		</div>
	</div>
</template>

<script>
	import { getUserList } from 'api/user/user'
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				searchParams: {
					nickname: ''
				},
				tableTitles: [
					{
						prop: 'serial',
						title: '策略类别'
					},
					{
						prop: 'pushTime',
						title: '策略内容'
					},
					{
						title: '操作',
						prop: 'id',
						isTemplate: true,
						width: 150,
						templateType: 'check',
						operate: '修改'
					}
				],
				tableData: []
			}
		},
		methods: {
			//查询
			search(){
				this.fetchData();
			},
			handleOperate(row, type, target) {
				this.editItem({ id: row.id })
			},
			editItem(id) {

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
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}
</style>
