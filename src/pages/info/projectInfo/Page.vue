<template>
	<div class="page">
		<el-row class="section" :gutter="20">
			<el-col :span="4" class="scrollbar-wrapper">
				<el-scrollbar >
					<el-tree :data="pjTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
				</el-scrollbar>
			</el-col>
			<el-col :span="20">
				<el-form 
					class="pj-form"
					label-width="100px">
					<el-form-item label="项目名称">
						<el-input v-model="form.pjname" readonly="" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="项目类型">
						<el-select v-model="getPjType" placeholder="">
							<el-option v-for="item in pjTypeOption"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="项目创建时间">
						<el-input v-model="form.createTime" readonly="" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="单位名称">
						<el-input v-model="form.organization" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="项目地址">
						<el-input v-model="form.address" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="联系人">
						<el-input v-model="form.linkman" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="联系人电话">
						<el-input v-model="form.phone" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="项目描述">
						<el-input v-model="form.description" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" size="small" @click="handleSaveClick">保存</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				dialogShow: false,
				form: {
					id: '',
					pjName: '',
					pjType: '',
					createTime: '',
					organization: '',
					address: '',
					linkman: '',
					phone: '',
					description: ''
				},
				pjTreeData: [],
				defaultProps: {
					children: 'children',
					label: 'pjname'
				},
				pjTypeOption: [
					{
						label: '单系统用户项目',
						value: '2'
					},
					{
						label: '集团用户项目',
						value: '1'
					}
				],
				tableTitles: [
					{
						prop: 'serial',
						title: '用户名'
					},
					{
						prop: 'pushTime',
						title: '所属角色'
					},
					{
						prop: 'userId',
						title: '项目权限'
					},
					{
						prop: 'mobile',
						title: '邮箱地址'
					}
				],
				tableData: []
			}
		},
		created() {
			this.fetchPjTreeData();
		},
		computed: {
			getPjType() {
				return this.form.pjtype && this.form.pjtype.charAt(0);
			}
		},
		methods: {
			//查询
			search(){
				this.fetchData();
			},
			handleNodeClick(nodeData) {
				this.form = nodeData;
			},
			async fetchPjTreeData() {
				const { data } = await this.fetch({url: '/porject/getProjectList', vm: this});
				this.pjTreeData = this.traverseArr(data);
			},
			async handleSaveClick() {
				const params = {
					id: this.form.id,
					organization: this.form.organization,
					address: this.form.address,
					linkman: this.form.linkman,
					phone: this.form.phone,
					description: this.form.description,
				};

				const data = await this.fetch({
					url: '/projectInfo/getProjectInfoUpAdd',
					params: params,
					vm: this
				});

				if (data === 1) {
					this.$message.success('保存成功！');
				} else {
					this.$message.error('保存失败！');
				}
			},
			traverseArr(arr) {
				let tmpArr = [];
				let tmpObj = {};

				arr.forEach(item => {
					tmpObj = this._.clone(item);

					if (item.children && item.children[0]) {
						tmpObj.children = this.traverseArr(item.children);
					}

					tmpArr.push(tmpObj);
				});

				return tmpArr;
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
				// 
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

.scrollbar-wrapper {
	overflow-x: hidden !important;
}

.pj-form {
	border-left: 1px solid #ccc;
	padding-left: 20px;
	width: 800px;
}
</style>
