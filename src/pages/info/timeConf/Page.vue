<template>
	<div class="page">
		<div class="section query">
			<div class="query-title">
				<span>自定义时间</span>
			</div>
			<el-form 
				size="small"
				label-width="75px">
				<el-form-item label="当前时间">
					<el-input v-model="fileName" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="修改时间">
					<el-input v-model="fileName" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="修改时间">
					<el-button type="primary" @click="0">保存</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="section query">
			<div class="query-title">
				<span>网络时间同步</span>
			</div>
			<el-form 
				size="small"
				label-width="75px">
				<el-form-item label="同步方式">
					<el-radio v-model="radio" label="1">内网同步</el-radio>
  					<el-radio v-model="radio" label="2">外网同步</el-radio>
				</el-form-item>
				<el-form-item label="同步来源">
					<el-input v-model="fileName" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="0">同步</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import searchImg from 'assets/sousuo.png'
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				searchImg,
				listImg,
				fileName: '',
				searchParams: {
					account: '',
					mobile: '',
					brmid: '',
					nickname: ''
				}
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

</style>
