<template>
  <div class="page">
    <div class="section query">
      <div class="section-title">
        <span>网卡设置</span>
        <el-button
          class="operate-btn"
					size="small"
          type="primary"
          @click="handleSaveInterfaceClick"
          >保存设置</el-button
        >
      </div>
      <div class="list-table" v-loading="isFetchingData">
        <el-table :data="tableData" border v-loading="isLoading">
          <el-table-column label="接口名称" prop="interface">
          </el-table-column>
          <el-table-column label="IP地址" prop="">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ip" placeholder=""></el-input>
            </template>
          </el-table-column>
          <el-table-column label="子网掩码" prop="">
            <template slot-scope="scope">
              <el-select v-model="scope.row.mask" placeholder="">
								<el-option v-for="item in maskOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="section list">
      <div class="section-title">
        <span>路由设置</span>
				<el-button class="operate-btn" 
					size="small" type="primary" @click="handleSaveRouteClick"
            >保存设置</el-button>
      </div>
      <el-form
        width="600px"
        :model="routeForm"
        :rules="routeRules"
        ref="routeForm"
        label-width="120px"
      >
        <el-form-item label="目的地址" prop="destipaddr">
          <el-input v-model="routeForm.destipaddr"></el-input>
        </el-form-item>
        <el-form-item label="目的掩码" prop="destmask">
          <el-input v-model="routeForm.destmask"></el-input>
        </el-form-item>
        <el-form-item label="下一跳地址" prop="nexthopip">
          <el-input v-model="routeForm.nexthopip"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import searchImg from 'assets/sousuo.png'
import listImg from 'assets/list.png'
import { judgeGender, deepCopy, commonExport } from 'common/utils'

export default {
	data() {
		return {
			dialogShow: false,
			routeForm: {
				destipaddr: '',
				destmask: '',
				nexthopip: ''
			},
			maskOptions: [
				{
					label: '255.255.255.0',
					value: '255.255.255.0'
				},
				{
					label: '255.255.0.0',
					value: '255.255.0.0'
				},
				{
					label: '255.0.0.0',
					value: '255.0.0.0'
				},
				{
					label: '255.255.255.254',
					value: '255.255.255.254'
				},
				{
					label: '255.255.255.252',
					value: '255.255.255.252'
				},
				{
					label: '255.255.255.248',
					value: '255.255.255.248'
				},
				{
					label: '255.255.255.240',
					value: '255.255.255.240'
				},
				{
					label: '255.255.255.224',
					value: '255.255.255.224'
				},
				{
					label: '255.255.255.192',
					value: '255.255.255.192'
				},
				{
					label: '255.255.255.128',
					value: '255.255.255.128'
				},
				{
					label: '255.255.254.0',
					value: '255.255.254.0'
				},
				{
					label: '255.255.252.0',
					value: '255.255.252.0'
				},
				{
					label: '255.255.248.0',
					value: '255.255.248.0'
				},
				{
					label: '255.255.240.0',
					value: '255.255.240.0'
				},
				{
					label: '255.255.224.0',
					value: '255.255.224.0'
				},
				{
					label: '255.255.192.0',
					value: '255.255.192.0'
				},
				{
					label: '255.255.128.0',
					value: '255.255.128.0'
				},
				{
					label: '255.254.0.0',
					value: '255.254.0.0'
				},
				{
					label: '255.252.0.0',
					value: '255.252.0.0'
				},
				{
					label: '255.248.0.0',
					value: '255.248.0.0'
				},
				{
					label: '255.240.0.0',
					value: '255.240.0.0'
				},
				{
					label: '255.224.0.0',
					value: '255.224.0.0'
				},
				{
					label: '255.192.0.0',
					value: '255.192.0.0'
				},
				{
					label: '255.128.0.0',
					value: '255.128.0.0'
				},
				{
					label: '254.0.0.0',
					value: '254.0.0.0'
				},
				{
					label: '252.0.0.0',
					value: '252.0.0.0'
				},
				{
					label: '248.0.0.0',
					value: '248.0.0.0'
				},
				{
					label: '240.0.0.0',
					value: '240.0.0.0'
				},
				{
					label: '224.0.0.0',
					value: '224.0.0.0'
				},
				{
					label: '192.0.0.0',
					value: '192.0.0.0'
				},
				{
					label: '128.0.0.0',
					value: '128.0.0.0'
				},
			],
			ipForm: {
				interface: '',
				ip: '',
				mask: ''
			},
			routeRules: {
				destipaddr: [
					{ required: true, message: '请输入目的地址', trigger: 'blur' }
				],
				destmask: [
					{ required: true, message: '请输入目的掩码', trigger: 'blur' }
				],
				nexthopip: [
					{ required: true, message: '请输入下一跳地址', trigger: 'blur' }
				],
			},
		    isLoading:false,
			tableData: [],
			isFetchingData:false,
		}
	},
	created() {
		this.getInterfaceConfig();
		this.getRouteConfig();
	},
	methods: {
		handleSaveInterfaceClick() {
			this.$confirm('确认要修改管理口配置吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message.success('设置成功，请使用新IP重新登录');
				this.saveInterfaceConfig();
			}).catch(() => {
               
			});
		},
		async saveInterfaceConfig() {
			
			let content = '';
			let tmpStr = '';

            
			this.tableData.forEach(item => {
				tmpStr = item.interface + ',' + item.ip + ',' + item.mask + ';';
				content += tmpStr;
			})
         
			const params = {
				isge: 1,
				content: content
			};
             this.isLoading = true;
			const data = await this.postFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!configInterface.action",
				params: params,
				vm: this
			});
			  this.isLoading = false;
               
			if (data.state === 1) {
				this.$message.success('设置成功，请使用新IP重新登录');
			} else {
				this.$message.error('保存失败，请稍后再试！');
			}
		},
		async getInterfaceConfig() {
			this.tableData = [];
			const data = await this.getFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!loadConfigInterface.action",
				vm: this
			});

			if (Array.isArray(data)) {
				data.forEach(item => {
					if (item.length > 2) {
						this.tableData.push({
							interface: item[0],
							ip: item[1],
							mask: item[2]
						})
					}
				});
			}
		},
		handleSaveRouteClick() {
			this.$refs['routeForm'].validate(valid => {
				if (!valid) return;
				this.saveConfig();
			})
		},
		async saveConfig() {
			const data = await this.postFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!configRoute.action",
				params: this.routeForm,
				vm: this
			});

			if (data.state === 1) {
				this.$message.success('保存成功！');
			} else {
				this.$message.error('保存失败，请稍后再试！');
			}
		},
		async getRouteConfig() {
			const data = await this.getFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!loadConfigRoute.action",
				vm: this
			});

			this.routeForm = Object.assign({}, this.routeForm, data);
		}
	}
}
</script>
<style lang="less" scoped>
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
    .el-form {
      width: 60%;
    }
  }
}

.section-title {
  position: relative;
  margin-bottom: 18px;
  padding: 5px;
  height: 35px;
  color: @blue;
  border-bottom: 1px solid #ccc;
  .operate-btn {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}

.list-title {
  height: 50px;
  color: @blue;
  .icon {
    float: left;
    width: 22px;
    margin: -1px 8px 0 0;
  }
  .btn-wrapper {
    margin-top: -5px;
  }
}
</style>
