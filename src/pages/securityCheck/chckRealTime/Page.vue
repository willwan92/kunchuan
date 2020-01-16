<template>
  <div class="page">
    <div class="section">
      <p>
        <el-button type="primary" size="medium" @click="addTaskFun"
          >添加</el-button
        >
        <el-button type="primary" size="medium" @click="deleteRealTime"
          >删除</el-button
        >
      </p>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        v-loading="isLoadingTask"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="taskname"
          label="任务名称"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="pjname"
          label="项目名称"
          width="100"
        ></el-table-column>
        <el-table-column prop="tasktype" label="类型" width="100">
          <template><span>实时任务</span></template>
        </el-table-column>
        <el-table-column prop="starttime" label="开始时间"></el-table-column>
        <el-table-column prop="endtime" label="结束时间"></el-table-column>
        <el-table-column label="状态/进度">
          <template slot-scope="scope">
            <div v-if="scope.row.level === 1">
              <span v-if="scope.row.progress >= 200">已停止</span>
              <span v-else-if="scope.row.progress < 100">执行中</span>
              <span v-else>等待执行</span>
            </div>
            <div v-else>
              <el-progress
                v-if="scope.row.progress >= 200"
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.progress - 200"
              ></el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.progress"
              ></el-progress>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.level === 1">
              <i
                v-if="scope.row.progress >= 100"
                class="el-icon-video-play icon"
                title="执行核查任务"
                @click="handleClick(scope.row, 'play')"
                style="color: #009688;"
              ></i>
              <i 
                v-else
                class="el-icon-video-pause icon"
                @click="handleClick(scope.row, 'stop')"
                style="color: red;"
              ></i>
            </p>
            <P v-else>
              <i
                title="核查报告"
                class="el-icon-document icon"
                style="color: #009688;"
                @click="openDownload(scope.row)"
              ></i>
            </P>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 核查报告dialog -->
    <el-dialog
      title="核查报告"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="padding: 20px;">
        <div>
          <span style="padding-right: 40px;">报告预览</span>
          <span @click="openHTML" style="cursor: pointer;">预览（html）</span>
        </div>
        <div style="margin-top: 20px;">
          <span style="padding-right: 40px;">报告下载</span>
          <el-select v-model="fileType" placeholder="请选择">
            <el-option label="HTML" value="HTML"></el-option>
            <el-option label="WORD" value="WORD"></el-option>
            <el-option label="PDF" value="PDF"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadReport">下 载</el-button>
      </span>
    </el-dialog>

    <!-- 添加实时任务dialog -->
    <el-dialog title="添加实时任务" :visible.sync="addTask" width="800px">
      <div>
        <el-form
          v-loading="isAdding"
          :model="addTaskForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="addTaskForm.name"
              style="width: 508px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目选择">
            <el-cascader class="width-508"
              :show-all-levels="false"
              :options="pjOptions"
              :props="{ expandTrigger: 'hover' }"
              filterable
              v-model="pjValue"
              @change="getAssetList"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="核查方式">
            <el-select class="width-508" v-model="addTaskForm.type" placeholder="请选择" disabled>
              <el-option label="实时任务" value="1"></el-option>
              <!--<el-option label="公网" value="2"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="策略模板">
            <el-cascader class="width-508"
              filterable
              :options="policyOptions"
              v-model="selectedPolicy"
              @expand-change="handlePolicyExpend"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="资产列表">
            <el-table
              style="max-height: 350px; overflow: auto;"
              v-loading="isLoadingAssets"
              :data="assetList"
              border
              @selection-change="handleSelectionAsset"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                label="资产类型"
                prop="devtype"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="vendor"
                label="厂家名称"
                width="120"
              ></el-table-column>
              <el-table-column prop="name" label="设备名称"></el-table-column>
              <el-table-column prop="ip" label="IP/资产标识"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isAdding" type="primary" @click="submitAddTask">保 存</el-button>
        <el-button :disabled="isAdding" type="primary" @click="addTask = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { FUZZ_URL } from "common/axiosClient";
