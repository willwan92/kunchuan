<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" class="query-form" label-width="75px">
        <el-form-item label="项目名称">
          <el-cascader
            @change="fetchTableData"
            :show-all-levels="false"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="" class="">
          <el-button
            :disabled="!getPjId"
            type="primary"
            @click="handleAddClick"
            >添加资产</el-button
          >
        </el-form-item>

        <el-form-item label="">
          <el-upload
            action="#"
            :disabled="!getPjId || isUploadLoading"
            :before-upload="beforeUpload">
            <el-button :loading="isUploadLoading" type="primary" 
              :disabled="!getPjId || isUploadLoading">
              {{ isUploadLoading ? '正在导入':'导入资产'}}
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="">
          <el-button
            type="primary"
            :disabled="!getPjId"
            @click="handleExportClick"
            >导出资产</el-button
          >
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="序号" prop="num"  width="50px"></el-table-column>
        <el-table-column label="IP地址/资产标识" prop="ip"  width="130px"></el-table-column>
        <el-table-column label="登录方式" prop="loginMethod"></el-table-column>
        <el-table-column label="端口" prop="port"></el-table-column>
        <el-table-column label="资产类型" prop="assetsType"></el-table-column>
        <el-table-column label="厂家名称" prop="vendorName"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="备注" prop="comments"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="handleDelClick(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="actionName + '资产'"
        :visible.sync="dialogShow"
        width="600px"
        @close="dialogShow = false"
      >
        <el-form
          v-loading="isUpdate"
          :model="dialogForm"
          class="dialog-form"
          ref="dialogForm"
          label-width="100px"
        >
          <el-form-item label="IP/资产标识" prop="ip">
            <el-input v-model="dialogForm.ip" :readonly="Boolean(assetsId)"></el-input>
          </el-form-item>
          <el-form-item label="登录方式" prop="loginMethod">
            <el-select v-model="dialogForm.loginMethod" placeholder="">
              <el-option
                v-for="item in loginMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="dialogForm.port"></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetsType">
            <el-select v-model="dialogForm.assetsType" placeholder="">
              <el-option
                v-for="item in assetsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家名称" prop="vendorName">
            <el-select v-model="dialogForm.vendorName" placeholder="">
              <el-option
                v-for="item in vendorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号" prop="deviceNum">
            <el-input v-model="dialogForm.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="dialogForm.version"></el-input>
          </el-form-item>
          <el-form-item label="操作系统" prop="deviceOs">
            <el-select v-model="dialogForm.deviceOs" placeholder="">
              <el-option
                v-for="item in deviceOsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="comments">
            <el-input v-model="dialogForm.comments"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="dialogForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input type="password" v-model="dialogForm.password"></el-input>
          </el-form-item>
          <el-form-item label="su用户名" prop="suUserName">
            <el-input v-model="dialogForm.suUserName"></el-input>
          </el-form-item>
          <el-form-item label="su密码" prop="suPassword">
            <el-input type="password" v-model="dialogForm.suPassword"></el-input>
          </el-form-item>
          <el-form-item label="数据库路径" prop="databasePath">
            <el-input v-model="dialogForm.databasePath"></el-input>
          </el-form-item>
          <el-form-item label="数据库账号" prop="databaseAccount">
            <el-input v-model="dialogForm.databaseAccount"></el-input>
          </el-form-item>
          <el-form-item label="数据库口令" prop="databasePassword">
            <el-input type="password" v-model="dialogForm.databasePassword"></el-input>
          </el-form-item>
          <el-form-item label="数据库实例" prop="databaseInstance">
            <el-input v-model="dialogForm.databaseInstance"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button :disabled="isUpdate" @click="dialogShow = false">取 消</el-button>
          <el-button :disabled="isUpdate" type="primary" @click="handleConfirmClick"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkIp, getCascaderOptions, downloadFileByUrl, checkFileType, isBase64, formatTreeData } from "common/utils";
import { API_URL, FUZZ_URL, axiosUploadFuzz } from "common/axiosClient";

