<template>
	<div class="page">
		<div class="section query">
			<div class="query-title">
				<span>离线升级</span>
			</div>
			<el-form 
				:inline="true"
				size="small"
				label-width="75px">
				<el-row class="form-input">
					<el-form-item label="">
						<el-input v-model="fileName" placeholder=""></el-input>
					</el-form-item>
					
					<el-form-item label="">
						<el-upload
							action=""
							multiple
							:limit="1">
							<el-button type="primary">点击上传</el-button>
							<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
						</el-upload>
					</el-form-item>
				</el-row>
			</el-form>
		</div>

		<div class="section query">
			<div class="query-title">
				<span>在线升级</span>
			</div>
			<el-form 
				:inline="true"
				size="small"
				label-width="75px">
				<el-row class="form-input">
					<el-form-item label="升级URL">
						<el-input v-model="fileName" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="更新周期">
						<el-input v-model="fileName" placeholder=""></el-input>
						<template slot="append">秒</template>
					</el-form-item>
					
					<el-form-item label="">
						<el-button type="primary">保存</el-button>
						<el-button type="primary">取消</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				fileName: ''
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
