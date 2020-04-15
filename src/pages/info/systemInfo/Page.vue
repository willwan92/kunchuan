<template>
	<div class="page">
		<div class="section">
			<el-form 
				:inline="true"
				label-width="100px">
				<el-row class="form-input">
					<el-form-item label="CPU使用率">
						<el-input v-model="systemForm.cpuUse" readonly placeholder=""></el-input>
					</el-form-item>
					<el-form-item label=" 当前系统时间">
						<el-input v-model="systemForm.serverTime" readonly placeholder=""></el-input>
					</el-form-item>
				  	<el-form-item label="系统运行时间">
				  		<el-input v-model="systemForm.sysRunTime" readonly placeholder=""></el-input>
				  	</el-form-item>
				</el-row>
				<el-row class="form-input">
					<el-form-item label="总内存">
						<el-input v-model="systemForm.totalMem" readonly placeholder=""></el-input>
					</el-form-item>
					<el-form-item label=" 已使用内存">
						<el-input v-model="systemForm.maxMem" readonly placeholder=""></el-input>
					</el-form-item>
				  	<el-form-item label=" 内存使用率">
				  		<el-input v-model="systemForm.memUse" readonly placeholder=""></el-input>
				  	</el-form-item>
				</el-row>
				<el-row class="form-input">
					<el-form-item label="硬盘总空间">
						<el-input v-model="systemForm.totalHD" readonly placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="已用硬盘空间">
						<el-input v-model="systemForm.freeHD" readonly placeholder=""></el-input>
					</el-form-item>
				  	<el-form-item label=" 硬盘使用率">
				  		<el-input v-model="systemForm.hDUse" readonly placeholder=""></el-input>
				  	</el-form-item>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {  } from 'common/utils'

	export default {
		data() {
			return {
				systemForm: {
					cpuUse: "",
					freeHD: "",
					hDUse: "",
					maxMem: "",
					memUse: "",
					serverTime: "",
					sysRunTime: "",
					totalHD: "",
					totalMem: ""
				},
				isFetchingData:false
			}
		},
		created() {
			this.fetchData();
		},
		methods: {
			reset() {
				let systemForm = this.systemForm;
				for (let item in systemForm) {
					systemForm[item] = '';
				}
			},
			createParams() {
				let params = deepCopy(this.systemForm);
				params.pageNum = this.currentPage;
				return params;
			},
			// 请求列表数据
			async fetchData() {
				this.isFetchingData = true;

				const data = await this.getFuzz({
					url: '/fuzz/page/view/sysconfig/sysconfig!getDiskSpace.action',
					vm: this
				});



				this.systemForm = Object.assign(this.systemForm, {}, {
					cpuUse: data.CpuUse,
					freeHD: data.FreeHD,
					hDUse: data.HDUse,
					maxMem: data.MaxMem,
					memUse: data.MemUse,
					serverTime: data.ServerTime,
					sysRunTime: data.SysRunTime,
					totalHD: data.TotalHD,
					totalMem: data.TotalMem
				})
			}
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

</style>
