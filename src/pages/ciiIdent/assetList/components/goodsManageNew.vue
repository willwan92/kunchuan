<template>
	<div class="goodsPage">
		<div class="goodsContent" v-loading="isLoading">
			<div class="query">
				<span v-if="this.isCreate == 1">新增商品</span>
				<span v-if="this.isCreate == 2">编辑商品</span>
			</div>
			<div class="searchBar">
				<div class="statusSelect">关联商品:</div>
				<el-select v-model="goodsAssociated" placeholder="请选择需关联BRM的商品" style="width:300px">
					<el-option v-for="item in associated" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<div class="mandatory">(*必填)</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">商品名称:</div>
				<el-input placeholder="请输入商品名称，最多10个字。" v-model="goodsName" style="width:300px">
				</el-input>
				<div class="mandatory">(*必填)</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">商品副标:</div>
				<el-input placeholder="请输入商品副标题，最多20个字。" v-model="goodsSecondary" style="width:300px">
				</el-input>
				<div class="mandatory">(*必填)</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">商品原价:</div>
				<el-input placeholder="请输入，如：100.00。" v-model="goodsOriginal" style="width:180px">
				</el-input>
				<div class="space">元</div>
				<div class="statusSelect">单买价格:</div>
				<el-input placeholder="请输入，如：90.00。" v-model="goodsSingle" style="width:180px">
				</el-input>
				<div class="space">元</div>
				<div class="statusSelect">拼团价格:</div>
				<el-input placeholder="请输入，如：60.00。" v-model="goodsSpell" style="width:180px">
				</el-input>
				<div class="space">元</div>
				<div class="mandatory">(*必填)</div>
			</div>
			<div class="searchBar">
				<div style="width:68px;"></div>
				<div class="instructions">
				说明：1. 商品原价非售卖价格，仅作展示用；2. 单买价格是用户选择单独购买的商品价格；3. 拼团价格是用户选择拼团购买的商品价格。
				</div>
			</div>
			<div class="rules">
				<div style="width:68px;"></div>
				<div class="instructions">规则：商品原价 > 单买价格 > 拼团价格。</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">拼团限购:</div>
				<el-input placeholder="请输入" v-model="purchasing" style="width:180px">
				</el-input>
				<div class="instructions">(*必填)  说明：默认999件/次；如需限制拼团时每次购买件数，请重新输入</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">物流保价:</div>
				<el-input placeholder="请输入，如：100.00" v-model="logistics" style="width:180px">
				</el-input>
				<div class="space">元</div>
				<div class="instructions">(*必填，如需要请填入对应金额，按每件商品计算此费用)</div>
			</div>
			<div class="searchBar">
				<div class="statusSelect">成团人数:</div>
				<el-select v-model="cloudsNumber" placeholder="请选择" style="width:180px">
					<el-option v-for="item in cloudsNumberList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<div class="instructions">说明：默认已选择2人；拼团人数限制最少2人，最大5人。</div>
			</div>
			<div class="searchBar1">
				<div class="statusSelect">商品图片:</div>
        <div class="imgClass">
					<div class="inMargin">(最少1张，最多8张)</div>
					<el-upload class="uploadDemo" :action="uploadUrl()" :headers="myHeaders" list-type="picture-card" :on-success="successUpload" :on-remove="goodsFailedUpload"  :before-upload="beforeAvatarUpload" :file-list="fileList" :on-preview="handlePictureCardPreview" :limit='8' :on-progress = 'onProgress' :disabled="disabledNew">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="advertisementPic">
					</el-dialog>
					<div class="inMargin1">(*必填，图片像素 300 x 100)</div>
				</div>
			</div>
			<div class="searchBar2">
				<div class="statusSelect">商品详情:</div>
				<div>
					<div class="inMargin" style="color:#ccc;">*必填，可编写图文内容</div>
					<UE :defaultMsg='defaultMsg' :config = 'config' ref="ue"></UE>
				</div>
			</div>
			<div class="shareBar">
				<div class="statusSelect">分享内文:</div>
				<div>
					<el-input type = "textarea" :rows="5" placeholder="请输入分享商品的文字介绍，最多50个字。" v-model="share" style="width:400px">
					</el-input>
					<div class="instructions1">说明：选填；对应修改右侧图片内灰色文字部分。</div>
				</div>
				<div><img :src="wine" alt=""></div>
			</div>
			<div class="searchBar" style="height:100px;">
				<div class="statusSelect">是否上架:</div>
				<el-radio v-model="frame" label = '1'>上架</el-radio>
  				<el-radio v-model="frame" label = '0'>不上架</el-radio>
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
	import wine from 'assets/wine.jpg'
	import {uploadFileApi} from 'common/axiosClient'
	export default {
		data() {
			return {
				wine,
				associated:[
					{
						value: 'all',
						label: '所有'
					},
				],//关联商品
				goodsAssociated:'',//关联商品
				goodsName:'',//商品名称
				goodsSecondary:'',//商品副标
				goodsOriginal:'',//商品原价
				goodsSingle:'',//单买价格
				goodsSpell:'',//拼团价格
				purchasing:'999',//拼团限购
				logistics:'',//物流保价
				cloudsNumberList:[
					{
						value: '2',
						label: '2人'
					},
					{
						value: '3',
						label: '3人'
					},
					{
						value: '4',
						label: '4人'
					},
					{
						value: '5',
						label: '5人'
					},
				],//成团人数
				cloudsNumber:'2',//成团人数
				isUploading: false,
				advertisementPic: '',
				frame: '1',//上/下架
				isLoading:false,
				rank:'',
				fileList:[],//照片
				share:'',//分享介绍
				dialogVisible:false,
				disabledNew:false,
				advertisementPicList:[],
				defaultMsg:'',
				config: {
					initialFrameWidth: 774,
					initialFrameHeight: 200
				},
			}
		},
		components: {
		},
		computed:{
			isCreate(){
				return this.$route.query.isCreate;
			},
			id(){
				return this.$route.query.id;
			},
			goodsImgs() {
				let imgs = [];
				let list = JSON.parse(JSON.stringify(this.advertisementPicList));
				list.forEach((item, index) => {
					imgs.push(item.url);
				});
				let str = imgs.join(',');
				return str;
			},
			myHeaders(){
        return {
            "Authorization":'Bearer ' + sessionStorage.getItem('Admin-Token')
				}
			}
		},
		watch: {
			fileList(val) {
				if (val.length > 8) {
					this.$notify.error('最多上传八张图片, 请自行删除');
				}
			},
		},
		methods:{
			uploadUrl(){
				 return uploadFileApi;
			},
			//商品照片
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
				this.advertisementPicList.push({url:this.advertisementPic});
				this.disabledNew = false;
			},
			failedUpload(err, file, filelist) {
				this.$notify.error('文件上传失败, 请重新上传');
				this.isUploading = false;
			},
			handlePictureCardPreview(file){
				this.dialogVisible = true;
			},
			onProgress(){
				if(!this.disabledNew){
					this.disabledNew = true;
					this.$notify.info('请等此图片上传完毕后，再上传其他图片！');
				}
			},
			goodsFailedUpload(file, filelist) {
				this.fileList = filelist;
				this.advertisementPicList = this.fileList;
			},
			//编辑获取数据
			fetchRank() {
				let params = {};
				params.id = this.id;
				this.isLoading = true;
				getGoodsEditor(params).then( (res) => {
					if (res.data.code === 2000000 && res.data.data) {
						this.rank = res.data.data;
						this.goodsAssociated = this.rank.adName;
						this.goodsName = this.rank.name;
						this.goodsSecondary = this.rank.summary;
						this.goodsOriginal = (this.rank.price / 100).toFixed(2);
						this.goodsSingle = (this.rank.singlePrice / 100).toFixed(2);
						this.goodsSpell = (this.rank.groupPrice / 100).toFixed(2);
						this.purchasing = this.rank.maxcount;
						this.logistics = (this.rank.logisticsPrice / 100).toFixed(2);
						this.cloudsNumber = this.rank.groupManCount;
						this.defaultMsg = this.rank.description;
						this.advertisementPic = this.rank.goodsBannerList;
						this.advertisementPic.forEach( (item, index) => {
							this.fileList.push({
								url:item
							});
							this.advertisementPicList.push({
								url:item
							})
						});
						// this.advertisementPic = this.rank.goodsBannerList;
						this.share = this.rank.shareContent;
						this.frame = (this.rank.status).toString();
					}
					this.isLoading = false;
				}).catch( () => {
					this.isLoading = false;
				})
			},
			//取消
			cancel(){
				this.$router.back(-1);
			},
			//提交 保存数据
			submit(){
				this.defaultMsg = this.$refs.ue.getUEContent();
				let paramy ={
					// goodsAssociated:this.goodsAssociated,
					name:this.goodsName,
					summary:this.goodsSecondary,
					price:(this.goodsOriginal * 100),
					singlePrice:(this.goodsSingle * 100),
					groupPrice:(this.goodsSpell * 100),
					maxcount:this.purchasing,
					logisticsPrice:(this.logistics * 100),
					groupManCount:this.cloudsNumber,
					urls:this.goodsImgs,
					description:this.defaultMsg,
					shareContent:this.share,
					status:this.frame,
				}
				if (this.isCreate == 2) {
					paramy.id = this.id;
					// if(this.goodsAssociated == ''){
					// 	this.$notify.error('请选择需关联BRM的商品');
					// }else 
					if(this.goodsName == ''){
						this.$notify.error('请输入商品名称');
					}else if(this.goodsSecondary == ''){
						this.$notify.error('请输入商品副标题');
					}else if(this.goodsOriginal == ''){
						this.$notify.error('请输入商品原价');
					}else if(this.goodsSingle == ''){
						this.$notify.error('请输入单买价格');
					}else if(this.goodsSpell == ''){
						this.$notify.error('请输入拼团价格');
					}else if(this.logistics == ''){
						this.$notify.error('请输入物流保价');
					}else if(this.defaultMsg == ''){
            this.$notify.error('请输入商品详情');
        	}else if(this.share == ''){
						this.$notify.error('请输入分享商品的文字介绍');
					}else if(this.goodsImgs == ''){
						this.$notify.error('请上传商品图片');
					}else{
						if(this.goodsName.length > 10){
							this.$notify.error('商品名称字数不能多于10个字');
						}else if(this.goodsSecondary.length > 20){
							this.$notify.error('商品副标题字数不能多于20个字');
						}else if(this.share.length > 50){
							this.$notify.error('分享商品的文字介绍字数不能多于50个字');
						}else{
							goodsEditor(paramy).then( (res) => {
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
					// if(this.goodsAssociated == ''){
					// 	this.$notify.error('请选择需关联BRM的商品');
					// }else 
					if(this.goodsName == ''){
						this.$notify.error('请输入商品名称');
					}else if(this.goodsSecondary == ''){
						this.$notify.error('请输入商品副标题');
					}else if(this.goodsOriginal == ''){
						this.$notify.error('请输入商品原价');
					}else if(this.goodsSingle == ''){
						this.$notify.error('请输入单买价格');
					}else if(this.goodsSpell == ''){
						this.$notify.error('请输入拼团价格');
					}else if(this.logistics == ''){
						this.$notify.error('请输入物流保价');
					}else if(this.defaultMsg == ''){
            this.$notify.error('请输入商品详情');
        	}else if(this.share == ''){
						this.$notify.error('请输入分享商品的文字介绍');
					}else if(this.goodsImgs == ''){
						this.$notify.error('请上传商品图片');
					}else{
						if(this.goodsName.length > 10){
							this.$notify.error('商品名称字数不能多于10个字');
						}else if(this.goodsSecondary.length > 20){
							this.$notify.error('商品副标题字数不能多于20个字');
						}else if(this.share.length > 50){
							this.$notify.error('分享商品的文字介绍字数不能多于50个字');
						}else{
							goodsNew(paramy).then( (res) => {
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
				if(this.isCreate == 2){
					this.fetchRank();
				}else{
						this.defaultMsg = '2';
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
.searchBar,.searchBar1,.searchBar2,.shareBar{
	display: -webkit-box;
	align-content: space-between;
	align-items: center;
	width:96%;
	margin:20px;
}
.shareBar{
	height:130px;
}
.rules{
	display: -webkit-box;
	align-content: space-between;
	align-items: center;
	width:300px;
	margin-right:20px;
}
.statusSelect{
	margin-right:20px;
}
.searchBar2{
	height:400px;
}
.space{
	margin:0 30px 0 15px;
}
.mandatory{
	color:#ccc;
	margin-left:20px;
}
.instructions{
	color:#ccc;
	margin-left:20px;
	width:650px;
	line-height:25px;
}
.instructions1{
	color:#ccc;
	width:450px;
	line-height:25px;
	margin-top:5px;
}
.imgClass{
	min-width:1000px;
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
	margin-bottom:20px;
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
.inMargin{
  margin-bottom:10px;
}
.inMargin1{
	margin-top:10px;
	color:#ccc;
}
.uploadDemo .el-upload-dragger{
    width:250px;
    height:158px;
  }
</style>
<style>
.el-upload-list--picture-card .el-upload-list__item-actions span:nth-child(1){
    display:none!important;
}
</style>