<template>
	<div class="page">
		<div class="section list">
			<div class="section-title">
        <span>关键性评估规则管理</span>
				<el-button class="export-btn" type="primary" size="small" @click="exportList">导出</el-button>
      </div>
			
			<el-table :data="tableData" type="selection"
      width="55" border v-loading="isLoading">
        <el-table-column label="" prop="index"></el-table-column>
        <el-table-column label="IP/资产标识" prop="ip"></el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="生产厂家" prop="vendorName"></el-table-column>
      </el-table>
		</div>
	</div>
</template>

<script>
	import {commonExport} from 'common/utils'

	export default {
		data() {
			return {
				tableData: []
			}
		},
		methods: {
			//批量上架
			batchShelves(){
				let params = {};
				params.ids = this.multipleSelection.join(',');
				params.status = 1;
				if(this.multipleSelection.length == 0){
					this.$notify.error('请勾选要上架的内容！');
					
				}else{
					goodsStatus(params)
					.then((res) => {
						if (res.data.code === 2000000) {
							this.$notify.success('批量上架成功！');
							this.fetchData();
						}else{
							this.$notify.error(res.data.msg);
							this.fetchData();
						}	
					})
					.catch(err => {
						this.$notify.error('批量上架失败！');
						this.fetchData();
					})
				}
			},
			//选择框
			handleSelectionChange(val){
				if(val){
					this.multipleSelection = [];
					for(var i = 0;i < val.length;i++){
						this.exportDetail = val[i].id;
						this.multipleSelection.push(this.exportDetail);
					}
				}
			},
			//导出列表
			exportList(item){
				let params = {};
				if (this.goodsNumber) {
					params.id = this.goodsNumber;
				}
				if (this.goodsName) {
					params.name = this.goodsName;
				}
				params.page = 2;
				let url = '/api/pj-operation/goods/exportInfo';
				commonExport(params,'回收站商品列表',url)
			},
		},
	}
</script>
<style scoped lang="less">
.page {
  .section {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		}
		
		.section-title {
			position: relative;
			margin-bottom: 30px;
			padding: 5px;
			height: 35px;
			color: @blue;
			border-bottom: 1px solid #ccc;
			.export-btn {
				position: absolute;
				right: 5px;
				bottom: 5px;
			}
		}
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}
</style>
