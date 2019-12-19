<template>
	<div class="goodsPage">
		<div class="goodsContent">
			<div class="query">
				<span v-if="this.isCreate == 1">新增广告：首页顶部广告图</span>
				<span v-if="this.isCreate == 2">编辑广告：首页顶部广告图</span>
			</div>
			<div class="searchBar">
				<div class="statusSelect">广告描述:</div>
				<el-input placeholder="请输入此广告描述，最多20个字。" v-model="describe" style="width:300px">
				</el-input>
				<div class="mandatory">(*必填)</div>
			</div>
			<div class="searchBar1">
				<div class="statusSelect">广告图片:</div>
                <el-upload v-loading="isUploading" class="uploadDemo" drag :action="uploadUrl()" :headers="myHeaders" :show-file-list="false" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
                    <img v-if="advertisementPic" :src="advertisementPic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
				<div class="mandatory">(*必填，图片像素 300 x 100)</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">是否发布:</div>
				<el-radio v-model="release" label="1">发布</el-radio>
  				<el-radio v-model="release" label="0">不发布</el-radio>
				<div class="mandatory">(*必选)</div>
			</div>
			<div class="searchBtn">
				<el-button class="btnReset" @click="cancel">取消</el-button>
				<el-button class="btnSearch" @click="submit">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { saveEditor,getEditorList} from '../../../api/advertising/advertising';
	import {uploadFileApi} from 'common/axiosClient'
	export default {
		data() {
			return {
				describe:'',
				isUploading: false,
				advertisementPic: '',
				release: '1',
				isLoading:false,
				rank:'',
			}
		},
		computed:{
			isCreate(){
				return this.$route.query.isCreate;
			},
			id(){
				return this.$route.query.id;
			},
			myHeaders(){
        return {
            "Authorization":'Bearer ' + sessionStorage.getItem('Admin-Token')
				}
			}
    },
		methods:{
			uploadUrl(){
				 return uploadFileApi;
			},
			beforeAvatarUpload(file) {
				this.isUploading = true;
				const isMP4 = file.type === 'image/png' || file.type === 'image/jpeg';
				if (!isMP4) {
					this.$notify.error('上传图片只能是 JPG/PNG 格式!');
					this.isUploading = false;
				}
				return isMP4;
			},
			successUpload(response, file, filelist) {
				this.advertisementPic = response.data['picUrl'];
				this.isUploading = false;
			},
			failedUpload(err, file, filelist) {
				this.$notify.error('文件上传失败, 请重新上传');
				this.isUploading = false;
			},
			fetchRank() {
				let params = {};
				params.id = this.id;
				this.isLoading = true;
				getEditorList(params).then( (res) => {
					this.rank = res.data.data;
					this.advertisementPic = this.rank.adUrl;
					this.describe = this.rank.comment;
					this.release = (this.rank.isOnline == true?'1':'0');
					this.isLoading = false;
				}).catch( () => {
					this.isLoading = false;
				})
			},
			//取消
			cancel(){
				this.$router.back(-1);
			},
			//提交
			submit(){
				let myData = {
					adUrl: this.advertisementPic,
					comment:this.describe,
					isOnline:parseInt(this.release),
				}
				let paramy ={
					id: this.id,
					adUrl: this.advertisementPic,
					comment:this.describe,
					isOnline:parseInt(this.release),
				}
				if (this.isCreate == 2) {
					if(this.describe == ''){
						this.$notify.error('请上输入此广告描述');
					}else{
						if(this.describe.length > 20){
							this.$notify.error('广告描述字数不能多于20字');
						}else{
							saveEditor(paramy).then( (res) => {
							if (res.data.code == 2000000) {
								this.$notify.success('提交成功');
								this.fetchRank();
								this.cancel();
								return;
							} else {
								this.$notify.error(res.data.msg);
							}
							}).catch( () => {
								this.$notify.error('提交失败');
							})
						}           
					}       
				} else {
					if(this.advertisementName == ''){
						this.$notify.error('请上输入广告名称');
					}else{
						if(this.describe.length > 20){
							this.$notify.error('广告描述字数不能多于20字');
						}else{
							saveEditor(myData).then( (res) => {
							if (res.data.code == 2000000) {
								this.$notify.success('提交成功');
								this.fetchRank();
								this.cancel();
								return;
							} else {
								this.$notify.error(res.data.msg);
							}
							}).catch( () => {
								this.$notify.error('提交失败');
							})
						}           
					}   
				}
			},
		},
		mounted() {
			this.$nextTick( () => {
				if(this.id){
					this.fetchRank();
				}
			})
		}
	}
</script>
<style scoped>
.goodsContent{
	min-height:500px;
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
.query{
	border-bottom:1px solid #ccc;
	padding:5px;
	width:100%;
	height:30px;
	color:#409EFF;
}
.searchBar,.searchBar1{
	display: -webkit-box;
	align-content: space-between;
	align-items: center;
	width:300px;
	margin-right:20px;
	height:100px;
}
.searchBar1{
	margin-bottom:70px;
}
.statusSelect{
	margin-right:20px;
}
.mandatory{
	color:#ccc;
	margin-left:20px;
}
.uploadDemo .el-upload-dragger{
    width:250px;
    height:158px;
}
.avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
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
</style>
