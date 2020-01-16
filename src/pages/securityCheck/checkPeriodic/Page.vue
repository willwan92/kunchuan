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

      <!-- 任务列表 -->
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
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
        ></el-table-column>
        <el-table-column prop="tasktype" label="类型" width="100">
          <template slot-scope="scope">
            <span>
              {{ taskTypeList['task'+scope.row.tasktype] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="starttime" label="开始时间"></el-table-column>
        <el-table-column prop="endtime" label="结束时间"></el-table-column>
        <el-table-column label="状态/进度">
          <template slot-scope="scope">
            <div v-if="scope.row.level === 1">
              <span v-if="scope.row.progress >= 200">已停止</span>
              <span v-else-if="scope.row.progress === 0">等待执行</span>
              <span v-else-if="0 < scope.row.progress < 100">执行中</span>
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
                class="icon el-icon-video-play cursor-point"
                v-if="scope.row.progress >= 100"
                @click="handleClick(scope.row, 'play')"
                style="color: #009688;"
              ></i>
              <i
                class="icon el-icon-video-pause cursor-point"
                v-else
                @click="handleClick(scope.row, 'stop')"
                style="color: red;"
              ></i>
            </p>
            <P v-else>
              <el-button type="text" 
                :disabled="scope.row.progress < 100" 
                @click="openDownload(scope.row)" 
                title="核查报告">
                <i
                  class="el-icon-document icon"
                ></i>
              </el-button>
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
    <el-dialog title="添加周期任务" :visible.sync="addTask" width="800px">
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
          <el-form-item label="项目选择">
            <el-cascader 
              class="width-508"
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
              <el-option label="周期任务" value="1"></el-option>
              <!--<el-option label="公网" value="2"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="周期选择">
            <el-select
              v-model="addTaskForm.timeType"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option
                v-for="(item, index) in periodList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="addTaskForm.period"
              v-if="addTaskForm.timeType === 3"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option
                v-for="item in weekList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="addTaskForm.day"
              v-if="addTaskForm.timeType === 2"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option
                v-for="item in 31"
                :key="item"
                :label="item + '日'"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="addTaskForm.hour"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option label="0时" value="0"></el-option>
              <el-option
                v-for="item in 23"
                :key="item"
                :label="item + '时'"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="addTaskForm.minute"
              placeholder="请选择"
              style="width: 120px;"
            >
              <el-option label="0分" value="0"></el-option>
              <el-option
                v-for="item in 59"
                :key="item"
                :label="item + '分'"
                :value="item"
              ></el-option>
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
import { getCascaderOptions, formatTreeData, downloadFileByUrl } from "common/utils";

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
          if (res.success === "failure") {
            callback(new Error("任务名称重复"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      taskTypeList: {
        "task3": '每月任务', 
        "task4": '每周任务',
        "task5": '每天任务'
      },
      isAdding: false,
      isLoadingAssets: false,
      isFinished: true,
      policyOptions: [],
      selectedPolicy: [],
      rules: {
        name: [{ required: false, validator: validateName, trigger: ["blur"] }]
      }, // 添加任务任务名称重复验证
      pjOptions: null, // 添加任务项目下拉选择
      pjValue: [],
      assetList: [], // 添加任务资产列表
      assetListDialog: false, //添加任务资产列表操作弹框
      tableData: [],
      multipleSelection: [],
      addSelected: [],
      dialogVisible: false, // 下载报告
      fileType: "HTML",
      addTask: false,
      addTaskForm: {
        name: "",
        type: "1",
        timeType: "",
        period: "",
        day: "",
        hour: "",
        minute: ""
      },
      reportTaskId: null, // 下载和预览报告taskid
      timer: null, // 定时
      periodList: [
        { value: "", label: "请选择" },
        { value: 2, label: "每月" },
        { value: 3, label: "每周" },
        { value: 1, label: "每天" } // 每月 2 每周 3  每日1
      ],
      weekList: [
        { value: 7, label: "星期日" },
        { value: 1, label: "星期一" },
        { value: 2, label: "星期二" },
        { value: 3, label: "星期三" },
        { value: 4, label: "星期四" },
        { value: 5, label: "星期五" },
        { value: 6, label: "星期六" }
      ]
    };
  },
  mounted() {
    this.getTableData();
    this.getPolicyOptionsData();
    this.getPjOptions();
    this.timer = setInterval(this.getTableData, 4000);
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
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
      this.resetTaskForm();
      this.addTask = true;
    },
     resetTaskForm() {
      this.addTaskForm.name = '';
      this.pjValue = [];
      this.addTaskForm.timeType = '';
      this.addTaskForm.period = '';
      this.addTaskForm.day = '';
      this.addTaskForm.hour = '';
      this.addTaskForm.minute = '';
      this.selectedPolicy = [];
      this.assetList = [];
    },
    /**
     * 树形结构数据初始化数据
     */
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
     * 保存周期任务
     */
    submitAddTask() {
      this.$refs['addTaskForm'].validate(valid => {
        if (!valid) return;
      })

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

      let data = {
        // 待处理
        day: this.addTaskForm.day
          ? this.addTaskForm.day >= 10
            ? this.addTaskForm.day
            : "0" + this.addTaskForm.day
          : null, // 每天 this.addTaskForm.period
        week: this.addTaskForm.period ? this.addTaskForm.period : null, // 每周 6
        hour: this.addTaskForm.hour
          ? this.addTaskForm.hour >= 10
            ? this.addTaskForm.hour
            : "0" + this.addTaskForm.hour
          : null, // 小时
        minute: this.addTaskForm.minute
          ? this.addTaskForm.minute >= 10
            ? this.addTaskForm.minute
            : "0" + this.addTaskForm.minute
          : null, // 分钟
        timeType:
          this.addTaskForm.timeType === "" ? 1 : this.addTaskForm.timeType, // 选择周期类型 每月 2 每周 3  每日1
        taskname: this.addTaskForm.name, // 任务名称
        template: this.selectedPolicy.slice(-1)[0], // 策略模板 id 主机 3
        // 'autoupload' : 0, // 已取消 autoupload=1 为自动上传界面打钩；界面不打勾autoupload=0(非自动上传)
        pjid: this.getPjId, // 项目名称 id
        str: str.join(",") //  资产列表中选中列ip地址的值,逗号拼接
      };

      if (
        this.addTaskForm.timeType === 1 ||
        this.addTaskForm.timeType === ""
      ) {
        // 每天
        data.week = null;
        data.day = null;
      } else if (this.addTaskForm.timeType === 2) {
        // 每月
        data.week = null;
      } else if (this.addTaskForm.timeType === 3) {
        // 每周
        data.day = null;
      }
      
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!addCircleTask.action",
        params: data,
        vm: this
      }).then(res => {
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
      // console.log(val, 'multipleSelection')
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
      this.fetchFuzz({
        url: "fuzz/view/page/VerificationTasks!loaddatas.action",
        params: { circletask: "1" },
        vm: this
      }).then(data => {
        // 任务
        let taskArr = [];

        data.forEach((item, i) => {
          if (item.groupid === 0) {
            item.id = i;
            item.level = 1;
            item.children = [];
            taskArr.push(item);
          }

        });

        taskArr.forEach((item, index) => {

          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i]["groupid"] === item.taskid) {
              let _data = data[i];
              _data.id = "a" + index + i;
              _data.level = 2;
              _data.taskname = `${_data["taskname"]}[${_data.taskid}]`;
              item["children"].push(_data);
            }
          }
        });

        this.tableData = taskArr;
      });
    },
    
    /**
     * 执行或者停止任务
     */
    handleClick(row, type) {
      let taskname = row.taskname;
      let url =
        type === "play"
          ? "VerificationTasks!reExecution.action"
          : "VerificationTasks!stopTask.action";
      let data = { taskname };
      type === "play" ? (data.task = "circleTask") : data;
      this.fetchFuzz({
        url: "fuzz/view/page/" + url,
        params: data,
        vm: this
      }).then(res => {
        if (res.success === "success") {
          if (type === "stop") {
            // this.$set(this.tableData[row.id], "progress", row.progress + 200);
          } else {
            
          }
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
