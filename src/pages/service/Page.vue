<template>
	<div class="goodsPage">
		<div class="goodsTop">
			<!-- <div class="query">
				<span>在线客服</span>
			</div>
			<el-button type="primary" style="margin-top: 20px" @click.native="jump">点击跳转到品鉴酒管理后台在线客服</el-button> -->
			<iframe src="../../../static/onlineServices/onlineService.html?uid='+userSig+'&key='+identifier+'&sig='+userAdmin" frameborder="0" style="width:100%;height:100%;"></iframe>
		</div>
	</div>
</template>

<script>
	import {getSignByUserId} from 'api/service/service'
	export default {
		data() {
			return {
				dataList:{},
				userSig:'',
				identifier:'',
				userAdmin:'',
			}
		},
		methods:{
			signByUserList(){
				let obj={};
				obj.userId = '001';
				obj.env = 'customer';
				getSignByUserId(obj).then((res)=>{
					this.dataList = res.data.data;
					this.userSig = this.dataList.userSig;
					this.identifier = this.dataList.identifier;
					this.userAdmin = this.dataList.adminSig;
				})
			},
			jump() {
				// this.signByUserList();
				var list = this.dataList;
				var userSig = list.userSig;
				var userAdmin = list.adminSig;
				var identifier = list.identifier;
				window.open('../../../static/onlineServices/onlineService.html?uid='+userSig+'&key='+identifier+'&sig='+userAdmin,'_blank')
			}
		}
	}
</script>
<style scoped>
.goodsPage{
	height:100%;
}
.goodsTop{
	height:100%;
    padding:20px;
	border:1px solid #ccc;
	border-radius: 5px;
	background:#fff;
	box-shadow:0 2px 4px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
	margin-bottom:30px;
}
.goodsTop:hover{
	box-shadow:0 4px 8px rgba(0,0,0,.15);
	-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
}
.query{
	border-bottom:1px solid #ccc;
	padding:5px;
	width:100%;
	height:35px;
}
</style>
