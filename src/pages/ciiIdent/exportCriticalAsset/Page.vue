<template>
	<div class="goodsPage">
		<div class="goodsContent">
			<div class="goodsContentTop">
				<div class="goodsLeft"><img :src="list" class="sousuo">关键信息基础实施清单</div>
				<div class="goodsRight">
					<el-button class="btnBatch" @click="exportList()">导出</el-button>
				</div>
			</div>
			
			<app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table>
		</div>
	</div>
</template>

<script>
	import sousuo from '../../../assets/sousuo.png'
	import list from '../../../assets/list.png'
	import {commonExport} from 'common/utils'

	export default {
		data() {
			return {
				tableTitles: [
					{
						prop: 'serial',
						title: '序号'
					},
					{
						prop: 'serial',
						title: 'IP地址'
					},
					{
						prop: 'pushTime',
						title: '资产类型'
					},
					{
						prop: 'userId',
						title: '设备型号'
					},
					{
						prop: 'mobile',
						title: '版本号'
					},
					{
						prop: 'userId',
						title: '操作系统'
					},
					{
						prop: 'mobile',
						title: '所属关键业务'
					},
					{
						prop: 'mobile',
						title: '关键性'
					}
				],
				tableData: []
			}
		},
		methods: {
			handleSizeChange(size) {
				this.curPageSize = size;
				this.fetchData();
			},
			handleCurrentChange(page) {
				this.currentPage = page;
				this.fetchData();
			},
			//查询
			search(){
				this.fetchData();
			},
			//重置
			reset(){
				this.goodsNumber = '';
				this.goodsName = '';
			},
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
			//删除
			deleteDetail(row){
				this.dialogVisible = true;
				this.dataList = row.id;
			},
			handleClose(done) {
				done();
			},
			//确定删除
			confirm(){
				let params = {};
				params.ids = this.dataList;
				params.status = -2;
				this.dialogVisible = false;
				goodsStatus(params)
				.then((res) => {
					if (res.data.code === 2000000) {
						this.$notify.success('删除成功！');
						this.fetchData();
					}else{
						this.$notify.error(res.data.msg);
						this.fetchData();
					}	
				})
				.catch(err => {
					this.$notify.error('删除失败！');
					this.fetchData();
				})
			},
			//批量删除
			batchDelete(row){
				if(this.multipleSelection.length == 0){
					this.$notify.error('请勾选要删除的内容！');
				}else{
					this.dialogVisible1 = true;
				}
			},
			//批量删除确定
			confirm1(){
				let params = {};
				params.ids = this.multipleSelection.join(',');
				params.status = -2;
				this.dialogVisible = false;
				goodsStatus(params)
				.then((res) => {
					if (res.data.code === 2000000) {
						this.$notify.success('批量删除成功！');
						this.fetchData();
					}else{
						this.$notify.error(res.data.msg);
						this.fetchData();
					}	
				})
				.catch(err => {
					this.$notify.error('批量删除失败！');
					this.fetchData();
				})
			},
			createParams() {
				let params = {};
				if (this.goodsNumber) {
					params.id = this.goodsNumber;
				}
				if (this.goodsName) {
					params.name = this.goodsName;
				}
				params.page = 2;
				params.pageNum = this.currentPage;
				params.pageSize = this.curPageSize;
				return params;
			},
			// 请求列表数据
			fetchData() {
				this.isFetchingData = true;
				getGoodsList(this.createParams())
				.then((res) => {
				if (res.data.code === 2000000 && res.data.data) {
					let data = res.data.data;
					this.datas = data.dataList;
					this.currentPage = data.pageNum;
					this.curTotal = data.total;
					this.curPageSize = data.pageSize;
				}
					this.isFetchingData = false;
				})
				.catch(err => {
					this.isFetchingData = false;
				})
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
<style scoped>
.goodsTop,.goodsContent{
    padding:20px;
	border:1px solid #ccc;
	border-radius: 5px;
	background:#fff;
	box-shadow:0 2px 4px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
	margin-bottom:30px;
}
.goodsTop:hover,.goodsContent:hover{
	box-shadow:0 4px 8px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
}
.query{
	border-bottom:1px solid #ccc;
	padding:5px;
	width:100%;
	height:35px;
}
.query span{
	color:#409EFF;
}
.sousuo{
	width: 22px;
	float:left;
	margin:-1px 8px 0 0;
}
.queryConent{
	display: flex;
	display: -webkit-box;
	align-content: space-between;
	align-items: center;
	margin:30px 0;
}
.searchBar{
	display: -webkit-box;
	align-content: space-between;
	align-items: center;
	width:300px;
	margin-right:20px;
}
.statusSelect{
	margin-right:20px;
}
.searchBtn{
	text-align: center;
}
.btnSearch{
	width:150px;
	margin-right:30px;
	background:#409EFF;
	color:#fff;
}
.btnReset{
	width:150px;
	margin-right:30px;
}
.goodsContent{
	min-height:300px;
}
.goodsContentTop{
	/* display: flex;
	display: -webkit-box;
	align-content: space-between;
	align-items: center; */
	height:50px;
}
.goodsLeft{
	float:left;
	color:#409EFF;
}
.goodsRight{
	float:right;
}
.goodsNew{
	height:30px;
	line-height:4px;
	background:#409EFF;
	color:#fff;
}
.btnBatch{
	height:30px;
	line-height:4px;
}
.paging{
	margin-top:15px;
	text-align: right;
}
.facility{
  margin-bottom:10px;
  font-size:16px;
  text-align: center;
  color:#409EFF;
}
.button{
	cursor: pointer;
	color:#409EFF;
}
</style>
