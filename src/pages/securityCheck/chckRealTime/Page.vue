<template>
	<div class="goodsPage">
		<div class="goodsTop">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="实时任务" name="first">
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
                  <i class="el-icon-video-play" @click="handleClick(scope.row, 'play')" style="color: #009688;font-size: 16px;"></i>
                  <i class="el-icon-video-pause" @click="handleClick(scope.row, 'stop')" style="color: red;"></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="核查报告" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div style="padding: 20px;">
          <div>
            <span style="padding-right: 40px;">报告预览</span><span @click="openHTML">预览（html）</span>
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
      <el-dialog title="添加实时任务" :visible.sync="addTask" width="60%">
        <div>
          <el-form :model='addTaskForm' :rules="rules" ref="ruleForm" label-width="120">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="addTaskForm.name" style="width: 508px;"></el-input>
            </el-form-item>
            <el-form-item label="项目选择">
              <el-select v-model="addTaskForm.task" placeholder="请选择" @change="queryStation">
                <el-option v-for="(item, index) in stationList" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="核查方式">
              <el-select v-model="addTaskForm.type" placeholder="请选择" disabled>
                <el-option label="实时任务" value="1"></el-option>
                <!--<el-option label="公网" value="2"></el-option>-->
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
            <el-input v-model="assetListItem.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="assetListItem.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="su用户名">
            <el-input v-model="assetListItem.su_user"></el-input>
          </el-form-item>
          <el-form-item label="su密码">
            <el-input v-model="assetListItem.su_passwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="数据库路径">
            <el-input v-model="assetListItem.dbpath"></el-input>
          </el-form-item>
          <el-form-item label="数据库账号">
            <el-input v-model="assetListItem.dbuser"></el-input>
          </el-form-item>
          <el-form-item label="数据库口令">
            <el-input v-model="assetListItem.dbpassword" type="password"></el-input>
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

	export default {
		data() {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入任务名称'))
        } else {
          this.fetchFuzz({url: '/fuzz/page/view/VerificationTasks!findTaskName.action', params: {taskname: value}, vm: this}).then(res => {
            console.log(res, 'validateName')
            if (res.success === 'null') {
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
        stationList: [], // 添加任务项目下拉选择
        assetList: [], // 添加任务资产列表
        assetListDialog: false, //添加任务资产列表操作弹框
        assetListItem: {}, // 添加任务资产列表操作数据
        loginTypeList: [], // 登录方式
        devTypeList: [], // 资产类型列表
        vendorList: [], // 厂家名称
        productList: [], // 设备型号
        OSList: [], // 操作系统列表
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
        addSelected: [],
        loading: false,
        dialogVisible: false, // 下载报告
        value: 'HTML',
        addTask: false,
        addTaskForm: {
          name: '',
          task: '',
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
			}
		},
    mounted () {
		  this.getTableData()
		  this.initData()
    },
    methods: {
		  /**
       * 点击添加按钮
       */
      addTaskFun () {
        this.addTask = true
        this.getStationList()
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
		    const {data} = await this.fetchFuzz({url: 'fuzz/view/page/station!loaddatas.action', params: {}, vm: this})
        console.log(data, 'getStationList')
        this.stationList = data.map(item => {
          return { name: item[0], label: item[1], id: item[2], type: item[3]}
        })
      },
      /**
       * 查询资产列表
       */
      queryStation () {
		    let pjid = this.addTaskForm.task
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
        let pjid = this.addTaskForm.task, ip = row.ip
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!showOneProList.action', params: {ip, pjid}, vm: this}).then(res => {
          console.log(res, 'assetItem')
          this.assetListItem = res.data
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
          "stationname": this.addTaskForm.name, // 添加实时任务页面传过来的
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
        this.fetchFuzz({url: 'fuzz/view/page/device!editdevice.action', params: {data}, vm: this}).then(res => {
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
        let data = {
          'taskname': this.addTaskForm.name,  // 任务名称
          'template': this.addTaskForm.moduleId,  // 策略模板 id 主机 3
          // 'autoupload' : 0, // 已取消 autoupload=1 为自动上传界面打钩；界面不打勾autoupload=0(非自动上传)
          'pjid' : this.addTaskForm.task, // 项目名称 id
          'str' : str.join(',')   //  资产列表中选中列ip地址的值,逗号拼接
        };
        console.log(data, 'data')
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!addAcTask.action', params: {data}, vm:this}).then(res => {
          this.addTask = false
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
          let taskids = []
          this.multipleSelection.forEach(item => {
            let taskname = '' // 未有具体字段
            this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!stopTask.action', params: {taskname}, vm: this}).then(res => {
            })
            taskids.push(item.id)
          })
          this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!delTasks.action', params: {taskids: taskids.join(',')}, vm: this}).then(res => {
            this.$message({
              message: '任务删除成功',
              type: 'success'
            });
          })
        }
      },
      /**
       * 核查报告预览
       */
      openHTML(taskid) {
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!preview.action', params: {taskid}, vm: this}).then(res => {
          window.open(`${FUZZ_URL}/html/21_html/main.html`, '_blank');
        })
      },
      downloadReport (taskid) {
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!judgeJSON.action', params: {taskid}, vm: this}).then(res => {
          this.dialogVisible = false
        })
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
            // console.log(this.data, 'tree data llolll')
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
        console.log(val, 'multipleSelection')
        this.multipleSelection = val
      },
      /**
       * 添加实时任务select
       * @param val
       */
      handleSelectionAsset (val) {
        console.log(val, 'addSelected')
        this.addSelected = val
      },
      /**
       * 获取首页table数据
       */
      getTableData () {
        this.fetchFuzz({url: 'fuzz/view/page/VerificationTasks!loaddatas.action', params: {actask: "1"}, vm: this}).then(res => {
          console.log(res, 'getTableData')
          this.tableData = res
        })
      },
      handleClick (row, type) {
        console.log(row, 'row')
        let taskname = ''
        let url = 'fuzz/view/page/' + type === 'play' ? 'VerificationTasks!reExecution.action' : 'VerificationTasks!stopTask.action'
        this.fetchFuzz({url: url, params: {taskname}, vm: this}).then(res => {
          console.log(res, 'play or stop')
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
      handleClose () {
        this.dialogVisible = false
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