import {
  getCascaderOptions,
  downloadFileByUrl,
  formatTreeData
} from "common/utils";

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入任务名称"));
      } else {
        this.fetchFuzz({
          url: "/fuzz/page/view/VerificationTasks!findTaskName.action",
          params: { taskname: value },
          vm: this
        }).then(res => {
          console.log(res, "validateName");
          if (res.success === "success") {
            callback();
          } else {
            callback(new Error("任务名称重复"));
          }
        });
      }
    };
    return {
      isAdding: false,
      isLoadingAssets: false,
      policyOptions: [],
      selectedPolicy: [],
      rules: {
        name: [{ required: false, validator: validateName, trigger: ["blur"] }]
      }, // 添加任务任务名称重复验证
      pjOptions: null, // 添加任务项目下拉选择
      pjValue: [],
      assetList: [], // 添加任务资产列表
      assetListItem: {}, // 添加任务资产列表操作数据
      loginTypeList: [], // 登录方式
      devTypeList: [], // 资产类型列表
      vendorList: [], // 厂家名称
      productList: [], // 设备型号
      OSList: [], // 操作系统列表
      tableData: [],
      multipleSelection: [],
      addSelected: [],
      isLoadingTask: false,
      dialogVisible: false, // 下载报告
      addTask: false,
      addTaskForm: {
        name: "",
        type: "1",
      },
      reportTaskId: null, // 下载和预览报告taskid
      fileType: "HTML",
      timer: null // 定时
    };
  },
  mounted() {
    this.getTableData();
    this.getPolicyOptionsData();
    this.getPjOptions();
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
    }
  },
  methods: {
    /**
     * 策略模板展开事件
     */
    handlePolicyExpend(nodeArr) {
      if (nodeArr.length !== 2) return;
      
      const groupId = nodeArr[1];
      const currentNode = this.policyOptions[0].children[groupId - 2];

      if (!currentNode.children.length) {
        const childrenData = [];
        this.postFuzz({
          url: 'fuzz/page/view/checkmanage/strategy!searchTypeBygroupid.action',
          params: {group_id: groupId, start: 0}, vm: this
        }).then(res => {
          const data = res.reu;
          if (Array.isArray(data)) {
            currentNode.children = data.map((item, index) => {
              return {
                label: item[1],
                value: item[4]
              }
            })
          }
        })
      }

    },
    /**
     * 点击添加按钮
     */
    addTaskFun() {
      this.addTask = true;
      this.resetTaskForm();
    },

    resetTaskForm() {
      this.pjValue = [];
      this.selectedPolicy = [];
      this.addTaskForm.name = '';
      this.assetList = [];
    },

    async getPolicyOptionsData() {
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/strategy!strategyTree.action",
        vm: this
      });

      let optionsData = [{ label: "内置策略组", value: 1, children: [] }];
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.pid === 1) {
            optionsData[0].children.push({
              label: item.name,
              value: item.id,
              children: []
            });
          }
        });
      }

      this.policyOptions = optionsData;
    },
    /**
     * 添加任务项目下拉选择
     * @returns {Promise<void>}
     */
    async getPjOptions() {
      const roleId = sessionStorage.getItem("roleId");

      const data = await this.fetch({
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
    /**
     * 查询资产列表
     */
    getAssetList() {
      let pjid = this.getPjId;
      this.isLoadingAssets = true;
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!showAllProList.action",
        params: { t: Math.random(), pjid },
        vm: this
      }).then(res => {
        let data = res.data;
        this.isLoadingAssets = false;
        this.assetList = data.map(item => {
          return {
            devtype: item.devtype,
            vendor: item.vendor,
            name: item.name,
            ip: item.ip,
            pjid: item.pjid
          };
        });
      });
    },
    /**
     * 获取登录方式
     */
    getLoginType() {
      this.fetchFuzz({
        url: "fuzz/view/page/device!loadLoginType.action",
        params: {},
        vm: this
      }).then(res => {
        this.loginTypeList = res.list;
      });
    },
    /**
     * 获取资产类型列表
     */
    getDevTypeList() {
      this.fetchFuzz({
        url: "fuzz/view/page/device!findAllDevtype.action",
        params: {},
        vm: this
      }).then(res => {
        this.devTypeList = res.data;
      });
    },
    /**
     * 获取厂家列表
     */
    getVendorList(devtype) {
      this.fetchFuzz({
        url: "fuzz/view/page/device!findVendorByType.action",
        params: { devtype },
        vm: this
      }).then(res => {
        this.vendorList = res.data;
      });
    },
    /**
     * 获取设备名称列表
     */
    getProductList(devtype, vendor) {
      this.fetchFuzz({
        url: "fuzz/view/page/device!findProduct.action",
        params: { devtype, vendor },
        vm: this
      }).then(res => {
        this.productList = res.data;
      });
    },
    /**
     * 获取操作系统列表
     */
    getOsList() {
      this.fetchFuzz({
        url: "fuzz/view/page/device!loadOsDatas.action",
        vm: this
      }).then(res => {
        console.log(res, "getOsList");
        this.OSList = res.list;
      });
    },
    /**
     * 保存实时任务
     */
    submitAddTask() {
      if (!this.addTaskForm.name) {
        this.$message.warning('请填写任务名称');
        return;
      }
      if (!this.getPjId) {
        this.$message.warning('请选择项目');
        return;
      }
      if (!this.selectedPolicy.length) {
        this.$message.warning('请选择策略模板');
        return;
      }

      let str = [];
      this.addSelected.forEach(item => {
        str.push(item.ip);
      });

      let params = {
        taskname: this.addTaskForm.name, // 任务名称
        template: this.selectedPolicy.slice(-1)[0], // 策略模板 id 主机 3
        // 'autoupload' : 0, // 已取消 autoupload=1 为自动上传界面打钩；界面不打勾autoupload=0(非自动上传)
        pjid: this.getPjId, // 项目名称 id
        str: str.join(",") //  资产列表中选中列ip地址的值,逗号拼接
      };

      this.isAdding = true;

      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!addAcTask.action",
        params: params,
        vm: this
      }).then(res => {
        this.isAdding = false;
        if (res.success === "success") {
          this.$message({
            message: "任务添加成功!",
            type: "success"
          });
          this.getTableData();
          this.addTask = false;
        }
      });
    },
    /**
     * 删除实时任务
     */
    deleteRealTime() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "您还没有选中任务",
          type: "warning"
        });
      } else {
        this.$confirm("是否确认删除选中项?", "确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let taskids = [];
            console.log(
              this.multipleSelection,
              "multipleSelectionmultipleSelection"
            );
            this.multipleSelection.forEach(item => {
              let taskname = item.taskname;
              this.fetchFuzz({
                url: "fuzz/view/page/VerificationTasks!stopTask.action",
                params: { taskname },
                vm: this
              }).then(res => {});
              taskids.push(item.taskid);
            });
            this.fetchFuzz({
              url: "fuzz/view/page/VerificationTasks!delTasks.action",
              params: { taskids: taskids.join(",") },
              vm: this
            }).then(res => {
              if (res.success === "success") {
                this.$message({
                  message: "任务删除成功",
                  type: "success"
                });
                this.getTableData();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    /**
     * 核查报告预览
     */
    openHTML() {
      let taskid = this.reportTaskId;
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!preview.action",
        params: { taskid },
        vm: this
      }).then(res => {
        if (res === null) {
          // console.log(res, 'openHTML') // 预览报告
          window.open(
            `${FUZZ_URL}/fuzz/html/${taskid}_html/main.html`,
            "_blank"
          );
        } else if (res && res.state === "failure") {
          this.$message.error("文件不存在，报告预览失败~~~");
        }
      });
    },
    /**
     * 核查报告下载
     * @param taskid
     */
    downloadReport() {
      let taskid = this.reportTaskId;
      let fileType = this.fileType;
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!judgeJSON.action",
        params: { taskid },
        vm: this
      }).then(res => {
        if (res === null) {
          let url = `${FUZZ_URL}/fuzz/view/page/VerificationTasks!checkFile.action?fileType=${fileType}&taskid=${taskid}`;
          downloadFileByUrl(url);
        } else if (res.state === "failure") {
          this.$message.error("数据文件不存在，无法下载");
        }
      });
      this.dialogVisible = false;
    },
    /**
     * 首页table selected 返回值
     * @param val
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 添加实时任务select
     * @param val
     */
    handleSelectionAsset(val) {
      this.addSelected = val;
    },
    /**
     * 获取默认首页table数据
     * @param _index tableData 对应的index
     */
    getTableData(_index) {
      this.isLoadingTask = true;
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!loaddatas.action",
        params: { actask: "1" },
        vm: this
      }).then(res => {
        this.isLoadingTask = false;
        let data = res,
          arr = [];
        let i = 0;
        data.forEach(item => {
          if (item.groupid === 0) {
            let _item = item;
            _item.id = i;
            _item.level = 1;
            arr.push(item);
            i++;
          }
        });
        arr.forEach((item, index) => {
          arr[index]["children"] = [];
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i]["groupid"] === item.taskid) {
              let _data = data[i];
              _data.id = "a" + index + i;
              _data.level = 2;
              _data.taskname = `${_data["taskname"]}[${_data.taskid}]`;
              arr[index]["children"].push(data[i]);
            }
          }
        });
        // console.log(_index, arr, 'index 5s')
        if (_index) {
          if (arr[_index]["progress"] === 100) {
            clearInterval(this.timer);
          }
        }
        this.tableData = arr;
        // console.log(this.tableData, 'tableData')
      });
    },
    handleClick(row, type) {
      // console.log(row, 'row')
      let taskname = row.taskname;
      let url =
        type === "play"
          ? "VerificationTasks!reExecution.action"
          : "VerificationTasks!stopTask.action";
      this.fetchFuzz({
        url: "fuzz/view/page/" + url,
        params: { taskname },
        vm: this
      }).then(res => {
        if (res.success === "success") {
          if (type === "stop") {
            this.$set(this.tableData[row.id], "progress", row.progress + 200);
            clearInterval(this.timer);
          } else {
            let that = this;
            this.$set(this.tableData[row.id], "progress", 0);
            // this.timer = setInterval(() => {
            //   that.getTableData(row.id);
            // }, 5000);
          }
        }
      });
      // let _this = this
      // if (row.level === 1) {
      //   _this.loading = true
      //   setTimeout(() => {
      //     _this.loading = false
      //   }, 3000)
      // } else {
      //   this.dialogVisible = true
      // }
    },
    /**
     * 关闭核查报告弹框
     */
    handleClose() {
      this.dialogVisible = false;
    },
    /**
     * 打开预览下载报告弹框
     * @param row
     */
    openDownload(row) {
      this.reportTaskId = row.taskid;
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped lang="less">
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

  .icon {
    cursor: pointer;
    font-size: 20px;
  }

  .width-508 {
    width: 508px;
  }
}
</style>