export default {
  data() {
    // var validateIp = (rule, value, callback) => {
    //   if (value === "") {
    //     callback();
    //   } else if (!checkIp(value)) {
    //     callback(new Error("请输入合法的IP地址"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isUploadLoading:false,
      assetsId: "",
      isLoading:false,
      isUpdate: false,
      dialogShow: false,
      pjValue: [],
      loginMethodOptions: [
        {
          label: "请选择",
          value: ""
        },
        {
          label: "ssh",
          value: "ssh"
        },
        {
          label: "telnet",
          value: "telnet"
        }
      ],
      deviceOsOptions: [
        {
          label: "请选择",
          value: ""
        }
      ],
      assetsTypeOptions: [
        {
          label: "请选择",
          value: ""
        }
      ],
      vendorOptions: [
        {
          label: "请选择",
          value: ""
        }
      ],
      dialogForm: {
        ip: "",
        loginMethod: "",
        port: "",
        assetsType: "",
        vendorName: "",
        deviceNum: "",
        version: "",
        deviceOs: "",
        userName: "",
        password: "",
        suUserName: "",
        suPassword: "",
        databasePath: "",
        databaseAccount: "",
        databasePassword: "",
        databaseInstance: "",
        comments: ""
      },
      pjOptions: null,
      tableData: []
    };
  },
  created() {
    this.fetchPjTreeData();
    this.initData();
  },
  computed: {
    getPjId() {
      let id;
      if (this.pjValue && this.pjValue[0]) {
        id = this.pjValue.slice(-1)[0];
      } else {
        id = null;
      }

      return id;
    },
    actionName() {
      return this.assetsId ? "编辑" : "添加";
    },
    uploadAssetsUrl() {
      return `${FUZZ_URL}/fuzz/page/view/station/device!addDeviceImport.action`;
    }
  },
  methods: {
    beforeUpload(file) {
      if (!checkFileType(file, ['.xls', '.xlsx'])) {
        this.$message.error('上传文件类型错误，只能上传".xlsx"或".xls"文件！');
        return false;
      }
      
      this.uploadFile(file);
      return false;
    },
    async uploadFile(file) {
      let params = new FormData();
      params.append('pjid', this.getPjId);
      params.append('fn', file.name);
      params.append('filename', file);
       
      this.isUploadLoading = true;
      const {data} = await axiosUploadFuzz.post("/fuzz/page/view/station/device!addDeviceImport.action", params);
      this.isUploadLoading = false;

      if  (data && data.state === 1) {
				this.$message.success("导入资产成功");
				this.fetchTableData();
			} else {
				this.$message.error("导入资产成功失败，请稍后再试")
			}
    },
    initData() {
      this.fetchAssetsTypeData();
      this.fetchVendorsData();
      this.fetchOsData();
    },
    async fetchPjTreeData() {
			const roleId = sessionStorage.getItem('roleId');

      const data = await this.post({
				url: "/projectInfo/getEnableRole",
				params: {
					enablerole: `(${roleId})`
				},
        vm: this
      });

			const treeData = formatTreeData(data, 0);

      this.pjOptions = getCascaderOptions({
        arr: treeData,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
    async fetchTableData() {
      const pjId = this.getPjId;

      if (!pjId) {
        this.$message.info("请选择项目");
        return;
      }
      this.isLoading = true;
      const { data } = await this.getFuzz({
        url: "/fuzz/page/view/station/device!getAssetsListByPjID.action",
        params: {
          pjid: pjId
        },
        vm: this
      });
      this.isLoading = false;
      this.tableData = data.map(item => {
        return {
          num: item[0],
          id: item[10],
          ip: item[1],
          loginMethod: item[2],
          port: item[3],
          assetsType: item[4],
          vendorName: item[5],
          deviceNum: item[6],
          version: item[7],
          deviceOs: item[8],
          comments: item[11]
        };
      });
    },
    async fetchAssetsTypeData() {
      const { data } = await this.getFuzz({
        url: "/fuzz/page/view/station/device!findAllDevtype.action",
        vm: this
      });

      data.forEach((item, index) => {
        this.assetsTypeOptions.push({
          label: item.devtype,
          value: item.devtype
        });
      });
    },
    decode(str) {
      if (isBase64(str)) {
        return atob(atob(str));
      }
    },
    async fetchVendorsData() {
      const { data } = await this.getFuzz({
        url: "/fuzz/page/view/station/device!findVendorByType.action",
        params: {
          devtype: ""
        },
        vm: this
      });

      data.forEach((item, index) => {
        this.vendorOptions.push({
          label: item.vendor,
          value: item.vendor
        });
      });
    },
    async fetchOsData() {
      const { list } = await this.getFuzz({
        url: "/fuzz/page/view/station/device!loadOsDatas.action",
        vm: this
      });

      list.forEach((item, index) => {
        this.deviceOsOptions.push({
          label: item,
          value: item
        });
      });
    },
    async saveAsset() {
      let form = this.dialogForm;
      let action;

      const params = {
        pjid: this.getPjId,
        deviceip: form.ip,
        deviceport: form.port,
        deviceEname: form.vendorName,
        deviceSname: form.deviceNum,
        devicenum: form.version,
        devicelist: form.assetsType,
        deviceos: form.deviceOs,
        description: form.comments,
        devicelogin: form.loginMethod,
        deviceusr: form.userName,
        devicepass: btoa(btoa(form.password)),
        suUserName: form.suUserName,
        suPassword: btoa(btoa(form.suPassword)),
        databasePath: form.databasePath,
        databaseAccount: form.databaseAccount,
        databasePassword: btoa(btoa(form.databasePassword)),
        databaseInstance: form.databaseInstance
      };

      if (this.assetsId) {
        action = "editdevice.action";
        params.deviceid = this.assetsId;
      } else {
        action = "adddevice.action";
      }

      this.isUpdate = true;
      const data = await this.getFuzz({
        url: `/fuzz/page/view/station/device!${action}`,
        params: params,
        vm: this
      });

      this.isUpdate = false;
      if (data.state === 1) {
        this.$message.success(`${this.actionName}成功！`);
        this.dialogShow = false;
        this.fetchTableData();
      } else {
        this.$message.error(`${this.actionName}失败，请检查IP是否已经存在。`);
      }
    },
    handleConfirmClick() {
      if (this.assetsId) {
        // 编辑时不再验证ip
        this.saveAsset();
      } else {
        if (this.dialogForm.ip !== '' && !checkIp(this.dialogForm.ip)) {
          this.$message.warning('请输入合法的IP')
        } else {
          this.saveAsset();
        }
      }
    },
    handleAddClick() {
      this.resetForm("dialogForm");
      this.assetsId = '';
      this.dialogShow = true;
    },
    handleExportClick() {
      const url = `${API_URL}/export/getExport?pjid=${this.getPjId}`;
      downloadFileByUrl(url);
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    async handleEditClick(id) {
      this.assetsId = id;
      this.dialogShow = true;
      const { data } = await this.getFuzz({
        url: "/fuzz/page/view/station/device!getAssetsListByDevID.action",
        params: { deviceid: id },
        vm: this
      });
      const assetData = data[0];
      const formData = {
        ip: assetData[0],
        loginMethod: assetData[1],
        port: assetData[2],
        assetsType: assetData[3],
        vendorName: assetData[4],
        deviceNum: assetData[5],
        version: assetData[6],
        deviceOs: assetData[7],
        userName: assetData[9],
        password: this.decode(assetData[10]),
        suUserName: assetData[11],
        suPassword: this.decode(assetData[12]),
        databasePath: assetData[13],
        databaseAccount: assetData[14],
        databasePassword: this.decode(assetData[15]),
        databaseInstance: assetData[16],
      };

      this.dialogForm = Object.assign({}, this.dialogForm, formData);
    },
    async handleDelClick(id) {
      const data = await this.getFuzz({
        url: "/fuzz/page/view/station/device!deldevice.action",
        params: { deviceid: id },
        vm: this
      });
      if (data.state === 1) {
        this.$message.success("删除成功！");
        this.fetchTableData();
      }
    }
  }
};
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
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}

.dialog-form {
  width: 550px;
  padding-right: 50px;
  height: 600px;
  overflow: auto;
}

.query-form {
  position: relative;
  width: 100%;
  .add-btn {
    position: absolute;
    right: -30px;
  }
}


</style>
