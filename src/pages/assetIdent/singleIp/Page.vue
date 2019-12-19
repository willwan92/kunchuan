<template>
	<div class="goodsPage">
		<div class="goodsContent">
			<div class="goodsContentTop">
				<div class="goodsLeft"><img :src="list" class="sousuo">广告列表</div>
			</div>
			<div class="userWallTable">
				<el-table :data="datas" style="width: 100%" border ref="multipleTable" tooltip-effect="dark">
					<el-table-column label='广告位ID' prop="id" align="center">
					</el-table-column>
					<el-table-column label="广告位类型" prop="adType" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.adType == 1 ? '首页顶部广告图':''}}</span>
						</template>
					</el-table-column>
					<el-table-column label="描述" prop="comment" align="center">
					</el-table-column>
					<el-table-column label="广告图" align="center">
						<template slot-scope="scope">
							<img :src="scope.row.adUrl" style="max-width: 150px">
						</template>
					</el-table-column> 
					<el-table-column label="发布状态" align="center">
						<template slot-scope="scope">
							<span  @click="release(scope.row)" class="button">{{scope.row.isOnline == true ? '发布':'不发布'}}</span>
						</template>
					</el-table-column>
					<el-table-column label="更新时间" prop="updateTime" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<span @click="editorDetail(scope.row)" class="button">编辑</span>
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
		<!-- 状态发布 -->
		<el-dialog title="状态" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
		<div class="facility">你要{{this.isOnline == false?'不发布':'发布'}}首页广告图吗？</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="confirm()">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>
	import { getAdvertisingList,saveStatus} from 'api/advertising/advertising';
	import list from 'assets/list.png'
	export default {
		data() {
			return {
				list,
				datas:[],
				currentPage: 1,
				curPageSize: 10,
				curTotal: 0,
				isFetchingData:false,
				dialogVisible:false,
				statusId:0,
				isOnline:false,
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
			//发布
			release(row){
				this.dialogVisible = true;
				this.statusId = row.id;
				this.isOnline = (row.isOnline == false?true:false);
			},
			//发布确定
			confirm(){
				this.dialogVisible = false;
				let params = {};
				params.id = this.statusId;
				params.isOnline = this.isOnline;
				saveStatus(params)
				.then((res) => {
					if (res.data.code === 2000000) {
						this.$notify.success('更改成功');
						this.fetchData();
					}else{
						this.$notify.error(res.data.msg);
					}
				})
				.catch(err => {
					this.$notify.success('更改失败');
				})
			},
			handleClose(done) {
				done();
			},
			//编辑
			editorDetail(row){
				this.$router.push({
					path:'/advertising/advertisManagementNew',
					query:{
						id:row.id,
						isCreate: 2,
					}
				})
			},
			createParams() {
				let params = {};
				params.pageNum = this.currentPage;
				params.pageSize = this.curPageSize;
				return params;
			},
			//获取列表数据
			fetchData() {
				this.isFetchingData = true;
				getAdvertisingList(this.createParams())
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
.goodsContent{
    padding:20px;
	border:1px solid #ccc;
	border-radius: 5px;
	background:#fff;
	box-shadow:0 2px 4px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
	margin-bottom:30px;
}
.goodsContent:hover{
	box-shadow:0 4px 8px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
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
	color:#409EFF;
}
.paging{
	margin-top:15px;
	text-align: right;
}
.button{
	cursor: pointer;
	color:#409EFF;
}
.sousuo{
	width: 22px;
	float:left;
	margin:-1px 8px 0 0;
}
.facility{
  margin-bottom:10px;
  font-size:16px;
  text-align: center;
  color:#409EFF;
}
</style>
