<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="项目名称">
					<el-cascader
						@change="getPjDetail"
						:options="pjOptions"
						:props="{ expandTrigger: 'hover' }" 
						filterable
						v-model="searchParams.pjValue">
					</el-cascader>
				</el-form-item>
				<el-form-item label="IP范围">
					<el-input v-model="searchParams.ipRange" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="扫描类型">
					<el-select v-model="searchParams.scanType" placeholder="">
						<el-option v-for="item in scanTypes"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="链接状态">
					<el-select v-model="searchParams.linkStatus" placeholder="">
						<el-option v-for="item in linkStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<br>
				<!-- <el-form-item label="端口方式">
					<el-select v-model="searchParams.portMethod" placeholder="">
						<el-option v-for="item in portMethodOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="端口范围">
					<el-input v-model="searchParams.port" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="扫描方式">
					<el-select v-model="searchParams.scanMethod" placeholder="">
						<el-option v-for="item in scanMethodOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
					<el-checkbox v-model="searchParams.autoIdentAsset" label="自动识别资产"></el-checkbox>
				</el-form-item>
				<el-row type="flex" justify="center">
					<el-button class="btn-lg" type="primary" @click="startScan">开始</el-button>
					<el-button class="btn-lg" @click="search">停止</el-button>
				</el-row>
				<br>
			</el-form>
		
			<el-table :data="tableData" border v-loading="isLoading">
				<el-table-column label="IP地址" prop="ip"></el-table-column>
				<el-table-column label="端口" prop="port"></el-table-column>
				<el-table-column label="协议名称" prop="protoName"></el-table-column>
				<el-table-column label="TCP/UDP" prop="protoType"></el-table-column>
				<el-table-column label="协议分析" prop="">
					<template slot-scope="scope">
						<el-button type="text" @click="handleProtoClick(scope.row.index)">网络类型分析</el-button>
					</template>
				</el-table-column>
				<el-table-column label="确认协议" prop="result"></el-table-column>
				<el-table-column label="资产确认" prop="">
					<template slot-scope="scope">
						<el-button type="text" @click="handleContentClick(scope.row.index)">网络资产确认</el-button>
					</template>
				</el-table-column>
				<el-table-column label="资产类型" prop="assetType"></el-table-column>
				<el-table-column label="厂家名称" prop="manufName"></el-table-column>
				<el-table-column label="设备型号" prop="deviceType"></el-table-column>
				<el-table-column label="版本号" prop="version"></el-table-column>
				<el-table-column label="传统设备" prop="TraditionalDevice"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import { getCascaderOptions } from 'common/utils'

	export default {
		data() {
			return {
				isLoading: false,
				searchParams: {
					pjValue: [],
					ipRange: '',
					scanType: 2,
					linkStatus: 0,
					portMethod: 1,
					port: '',
					scanMethod: 0,
					autoIdentAsset: true,
				},
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
				linkStatusOptions: [
					{
						label: '半连接扫描',
						value: 0
					},
					{
						label: '全连接扫描',
						value: 1
					},
					{
						label: 'FIN 扫描',
						value: 2
					},
					{
						label: '圣诞树扫描',
						value: 3
					},
					{
						label: '空扫描',
						value: 4
					}
				],
				portMethodOptions: [
					{
						label: '离散端口',
						value: 0
					},
					{
						label: '连续端口',
						value: 1
					},
				],
				scanMethodOptions: [
					{
						label: '快速扫描',
						value: 0
					},
					{
						label: '深度扫描',
						value: 1
					},
				],
				tableTitles: [
					{
						title: '操作',
						prop: 'id',
						isTemplate: true,
						width: 150,
						templateType: 'check',
						operate: '修改'
					}
				],
				pjOptions: null,
				tableData: []
			}
		},
		created() {
			this.fetchPjTreeData();
		},
		computed: {
			
		},
		methods: {
			startScan() {
				let searchParams = this.searchParams;

				const params = 	{
					id: this.getPjId,
					ip_scope: searchParams.ipRange,
					scan_type: searchParams.scanType,
					cont_type: searchParams.linkStatus,
					port_type: searchParams.portMethod,
					port_vales: searchParams.port,
					propertiesd: searchParams.autoIdentAsset,
					scanMethod: searchParams.scanMethod
				};

				// const data = await this.fetch({
				// 	url: '/fuzz/page/view/scanner/scanstation!startBtnMe.action',
				// 	params: params,
				// 	vm: this
				// });

				console.log(data);
			},
			getPjId() {
				let id;
				if (this.searchParams.pjValue && this.searchParams.pjValue[0]) {
					id = this.searchParams.pjValue.slice(-1)[0]
				} else {
					id = null;
				}

				return id;
			},
			search(){
				this.fetchData();
			},
			async getPjDetail() {
				const data = await this.fetch({
					url: '/projectInfo/getSelectProjectById',
					params: {
						id: this.getPjId(),
					},
					vm: this
				});
				
				data && (this.searchParams.ipRange = data.ip);
			},
			handleOperate(row, type, target) {
				this.editItem({ id: row.id })
			},
			async fetchPjTreeData() {
				const { data } = await this.fetch({url: '/porject/getProjectList', vm: this});
				this.pjOptions = this.getCascaderOptions({
					arr: data,
					label: 'pjname',
					value: 'id',
					filter: 'isleaf'
				});
			},
			// 请求列表数据
			fetchData() {
				
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
