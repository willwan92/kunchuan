<template>
	<div class="goodsPage">
		<div class="goodsTop">
			<div class="query">
				<img :src="sousuo" class="sousuo">
				<span>筛选查询</span>
			</div>
			<div class="queryConent">
				<div class="searchBar">
					<div class="statusSelect">商品编号:</div>
					<el-input placeholder="请输入商品编号" v-model="goodsNumber">
					</el-input>
				</div>
				<div class="searchBar">
					<div class="statusSelect">商品名称:</div>
					<el-input placeholder="请输入商品名称" v-model="goodsName">
					</el-input>
				</div>
			</div>
			<div class="searchBtn">
				<el-button class="btnSearch" @click="search">查询</el-button>
				<el-button class="btnReset" @click="reset">重置</el-button>
			</div>
		</div>
		<div class="goodsContent">
			<div class="goodsContentTop">
				<div class="goodsLeft"><img :src="list" class="sousuo">回收站商品列表</div>
				<div class="goodsRight">
					<el-button class="btnBatch" @click="batchShelves()">批量上架</el-button>
					<el-button class="btnBatch" @click="batchDelete()">批量删除</el-button>
					<el-button class="btnBatch" @click="exportList()">导出报表</el-button>
				</div>
			</div>
			<div class="userWallTable">
				<el-table :data="datas" style="width: 100%" border ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
					<el-table-column
						type="selection"
						width="55"  align='center'>
					</el-table-column>
					<el-table-column label='商品编号' prop="id" align="center" width='80'>
					</el-table-column>
					<el-table-column label="商品名称" prop="name" align="center">
					</el-table-column>
					<el-table-column label="商品简介" prop="summary" align="center">
					</el-table-column>
					<el-table-column label="原价" align="center" width="100">
						<template slot-scope="scope">
							<span>{{(scope.row.price / 100).toFixed(2)}}</span>
						</template>
					</el-table-column> 
					<el-table-column label="单买价" align="center" width="100">
						<template slot-scope="scope">
							<span>{{(scope.row.singlePrice / 100).toFixed(2)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="拼团价" align="center" width="100">
						<template slot-scope="scope">
							<span>{{(scope.row.groupPrice / 100).toFixed(2)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="拼团限制（人）" prop="groupManCount" align="center" width="120">
					</el-table-column>
					<el-table-column label="更新时间" prop="updateTime" align="center">
					</el-table-column>
					<el-table-column label="商品状态" align="center" width="120">
						<template slot-scope="scope">
							<span>{{scope.row.status == 0 ? '已下架':scope.row.status == 1 ? '已上架':scope.row.status == -1 ? '回收站':'删除'}}</span>
						</template>
					</el-table-column> 
					<el-table-column label="操作" align="center" width="120">
						<template slot-scope="scope">
							<span @click="deleteDetail(scope.row)" class="button">删除</span>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div class="paging">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="curPageSize" layout="prev, pager, next" background :total="curTotal">
					</el-pagination>
				</div>
			</div>
		</div>
		<!-- 删除 -->
		<el-dialog title="删除" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
		<div class="facility">确定要删除商品吗？</div>
		<div class="facility">删除后不可恢复！</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="confirm()">确 定</el-button>
		</span>
		</el-dialog>
		<!-- 批量删除 -->
		<el-dialog title="批量删除" :visible.sync="dialogVisible1" width="20%" :before-close="handleClose">
		<div class="facility">确定要删除商品吗？</div>
		<div class="facility">删除后不可恢复！</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible1 = false">取 消</el-button>
			<el-button type="primary" @click="confirm1()">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>
	import sousuo from '../../../assets/sousuo.png'
	import list from '../../../assets/list.png'
	import { getGoodsList,goodsStatus} from '../../../api/goods/goods';
	import {commonExport} from 'common/utils'

	export default {
		data() {
			return {
				sousuo,
				list,
				goodsNumber:'',
				goodsName:'',
				datas:[],
				isFetchingData:false,
				multipleSelection: [],
				exportDetail:'',
				currentPage: 1,
				curPageSize: 10,
				curTotal: 0,
				dialogVisible:false,
				dataList:'',
				dialogVisible1:false,
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
