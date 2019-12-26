<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="项目名称">
          <el-cascader
            :show-all-levels="false"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchTableData">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button
            class="btn-lg"
            :disabled="!this.getPjId"
            type="primary"
            @click="dialogShow = true"
            >添加资产</el-button
          >
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column label="序号" prop="num"></el-table-column>
        <el-table-column label="IP地址/资产标识" prop="ip"></el-table-column>
        <el-table-column label="登录方式" prop="loginMethod"></el-table-column>
        <el-table-column label="端口" prop="port"></el-table-column>
        <el-table-column label="资产类型" prop="assetsType"></el-table-column>
        <el-table-column label="厂家名称" prop="vendorName"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="操作">
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
          :model="form"
          :rules="rules"
          class="dialog-form"
          ref="form"
          label-width="100px"
        >
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="form.ip" :readonly="this.assetsId"></el-input>
          </el-form-item>
          <el-form-item label="登录方式">
            <el-select v-model="form.loginMethod" placeholder="">
              <el-option
                v-for="item in loginMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="form.port"></el-input>
          </el-form-item>
          <el-form-item label="资产类型">
            <el-select v-model="form.assetsType" placeholder="">
              <el-option
                v-for="item in assetsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家名称">
            <el-select v-model="form.vendorName" placeholder="">
              <el-option
                v-for="item in vendorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="form.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="form.version"></el-input>
          </el-form-item>
          <el-form-item label="操作系统">
            <el-select v-model="form.deviceOs" placeholder="">
              <el-option
                v-for="item in deviceOsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="su用户名">
            <el-input v-model="form.suUserName"></el-input>
          </el-form-item>
          <el-form-item label="su密码">
            <el-input v-model="form.suPassword"></el-input>
          </el-form-item>
          <el-form-item label="数据库路径">
            <el-input v-model="form.databasePath"></el-input>
          </el-form-item>
          <el-form-item label="数据库账号">
            <el-input v-model="form.databaseAccount"></el-input>
          </el-form-item>
          <el-form-item label="数据库口令">
            <el-input v-model="form.databasePassword"></el-input>
          </el-form-item>
          <el-form-item label="数据库实例">
            <el-input v-model="form.databaseInstance"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmClick"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkIp } from "common/utils";

export default {
  data() {
    var validateIp = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (!checkIp(value)) {
        callback(new Error("请输入合法的IP地址"));
      } else {
        callback();
      }
    };
    return {
      assetsId: "",
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
      form: {
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
        databaseInstance: ""
      },
      rules: {
        ip: [{ validator: validateIp, trigger: "blur" }]
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
    }
  },
  methods: {
    initData() {
      this.fetchAssetsTypeData();
      this.fetchVendorsData();
      this.fetchOsData();
    },
    async fetchTableData() {
      const pjId = this.getPjId;

      if (!pjId) {
        this.$message.info("请选择项目");
        return;
      }

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/station/device!getAssetsListByPjID.action",
        params: {
          pjid: pjId
        },
        vm: this
      });

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
          deviceOs: item[8]
        };
      });
    },
    async fetchAssetsTypeData() {
      const { data } = await this.fetchFuzz({
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
    async fetchVendorsData() {
      const { data } = await this.fetchFuzz({
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
      const { list } = await this.fetchFuzz({
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
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });
      this.pjOptions = this.traverseArr(data);
    },
    traverseArr(arr) {
      let tmpArr = [];
      let tmpObj = {};

      arr.forEach((item, index) => {
        tmpObj = {
          label: item.pjname,
          value: item.id
        };

        if (item.children && item.children[0]) {
          tmpObj.children = this.traverseArr(item.children);
          tmpArr.push(tmpObj);
        } else {
          if (item.isleaf) {
            tmpArr.push(tmpObj);
          }
        }
      });

      return tmpArr;
    },
    async saveAsset() {
      let form = this.form;
      const action = this.assetsId ? "editdevice.action" : "adddevice.action";

      const params = {
        pjid: this.getPjId,
        deviceip: form.ip,
        deviceport: form.port,
        deviceEname: form.vendorName,
        deviceSname: form.deviceNum,
        devicenum: form.version,
        devicelist: form.assetsType,
        deviceos: form.deviceOs,
        devicelogin: form.loginMethod,
        deviceusr: form.userName,
        devicepass: form.password,
        suUserName: form.suUserName,
        suPassword: form.suPassword,
        databasePath: form.databasePath,
        databaseAccount: form.databaseAccount,
        databasePassword: form.databasePassword,
        databaseInstance: form.databaseInstance
      };

      const data = await this.fetchFuzz({
        url: `/fuzz/page/view/station/device!${action}`,
        params: params,
        vm: this
      });

      if (data.state === 1) {
        this.$message.success(`${this.actionName}成功！`);
        this.dialogShow = false;
        this.fetchTableData();
      }
    },
    handleConfirmClick() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.saveAsset();
        }
      });
    },
    async handleAddClick() {
      this.resetForm("form");
      this.dialogShow = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async handleEditClick(id) {
      this.assetsId = id;
      this.dialogShow = true;
      const { data } = await this.fetchFuzz({
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
        deviceusr: assetData[9],
        devicepass: assetData[10],
        suUserName: assetData[11],
        suPassword: assetData[12],
        databasePath: assetData[13],
        databaseAccount: assetData[15],
        databasePassword: assetData[16],
        databaseInstance: assetData[13],
      }

      this.form = Object.assign({}, this.form, formData);

      console.log(formData)
      //   if (data === 1) {
      //   	this.$message.success('修改成功！');
      //   	this.fetchTableData();
      //   }
    },
    async handleDelClick(id) {
      const data = await this.fetchFuzz({
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
</style>
