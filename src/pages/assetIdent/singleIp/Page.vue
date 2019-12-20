<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="目标IP">
					<el-input v-model="searchParams.startIp" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="端口范围">
					<el-input v-model="searchParams.startPort" placeholder=""></el-input>
				</el-form-item>
				<span style="display: inline-block; width: 24px; line-height: 36px;">— </span>
				<el-form-item label="">
					<el-input v-model="searchParams.endPort" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="扫描方式">
					<el-select v-model="searchParams.scannerType" placeholder="">
						<el-option v-for="item in scanTypes"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="startScan">网络端口分析</el-button>
					<el-button @click="stopScan">停止扫描</el-button>
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
				scanTypes: [
					{
						label: 'TCP',
						value: 2
					},
					{
						label: 'UDP',
						value: 3
					},
					{
						label: 'TCP&UDP',
						value: 4
					}
				],
				searchParams: {
					startIp: '',
					scannerType: 2,
					startPort: '1',
					endPort: '65535',
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
						title: '内容分析'
					},
					{
						prop: 'mobile',
						title: '设备类型'
					},
					{
						prop: 'mobile',
						title: 'CVE ID'
					}
				],
				tableData: []
			}
		},
		methods: {
			startScan(){
				this.fetchData();
			},
			stopScan(){

			},
			handleOperate(row, type, target) {
				this.editItem({ id: row.id })
			},
			editItem(id) {

			},
			async fetchData() {
				let params = this._.clone(this.searchParams)
				params.endIp = params.startIp;
				console.log(params);
				const data = await this.fetchFuzz({
					url: '/fuzz/page/view/scanner!scannerSigPort.action',
					params: params,
					type: 'get',
					vm: this
				});

				console.log(data);
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
