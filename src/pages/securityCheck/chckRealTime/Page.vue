<template>
  <div class="page">
    <div class="section">
      <p>
        <el-button type="primary" size="small" @click="addTaskFun"
          >添加</el-button
        >
      </p>

      <!-- 任务列表 -->
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="name"
          label="任务名称"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="pjname"
          label="项目名称"
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
              <span v-else-if="scope.row.progress >= 100">已完成</span>
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
            <span v-if="scope.row.level === 1">
              <el-button  v-if="scope.row.progress >= 100" type="text" @click="handlePlayClick(scope.row)">
                <i
                  class="el-icon-video-play icon cursor-point"
                  title="再次执行"
                  style="color: #009688;"
                ></i>
              </el-button>
              <el-button v-else type="text" @click="handleStopClick(scope.row)">
                <i 
                  class="el-icon-video-pause icon cursor-point"
                  title="停止任务"
                  style="color: red;"
                ></i>
              </el-button>
            </span>
            <span v-else>
              <el-button type="text" 
                :disabled="scope.row.progress < 100" 
                @click="openDownload(scope.row)" 
                title="核查报告">
                <i
                  class="el-icon-document icon"
                ></i>
              </el-button>
            </span>
            <i
              class="icon el-icon-delete cursor-point"
              @click="handleDeleteClick(scope.row)"
              style="color: red;"
              title="删除"
            ></i>
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
        <el-form ref="form" label-width="80px">
          <el-form-item label="报告预览">
            <el-button type="primary" plain="" @click="openHTML">预览（html）</el-button>
          </el-form-item>
          <el-form-item label="报告下载">
            <el-select v-model="fileType" placeholder="请选择">
              <el-option label="HTML" value="HTML"></el-option>
              <el-option label="WORD" value="WORD"></el-option>
              <el-option label="PDF" value="PDF"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
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
          ref="addTaskForm"
          label-width="120"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="addTaskForm.name"
              class="width-508"
            ></el-input>
          </el-form-item>
          <el-form-item label="核查方式">
            <el-select class="width-508" v-model="addTaskForm.type" placeholder="请选择" disabled>
              <el-option label="实时任务" value="1"></el-option>
              <!--<el-option label="公网" value="2"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="策略模板" prop="selectedPolicy">
            <el-cascader class="width-508"
              filterable
              :options="policyOptions"
              v-model="addTaskForm.selectedPolicy"
              @expand-change="handlePolicyExpend"
            >
            </el-cascader>
          </el-form-item>
          
          <el-form-item label="项目选择" prop="pjValue">
            <el-cascader class="width-508"
              :show-all-levels="false"
              :options="pjOptions"
              :props="{ expandTrigger: 'hover' }"
              filterable
              v-model="addTaskForm.pjValue"
              @change="getAssetList"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="资产列表(请勾选要核查的资产)">
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
        <el-button :disabled="isAdding" size="small" type="primary" @click="handleSaveClick">保 存</el-button>
        <el-button :disabled="isAdding" size="small" @click="addTask = false">取 消</el-button>
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
        this.getFuzz({
          url: "/fuzz/page/view/VerificationTasks!findTaskName.action",
          params: { taskname: value },
          vm: this
        }).then(res => {
          if (res.success === "failure") {
            callback(new Error("与已有的实时任务或周期任务名称重复，请重新输入"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      isAdding: false,
      isLoadingAssets: false,
      isFinished: true,
      policyOptions: [],
      rules: {
        name: [{ required: true, validator: validateName, trigger: ["blur"] }],
        pjValue: [{ required: true, message: '请选择项目', trigger: ["blur"] }],
        selectedPolicy: [{ required: true, message: '请选择策略模板', trigger: ["blur"] }]
      }, // 添加任务任务名称重复验证
      pjOptions: null, // 添加任务项目下拉选择
      assetList: [], // 添加任务资产列表
      tableData: [],
      dialogVisible: false, // 下载报告
      addTask: false,
      addTaskForm: {
        name: "",
        pjValue: [],
        type: "1",
        selectedPolicy: [],
        selectedAssets: [],
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
    this.timer && clearInterval(this.timer);
  },
  computed: {
    getPjId() {
      let id;
      if (this.addTaskForm.pjValue && this.addTaskForm.pjValue[0]) {
        id = this.addTaskForm.pjValue.slice(-1)[0];
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
      this.resetTaskForm();
      this.addTask = true;
    },

    resetTaskForm() {
      this.addTaskForm.pjValue = [];
      this.addTaskForm.selectedPolicy = [];
      this.addTaskForm.name = '';
      this.assetList = [];
    },
    
    /**
     * 树形结构数据初始化数据
     */
    async getPolicyOptionsData() {
      const { data } = await this.getFuzz({
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
    /**
     * 查询资产列表
     */
    getAssetList() {
      let pjid = this.getPjId;
      this.isLoadingAssets = true;
      this.getFuzz({
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
     * 添加任务时，点击保存
     */
    handleSaveClick () {
      this.isAdding = true;

      this.$refs['addTaskForm'].validate(valid => {
        if (!valid) {
          this.isAdding = false;
          return false;
        };

        if (this.addTaskForm.selectedAssets.length === 0) {
          this.isAdding = false;
          this.$message.error('请勾选要核查的资产');
          return false;
        } 
        
        this.submitAddTask();
      })
    },
    /**
     * 保存实时任务
     */
    submitAddTask() {
      let str = [];
      this.addTaskForm.selectedAssets.forEach(item => {
        str.push(item.ip);
      });

      let params = {
        taskname: this.addTaskForm.name, // 任务名称
        template: this.addTaskForm.selectedPolicy.slice(-1)[0], // 策略模板 id 主机 3
        pjid: this.getPjId, // 项目名称 id
        str: str.join(",") //  资产列表中选中列ip地址的值,逗号拼接
      };

      this.getFuzz({
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
     * 点击删除
     */
    handleDeleteClick(item) {
      this.$confirm("是否确认删除选中项?", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.deleteTask(item);
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    /**
     * 删除实时任务或核查记录
     */
    async deleteTask(item) {
      // 如果任务正在进行，先停止任务
      if (item.progress < 100) {
        const taskname = item.taskname;
        await this.getFuzz({
          url: "fuzz/view/page/VerificationTasks!stopTask.action",
          params: { taskname },
          vm: this
        })
      }

      // 然后删除核查任务或记录
      this.getFuzz({
        url: "fuzz/view/page/VerificationTasks!delTasks.action",
        params: { taskids: item.taskid },
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
    },
    /**
     * 核查报告预览
     */
    openHTML() {
      let taskid = this.reportTaskId;
      this.getFuzz({
        url: "fuzz/view/page/VerificationTasks!preview.action",
        params: { taskid },
        vm: this
      }).then(res => {
        if (res === null) {
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
      this.getFuzz({
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
     * 添加实时任务select
     * @param val
     */
    handleSelectionAsset(val) {
      this.addTaskForm.selectedAssets = val;
    },
    /**
     * 获取默认首页table数据
     */
    getTableData() {
      this.isFinished = true;

      this.getFuzz({
        url: "fuzz/view/page/VerificationTasks!loaddatas.action",
        params: { actask: "1" },
        vm: this
      }).then(data => {
        // 任务
        let taskArr = [];

        data.forEach((item, i) => {
          if (item.groupid === 0) {
            item.id = i;
            item.level = 1;
            item.name = item.taskname;
            item.children = [];
            taskArr.push(item);
          }

        });

        taskArr.forEach((item, index) => {
          if (item.progress < 100) {
            this.isFinished = false;
          }

          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i]["groupid"] === item.taskid) {
              let _data = data[i];
              _data.id = "a" + index + i;
              _data.level = 2;
              _data.name = `${_data["taskname"]}[${_data.taskid}]`;
              item["children"].push(_data);
            }
          }
        });

        if (this.isFinished) {
          this.timer && clearInterval(this.timer);
          this.timer = null;
        } else {
          if (!this.timer) {
            this.timer = setInterval(this.getTableData, 2000);
          }
        }

        this.tableData = taskArr;
      });
    },
    /**
     * 停止核查任务
     */
    handleStopClick(row) {
      row.progress = 100;
      
      this.getFuzz({
        url: "fuzz/view/page/" + "VerificationTasks!stopTask.action",
        params: { taskname:  row.taskname },
        vm: this
      }).then(res => {
        if (res.success === "success") {
          this.getTableData();
        }
      });
    },
    /**
     * 再次执行核查任务
     */
    handlePlayClick(row) {
      row.progress = 0;
      
      this.getFuzz({
        url: "fuzz/view/page/" + "VerificationTasks!reExecution.action",
        params: { taskname:  row.taskname },
        vm: this
      }).then(res => {
        if (res.success === "success") {
          this.getTableData();
        }
      });
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
    font-size: 20px;
  }

  .cursor-point {
    cursor: pointer;
  }

  .width-508 {
    width: 508px;
  }
}
</style>
