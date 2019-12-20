<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="项目名称">
					<el-input v-model="searchParams.nickname" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="IP范围">
					<el-input v-model="searchParams.nickname" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="扫描类型">
					<el-select v-model="searchParams.nickname" placeholder="">
						<el-option v-for="item in []"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="链接状态">
					<el-select v-model="searchParams.nickname" placeholder="">
						<el-option v-for="item in []"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<br>
				<el-form-item label="端口方式">
					<el-select v-model="searchParams.nickname" placeholder="">
						<el-option v-for="item in []"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="端口方式">
					<el-input v-model="searchParams.nickname" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="扫描方式">
					<el-select v-model="searchParams.nickname" placeholder="">
						<el-option v-for="item in []"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
					<el-checkbox v-model="searchParams.nickname" label="自动识别资产"></el-checkbox>
				</el-form-item>
				<el-row type="flex" justify="center">
					<el-button class="btn-lg" type="primary" @click="search">开始</el-button>
					<el-button class="btn-lg" @click="search">停止</el-button>
				</el-row>
				<br>
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
						title: 'IP地址'
					},
					{
						prop: 'pushTime',
						title: '端口'
					},
					{
						prop: 'userId',
						title: '协议名称'
					},
					{
						prop: 'mobile',
						title: '协议类型'
					},
					{
						prop: 'pushTime',
						title: '协议分析'
					},
					{
						prop: 'userId',
						title: '确认结果'
					},
					{
						prop: 'mobile',
						title: '资产类型'
					},
					{
						prop: 'mobile',
						title: '厂家名称'
					},
					{
						prop: 'mobile',
						title: '设备类型'
					},
					
					{
						prop: 'mobile',
						title: '版本号'
					},
					{
						prop: 'mobile',
						title: '传统设备'
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
