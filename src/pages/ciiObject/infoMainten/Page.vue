<template>
	<div class="page">
		<div class="section">
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="主机类资产" name="1">
					</el-tab-pane>
					<el-tab-pane label="网络类资产" name="2">
					</el-tab-pane>
					<el-tab-pane label="数据类资产" name="3">
					</el-tab-pane>
				</el-tabs>
			</div>
			<el-table :data="tableData" border>
				<el-table-column label="序号" prop="id"></el-table-column>
				<el-table-column label="IP地址" prop="IPaddress"></el-table-column>
				<el-table-column label="资产类型" prop="AssetType"></el-table-column>
				<el-table-column label="设备型号" prop="EquipmentModel"></el-table-column>
				<el-table-column label="版本号" prop="version"></el-table-column>
				<el-table-column label="操作系统" prop="system"></el-table-column>
				<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
				<el-table-column label="选中">
					<template slot-scope="scope">
						<el-checkbox v-model="checked"></el-checkbox>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="section list">
			<div class="query-title">
				<span>主机类资产</span>
			</div>
			<el-form width="600px" label-width="110px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="IP地址2：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="MAC地址2：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="功能简述：" prop="">
							<el-col :span="22">
								<el-input type="textarea"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="IP地址3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="MAC地址3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="软件安装情况：" prop="">
							<el-col :span="22">
								<el-input type="textarea" v-model="form.desc"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="部署位置3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="投入使用时间：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>
		</div>
		<div class="section list">
			<div class="query-title">
				<span>网络类资产</span>
			</div>
			<el-form width="600px" label-width="110px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="IP地址2：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="MAC地址2：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="功能简述：" prop="">
							<el-col :span="22">
								<el-input type="textarea"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="IP地址3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="MAC地址3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="部署位置3：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="投入使用时间：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
						<el-col :span="8">
						<el-form-item label="软件版本号：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>
		</div>
		<div class="section list">
			<div class="query-title">
				<span>数据类资产</span>
			</div>
			<el-form width="600px" label-width="110px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="存储位置：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="占用空间：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="功能简述：" prop="">
							<el-col :span="22">
								<el-input type="textarea"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="版本号：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="最终更新时间：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="打开方式：" prop="">
							<el-col :span="22">
								<el-input placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      tabName: "",
      tableData: [],
      checked: false,
      form: {}
    };
  },
  methods: {
    handleClick() {}
  }
};
</script>
<style lang="less" scoped>
.section {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  color: #409eff;
}
.section:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tabs-wrapper {
  position: relative;
  .btn {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

.query-title {
  margin-bottom: 30px;
  padding: 5px;
  height: 35px;
  color: @blue;
  border-bottom: 1px solid #ccc;
  .icon {
    float: left;
    width: 22px;
    margin: -1px 8px 0 0;
  }
}
</style>
