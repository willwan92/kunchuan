<template>
  <div class="goodsPage">
    <div class="goodsTop">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="周期任务" name="first">
          <template>
            <el-button type="primary" plain size="medium" @click="addTaskFun">添加</el-button>
            <el-button type="primary" plain size="medium" @click="deleteRealTime">删除</el-button>
            <el-divider></el-divider>
            <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id"
                      border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      @selection-change="handleSelectionChange" v-loading="loading">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="taskName" label="任务名称" width="250"></el-table-column>
              <el-table-column prop="name" label="战场名称" width="100"></el-table-column>
              <el-table-column prop="type" label="类型" width="100"></el-table-column>
              <el-table-column prop="startTime" label="开始时间"></el-table-column>
              <el-table-column prop="endTime" label="结束时间"></el-table-column>
              <el-table-column label="状态/进度">
                <template slot-scope="scope">
                  <div v-if="scope.row.level === 1">{{scope.row.status}}</div>
                  <div v-else>
                    <el-progress :text-inside="true" :stroke-width="15" :percentage="scope.row.percentage"></el-progress>
                  </div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">[详细]</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="核查报告" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div style="padding: 20px;">
          <div>
            <span style="padding-right: 40px;">报告预览</span><span>预览（html）</span>
          </div>
          <div style="margin-top: 20px;">
            <span style="padding-right: 40px;">报告下载</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option label="HTML" value="HTML"></el-option>
              <el-option label="WORD" value="WORD"></el-option>
              <el-option label="PDF" value="PDF"></el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">下 载</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加周期任务" :visible.sync="addTask" width="60%">
        <div>
          <el-form :model='addTaskForm' label-width="120" width="80%">
            <el-form-item label="任务名称">
              <el-input v-model="addTaskForm.name"></el-input>
            </el-form-item>
            <el-form-item label="项目选择">
              <el-select v-model="addTaskForm.task" placeholder="请选择">
                <el-option label="研发" value="1"></el-option>
                <el-option label="公网" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="核查方式">
              <el-select v-model="addTaskForm.type" placeholder="请选择" disabled>
                <el-option label="周期任务" value="1"></el-option>
                <!--<el-option label="公网" value="2"></el-option>-->
              </el-select>
            </el-form-item>
            <el-form-item label="策略模板">
              <el-input v-model="addTaskForm.name"></el-input>
            </el-form-item>
            <el-form-item label="资产列表">
              <el-table :data="assetList" style="width: 100%" border>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="资产类型" prop="type" width="120"></el-table-column>
                <el-table-column prop="name" label="厂家名称" width="120"></el-table-column>
                <el-table-column prop="name1" label="设备名称"></el-table-column>
                <el-table-column prop="ip" label="IP地址"></el-table-column>
                <el-table-column label="操作">
                  <template>
                    <el-button type="text" @click="assetListDialog = true">操作</el-button>
                  </template>
                  <!--<el-dialog title="添加周期任务" :visible.sync="assetListDialog" width="40%">-->
                    <!--<el-form label-position="left" label-width="80px" :model="formLabelAlign">-->
                      <!--<el-form-item label="IP地址">-->
                        <!--<el-input v-model="assetList.ip"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="登录方式">-->
                        <!--<el-select v-model="assetList.region" placeholder="请选择" disabled>-->
                          <!--<el-option label="ssh" value="1"></el-option>-->
                        <!--</el-select>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="端口">-->
                        <!--<el-input v-model="assetList.port"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="端口">-->
                        <!--<el-input v-model="assetList.type"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="资产类型">-->
                        <!--<el-input v-model="assetList.type"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="厂家名称">-->
                        <!--<el-input v-model="assetList.type"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="设备型号">-->
                        <!--<el-input v-model="assetList.version"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="版本号">-->
                        <!--<el-input v-model="assetList.version1"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="操作系统">-->
                        <!--<el-input v-model="assetList.system"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="用户名">-->
                        <!--<el-input v-model="assetList.username"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="登录密码">-->
                        <!--<el-input v-model="assetList.password"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="su用户名">-->
                        <!--<el-input v-model="assetList.suUser"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="su密码">-->
                        <!--<el-input v-model="assetList.suPsaa"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="数据库路径">-->
                        <!--<el-input v-model="assetList.dataPath"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="数据库账号">-->
                        <!--<el-input v-model="assetList.dataUser"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="数据库口令">-->
                        <!--<el-input v-model="assetList.dataPass"></el-input>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="数据库实例">-->
                        <!--<el-input v-model="assetList.example"></el-input>-->
                      <!--</el-form-item>-->
                    <!--</el-form>-->
                  <!--</el-dialog>-->
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addTask = false">保 存</el-button>
          <el-button type="primary" @click="addTask = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        assetListDialog: true,
        activeName: 'first',
        tableData: [{
          id: 1,
          taskName: '核查windowslinuxmysql',
          name: '研发',
          type: '实时任务',
          startTime: '2019/12/28 11:19:00',
          endTime: '',
          status: '已停止',
          level: 1,
          children: [{
            id: 11,
            taskName: '核查windowslinuxmysq[18]',
            name: '研发',
            type: '核查任务',
            startTime: '2019/12/28 11:19:00',
            endTime: '',
            status: '',
            level: 2,
            percentage: 39
          }, {
            id: 12,
            taskName: '核查windowslinuxmysq[5]',
            name: '研发',
            type: '核查任务',
            startTime: '2019/12/27 22:26:09',
            endTime: '2019/12/27 22:27:20',
            status: '',
            level: 2,
            percentage: 100
          }]
        }],
        multipleSelection: [],
        loading: false,
        dialogVisible: false, // 下载报告
        value: 'HTML',
        addTask: false,
        addTaskForm: {
          name: '',
          task: '1',
          type: '1',
          template: '1'
        },
        assetList: [
          {name: '数据库', name1: 'Mysql', type: 'Mysql', ip: '10.60.100.200'},
          {name: '主机', name1: 'Linux', type: 'Linux', ip: '10.60.3.121'},
          {name: '主机', name1: 'Windows', type: 'Windows', ip: '10.60.4.99'},
          {name: '主机', name1: 'Windows', type: 'Windows', ip: '10.60.5.5'}
        ]
      }
    },
    methods: {
      handleSelectionChange(val) {
        console.log(val, 'val')
        this.multipleSelection = val
      },
      handleClick (row) {
        console.log(row, 'row')
        let _this = this
        if (row.level === 1) {
          _this.loading = true
          setTimeout(() => {
            _this.loading = false
          }, 3000)
        } else {
          this.dialogVisible = true
        }
      },
      handleClose () {
        this.dialogVisible = false
      },
      addTaskFun () {
        console.log(11111)
        this.addTask = true
      },
      deleteRealTime () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '您还没有选中任务',
            type: 'warning'
          });
        } else {
          this.$message({
            message: '任务删除成功',
            type: 'success'
          });
        }
      }
    }
  }
</script>
<style scoped>
  .goodsTop{
    margin-top: 20px;
  }
</style>
