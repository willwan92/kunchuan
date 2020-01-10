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
              <el-table-column prop="taskname" label="任务名称" width="250"></el-table-column>
              <el-table-column prop="pjname" label="项目名称" width="100"></el-table-column>
              <el-table-column prop="tasktype" label="类型" width="100">
                <template><span>周期任务</span></template>
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
                    <el-progress v-if="scope.row.progress >= 200" :text-inside="true" :stroke-width="15" :percentage="scope.row.progress - 200"></el-progress>
                    <el-progress v-else :text-inside="true" :stroke-width="15" :percentage="scope.row.progress"></el-progress>
                  </div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <p v-if="scope.row.level === 1">
                    <i class="el-icon-video-play" v-if="scope.row.progress >= 100" @click="handleClick(scope.row, 'play')" style="color: #009688;"></i>
                    <i class="el-icon-video-pause" v-else @click="handleClick(scope.row, 'stop')" style="color: red;"></i>
                  </p>
                  <P v-else>
                    <i class="el-icon-document" style="color: #009688;" @click="openDownload(scope.row)"></i>
                  </P>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="核查报告" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div style="padding: 20px;">
          <div>
            <span style="padding-right: 40px;">报告预览</span>
            <span @click="openHTML" style="cursor: pointer;">预览（html）</span>
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
          <el-button type="primary" @click="downloadReport">下 载</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加周期任务" :visible.sync="addTask" width="60%">
        <div>
          <el-form :model='addTaskForm' :rules="rules" ref="ruleForm" label-width="120">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="addTaskForm.name" style="width: 508px;"></el-input>
            </el-form-item>
            <el-form-item label="项目选择">
              <el-cascader :show-all-levels="false" :options="stationList" :props="{ expandTrigger: 'hover' }"
                           filterable v-model="addTaskForm.task" @change="queryStation"></el-cascader>
            </el-form-item>
            <el-form-item label="核查方式">
              <el-select v-model="addTaskForm.type" placeholder="请选择" disabled>
                <el-option label="周期任务" value="1"></el-option>
                <!--<el-option label="公网" value="2"></el-option>-->
              </el-select>
            </el-form-item>
            <el-form-item label="周期选择">
              <el-select v-model="addTaskForm.timeType" placeholder="请选择" style="width: 120px;">
                <el-option v-for="(item, index) in periodList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-model="addTaskForm.period" v-if="addTaskForm.timeType === 3" placeholder="请选择" style="width: 120px;">
                <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-model="addTaskForm.day" v-if="addTaskForm.timeType === 2" placeholder="请选择" style="width: 120px;">
                <el-option v-for="item in 31" :key="item" :label="item + '日'" :value="item"></el-option>
              </el-select>
              <el-select v-model="addTaskForm.hour" placeholder="请选择" style="width: 120px;">
                <el-option v-for="item in 23" :key="item" :label="item + '时'" :value="item"></el-option>
              </el-select>
              <el-select v-model="addTaskForm.minute" placeholder="请选择" style="width: 120px;">
                <el-option v-for="item in 59" :key="item" :label="item + '分'" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="策略模板">
              <el-input v-model="addTaskForm.module" @focus="moduleDialog = true" style="width: 508px;"></el-input>
            </el-form-item>
            <el-form-item label="资产列表">
              <el-table :data="assetList" style="width: 80%;" border
                        @selection-change="handleSelectionAsset">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="资产类型" prop="devtype" width="120"></el-table-column>
                <el-table-column prop="vendor" label="厂家名称" width="120"></el-table-column>
                <el-table-column prop="name" label="设备名称"></el-table-column>
                <el-table-column prop="ip" label="IP地址"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <i class="el-icon-edit" @click="assetItem(scope.row)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddTask">保 存</el-button>
          <el-button type="primary" @click="addTask = false">关 闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="详情" :visible.sync="assetListDialog" width="40%">
        <el-form label-position="left" label-width="80px" :model="assetListItem">
          <el-form-item label="IP地址">
            <el-input v-model="assetListItem.ip"></el-input>
          </el-form-item>
          <el-form-item label="登录方式">
            <el-select v-model="assetListItem.authtype" placeholder="请选择">
              <el-option v-for="item in loginTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="assetListItem.authport"></el-input>
          </el-form-item>
          <el-form-item label="资产类型">
            <el-select v-model="assetListItem.alias" placeholder="请选择" @change="getVendorList(assetListItem.alias)">
              <el-option v-for="item in devTypeList" :label="item.devtype" :value="item.devtype" :key="item.devtype"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家名称">
            <el-select v-model="assetListItem.vendor" placeholder="请选择" @change="getProductList(assetListItem.alias, assetListItem.vendor)">
              <el-option v-for="item in vendorList" :label="item.vendor" :value="item.vendor" :key="item.vendor"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-select v-model="assetListItem.devtype" placeholder="请选择">
              <el-option v-for="item in productList" :label="item.product" :value="item.product" :key="item.product"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="assetListItem.version"></el-input>
          </el-form-item>
          <el-form-item label="操作系统">
            <el-select v-model="assetListItem.os" placeholder="请选择">
              <el-option v-for="item in OSList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="assetListItem.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="assetListItem.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="su用户名">
            <el-input v-model="assetListItem.su_user" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="su密码">
            <el-input v-model="assetListItem.su_passwd" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据库路径">
            <el-input v-model="assetListItem.dbpath"></el-input>
          </el-form-item>
          <el-form-item label="数据库账号">
            <el-input v-model="assetListItem.dbuser" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据库口令">
            <el-input v-model="assetListItem.dbpassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据库实例">
            <el-input v-model="assetListItem.dbinstance"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="assetListDialog = false">取 消</el-button>
              <el-button type="primary" @click="submitAssetItem">提 交</el-button>
            </span>
      </el-dialog>
      <el-dialog title="策略模板" :visible.sync="moduleDialog" width="40%" :modal="!moduleDialog">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" style="margin-top: 20px;"></el-tree>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { FUZZ_URL } from 'common/axiosClient'
  import {commonExport, getCascaderOptions} from "../../../common/utils";

  export default {
    data() {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入任务名称'))
        } else {
          this.fetchFuzz({url: '/fuzz/page/view/VerificationTasks!findTaskName.action', params: {taskname: value}, vm: this}).then(res => {
            console.log(res, 'validateName')
            if (res.success === 'success') {
              callback()
            } else {
              callback(new Error('任务名称重复'))
            }
          })
        }
      }
      return {
        moduleDialog: false,
        activeName: 'first',
        rules: {
          name: [
            {required: false, validator: validateName, trigger: ['blur']}
          ]
        }, // 添加任务任务名称重复验证
        stationList: null, // 添加任务项目下拉选择
        assetList: [], // 添加任务资产列表
        assetListDialog: false, //添加任务资产列表操作弹框
        assetListItem: {}, // 添加任务资产列表操作数据
        loginTypeList: [], // 登录方式
        devTypeList: [], // 资产类型列表
        vendorList: [], // 厂家名称
        productList: [], // 设备型号
        OSList: [], // 操作系统列表
        tableData: [],
        multipleSelection: [],
        addSelected: [],
        loading: false,
        dialogVisible: false, // 下载报告
        value: 'HTML',
        addTask: false,
        addTaskForm: {
          name: '',
          task: [],
          type: '1',
          template: '',
          module: '',
          moduleId: ''
        },
        data: [{name: '内置策略组', pid: 0, _id: 1, is_buildin: 1, children: []}], // 树形数据
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        reportTaskId: null, // 下载和预览报告taskid
        timer: null, // 定时
        periodList: [
          {value: '', label: '请选择'}, {value: 2, label: '每月'},
          {value: 3, label: '每周'}, {value: 1, label: '每天'}, // 每月 2 每周 3  每日1
        ],
        weekList: [
          {value: 7, label: '星期日'}, {value: 1, label: '星期一'}, {value: 2, label: '星期二'},
          {value: 3, label: '星期三'}, {value: 4, label: '星期四'}, {value: 5, label: '星期五'},
          {value: 6, label: '星期六'},
        ]
      }
    },
    mounted () {
      this.getTableData()
      this.initData()
      this.getStationList()
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    computed: {
      getPjId() {
        let id;
        if (this.addTaskForm.task && this.addTaskForm.task[0]) {
          id = this.addTaskForm.task.slice(-1)[0];
        } else {
          id = null;
        }
        return id;
      }
    },
    methods: {
      /**
       * 点击添加按钮
       */
      addTaskFun () {
        this.addTask = true
        // this.getStationList()
        // this.initData()
      },
      /**
       * 树形结构数据初始化数据
       */
      async initData() {
        const {data} = await this.fetchFuzz({
          url: '/fuzz/page/view/strategy!strategyTree.action',
          vm: this
        })

        let children = []
        data.forEach((item, index) => {
          if (item.pid !== 0) {
            let _item = item
            _item.level = 1
            _item.index = index
            _item.children = []
            children.push(_item)
          }
        })
        this.data[0]['children'] = children
        console.log(this.data, 'data')
      },
      /**
       * 添加任务项目下拉选择
       * @returns {Promise<void>}
       */
      async getStationList () {
        const { data } = await this.fetch({
          url: "/porject/getProjectList",
          vm: this
        });

        this.stationList = getCascaderOptions({
          arr: data,
          label: "pjname",
          value: "id",
          filter: 'isleaf'
        });
      },
      /**
       * 查询资产列表
       */
      queryStation () {
        let pjid = this.getPjId
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!showAllProList.action', params: {t: Math.random(), pjid}, vm: this}).then(res => {
          let data = res.data
          console.log(data, 'queryStation')
          this.assetList = data.map(item => {
            return {devtype: item.devtype, vendor: item.vendor, name: item.name, ip: item.ip, pjid: item.pjid}
          })
        })
      },
      /**
       * 操作 - 资产列表item 详情
       * @param row
       */
      assetItem (row) {
        console.log(row, 'row')
        this.assetListDialog = true
        let pjid = this.getPjId, ip = row.ip
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!showOneProList.action', params: {ip, pjid}, vm: this}).then(res => {
          console.log(res, 'assetItem')
          this.assetListItem = res.data[0]
        })
        this.getLoginType()
        this.getDevTypeList()
        this.getOsList()
      },
      /**
       * 获取登录方式
       */
      getLoginType () {
        this.fetchFuzz({url: 'fuzz/view/page/device!loadLoginType.action', params: {}, vm: this}).then(res => {
          this.loginTypeList = res.list
        })
      },
      /**
       * 获取资产类型列表
       */
      getDevTypeList () {
        this.fetchFuzz({url: 'fuzz/view/page/device!findAllDevtype.action', params: {}, vm: this}).then(res => {
          this.devTypeList = res.data
        })
      },
      /**
       * 获取厂家列表
       */
      getVendorList (devtype) {
        this.fetchFuzz({url: 'fuzz/view/page/device!findVendorByType.action', params: {devtype}, vm: this}).then(res => {
          this.vendorList = res.data
        })
      },
      /**
       * 获取设备名称列表
       */
      getProductList (devtype, vendor) {
        this.fetchFuzz({url: 'fuzz/view/page/device!findProduct.action', params: {devtype, vendor}, vm: this}).then(res => {
          this.productList = res.data
        })
      },
      /**
       * 获取操作系统列表
       */
      getOsList () {
        this.fetchFuzz({url: 'fuzz/view/page/device!loadOsDatas.action', vm: this}).then(res => {
          console.log(res, 'getOsList')
          this.OSList = res.list
        })
      },
      /**
       * 提交资产列表修改
       */
      submitAssetItem () { // assetListItem
        let data = {
          "pjid": this.getPjId, // 添加实时任务页面传过来的
          "deviceip": this.assetListItem.ip, // ip地址
          "devicelogin": this.assetListItem.authtype, // 登录方式
          "deviceport": this.assetListItem.authport, // 端口
          "devicelist": this.assetListItem.alias, // 资产类型
          "deviceEname": this.assetListItem.devtype, // 厂家名称
          "deviceSname": this.assetListItem.vendor, // 设备型号
          "devicenum": this.assetListItem.version, // 版本号
          "deviceos": this.assetListItem.os, // 操作系统
          "deviceusr": this.assetListItem.username,// 用户名
          "devicepass": this.assetListItem.password, // 登录密码
          "suUserName": this.assetListItem.su_user, // su用户名
          "suPassword": this.assetListItem.su_passwd, // su密码
          "databasePath": this.assetListItem.dbpath, // 数据库路径
          "databaseAccount": this.assetListItem.dbuser, // 数据库账号
          "databasePassword": this.assetListItem.dbpassword, // 数据库口令
          "databaseInstance": this.assetListItem.dbinstance    // 数据库实例
        }
        this.fetchFuzz({url: 'fuzz/view/page/device!editdevice.action', params: data, vm: this}).then(res => {
          if (res.state === 1) {
            this.queryStation()
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
          }
          this.assetListDialog = false
        })
      },
      /**
       * 保存实时任务
       */
      submitAddTask () {
        let str = []
        this.addSelected.forEach(item => {
          str.push(item.ip)
        })
        let data = { // 待处理
          'day' : this.addTaskForm.day ? (this.addTaskForm.day >= 10 ? this.addTaskForm.day : '0' + this.addTaskForm.day) : null, // 每天 this.addTaskForm.period
          'week' : this.addTaskForm.period ? this.addTaskForm.period : null, // 每周 6
          'hour' : this.addTaskForm.hour ? (this.addTaskForm.hour >= 10 ? this.addTaskForm.hour : '0' + this.addTaskForm.hour) : null, // 小时
          'minute' : this.addTaskForm.minute ? (this.addTaskForm.minute >= 10 ? this.addTaskForm.minute : '0' + this.addTaskForm.minute) : null, // 分钟
          'timeType' : this.addTaskForm.timeType === '' ? 1 : this.addTaskForm.timeType, // 选择周期类型 每月 2 每周 3  每日1
          'taskname': this.addTaskForm.name,  // 任务名称
          'template': this.addTaskForm.moduleId,  // 策略模板 id 主机 3
          // 'autoupload' : 0, // 已取消 autoupload=1 为自动上传界面打钩；界面不打勾autoupload=0(非自动上传)
          'pjid' : this.getPjId, // 项目名称 id
          'str' : str.join(',')   //  资产列表中选中列ip地址的值,逗号拼接
        };
        if (this.addTaskForm.timeType === 1 || this.addTaskForm.timeType === '') { // 每天
          data.week = null
          data.day = null
        } else if (this.addTaskForm.timeType === 2) { // 每月
          data.week = null
        } else if (this.addTaskForm.timeType === 3) { // 每周
          data.day = null
        }
        console.log(data, 'data')
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!addCircleTask.action', params: data, vm:this}).then(res => {
          if (res.success === 'success') {
            this.$message({
              message: '任务添加成功!',
              type: 'success'
            })
            this.getTableData()
            this.addTask = false
          }
        })
      },
      /**
       * 删除实时任务
       */
      deleteRealTime () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '您还没有选中任务',
            type: 'warning'
          });
        } else {
          this.$confirm('是否确认删除选中项?', '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let taskids = []
            console.log(this.multipleSelection, 'multipleSelectionmultipleSelection')
            this.multipleSelection.forEach(item => {
              let taskname = item.taskname
              this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!stopTask.action', params: {taskname}, vm: this}).then(res => {
              })
              taskids.push(item.taskid)
            })
            this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!delTasks.action', params: {taskids: taskids.join(',')}, vm: this}).then(res => {
              if (res.success === 'success') {
                this.$message({
                  message: '任务删除成功',
                  type: 'success'
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      /**
       * 核查报告预览
       */
      openHTML() {
        let taskid = this.reportTaskId
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!preview.action', params: {taskid}, vm: this}).then(res => {
          if (res.state !== 'failure') {
            // console.log(res, 'openHTML') // 预览报告
            window.open(`/fuzz/html/${taskid}_html/main.html`, '_blank');
          } else {
            this.$message.error('html文件不存在，报告预览失败~~~')
          }
        })
      },
      /**
       * 核查报告下载
       * @param taskid
       */
      downloadReport () {
        let taskid = this.reportTaskId
        let fileType = this.value
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!judgeJSON.action', params: {taskid}, vm: this}).then(res => {
          if (res.state === 'failure') {
            let params = {fileType, taskid}, name = `${taskid}_html`
            commonExport(params, name, 'fuzz/view/page/VerificationTasks!judgeJSON.action', 'zip')
          } else {
            this.$message.error('报告下载失败~~~')
          }
        })
        this.dialogVisible = false
      },
      /**
       * 树形结构点击事件
       */
      handleNodeClick (data) {
        // console.log(data, 'data tree')
        if (data.level && data.level === 1) {
          this.postFuzz({url: 'fuzz/page/view/checkmanage/strategy!searchTypeBygroupid.action',
            params: {group_id: data.id, start: 0}, vm: this}).then(res => {
            // console.log(res.reu, 'tree request data')
            res.reu.forEach((item, index) => {
              this.data[0]['children'][data.index - 1].children.push({
                index: index,
                name: item[1],
                id: item[4],
                level: 2
              })
            })
          })
        }
        if (data.level && data.level === 2) {
          this.addTaskForm.module = data.name
          this.addTaskForm.moduleId = data.id
        }
      },
      /**
       * 首页table selected 返回值
       * @param val
       */
      handleSelectionChange (val) {
        // console.log(val, 'multipleSelection')
        this.multipleSelection = val
      },
      /**
       * 添加实时任务select
       * @param val
       */
      handleSelectionAsset (val) {
        this.addSelected = val
      },
      /**
       * 获取默认首页table数据
       * @param _index tableData 对应的index
       */
      getTableData (_index) {
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!loaddatas.action', params: {circletask: "1"}, vm: this}).then(res => {
          // console.log(res, 'getTableData')
          let data = res, arr = []
          let i = 0
          data.forEach(item => {
            if (item.groupid === 0) {
              let _item = item
              _item.id = i
              _item.level = 1
              arr.push(item)
              i++
            }
          })
          arr.forEach((item, index) => {
            arr[index]['children'] = []
            for (let i = 0,len = data.length; i < len; i++) {
              if (item.groupid !== data[i]['groupid'] && data[i]['groupid'] === item.taskid) {
                let _data = data[i]
                _data.id = 'a' + index + i
                _data.level = 2
                _data.taskname = `${_data['taskname']}[${_data.taskid}]`
                arr[index]['children'].push(data[i])
              }
            }
          })
          // console.log(_index, arr, 'index 5s')
          if (_index) {
            if (arr[_index]['progress'] === 100) {
              clearInterval(this.timer)
            }
          }
          this.tableData = arr
        })
      },
      handleClick (row, type) {
        // console.log(row, 'row')
        let taskname = row.taskname
        let url = type === 'play' ? 'VerificationTasks!reExecution.action' : 'VerificationTasks!stopTask.action'
        let data = { taskname }
        type === 'play' ? data.task = 'circleTask' : data
        this.fetchFuzz({url: 'fuzz/view/page/' + url, params: data, vm: this}).then(res => {
          console.log(res, 'play or stop')
          if (res.success === 'success') {
            if (type === 'stop') {
              this.$set(this.tableData[row.id], 'progress', row.progress + 200)
              clearInterval(this.timer)
            } else {
              let that = this
              this.$set(this.tableData[row.id], 'progress', 0)
              this.timer = setInterval(() => {
                that.getTableData(row.id)
              }, 5000)
            }
          }
        })
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
      handleClose () {
        this.dialogVisible = false
      },
      /**
       * 打开预览下载报告弹框
       * @param row
       */
      openDownload (row) {
        this.reportTaskId = row.taskid
        this.dialogVisible = true
      }
    }
  }
</script>
<style scoped lang="less">
  .goodsPage {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;

    /*& :hover {*/
    /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);*/
    /*-webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);*/
    /*}*/
    .goodsTop{
      margin-top: 20px;
    }
  }
</style>
