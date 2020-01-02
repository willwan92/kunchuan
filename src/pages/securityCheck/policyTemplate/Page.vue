<template>
	<div class="goodsPage">
		<div class="goodsTop">
      <el-container style="min-height: 500px; height: 100%;border: 1px solid #eee">
        <el-aside width="300px" style="padding: 20px;">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" style="margin-top: 20px;"></el-tree>
        </el-aside>
        <el-container>
          <el-main style="position: relative;">
            <template v-if="!itemDetail">
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top: 20px;">
                <el-table-column type="selection":selectable='selectable' width="55"></el-table-column>
                <el-table-column prop="name" label="策略模板名称"></el-table-column>
                <el-table-column prop="type" label="检查项/设备类型"></el-table-column>
                <el-table-column prop="attr" label="模板属性" width="100"></el-table-column>
                <el-table-column prop="edit" label="编辑" width="80">
                  <template slot-scope="scope">{{'-'}}</template>
                </el-table-column>
                <el-table-column prop="custom" label="自定义参数" width="110">
                  <template slot-scope="scope">
                    <i class="el-icon-s-tools" @click="checkList = true"></i>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="详情" width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">[详细]</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: center;margin-top: 30px;" v-if="tableTotals !== 0">
                <el-pagination background :current-page.sync="resData.page" :total="tableTotals"
                               @current-change="handleCurrentChange" :page-size="resData.size" layout="prev, pager, next">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <span class="el-icon-refresh-left re-back" @click="itemDetail = false">返回</span>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="windows主机配置策略的检查项列表" name="first">
                  <template>
                    <el-table :data="checkItemData" border style="width: 100%">
                      <el-table-column prop="check_num" label="检查项编号"></el-table-column>
                      <el-table-column prop="check_name" label="检查项名称"></el-table-column>
                      <el-table-column prop="check_type" label="类型"></el-table-column>
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button @click="checkItemDetail = true" type="text" size="small">查看</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-if="label === '主机类策略组'" style="text-align: center;margin-top: 30px;">
                      <el-pagination background :current-page.sync="page" @current-change="handleCurrentChange"
                                     :page-size="size" layout="prev, pager, next" :total="20">
                      </el-pagination>
                    </div>
                  </template>
                </el-tab-pane>
              </el-tabs>
              <el-dialog title="检查项详情" :visible.sync="checkItemDetail" width="60%">
                <el-tabs v-model="checkItemDetailName" type="card">
                  <el-tab-pane label="基本信息" name="basicInfo">
                    <el-form label-position="left" label-width="120px" :model="checkBasicInfo">
                      <el-form-item label="检查项名称">
                        <el-input v-model="checkBasicInfo.name" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="设备类型">
                        <el-input v-model="checkBasicInfo.type" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="检查项编号">
                        <el-input v-model="checkBasicInfo.num" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="所属分类">
                        <el-select v-model="checkBasicInfo.itemize" placeholder="--请选择--" :disabled="checkBasicInfo.disable">
                          <el-option label="账号管理" value="1"></el-option>
                          <el-option label="账号管理" value="2"></el-option>
                          <el-option label="账号管理" value="3"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="自定义组">
                        <el-input v-model="checkBasicInfo.custom" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="配置要求">
                        <el-input type="textarea" v-model="checkBasicInfo.allocation" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="检测方法与依据">
                        <el-input type="textarea" v-model="checkBasicInfo.basis" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="加固方案">
                        <el-input type="textarea" v-model="checkBasicInfo.programme" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="权重">
                        <el-select v-model="checkBasicInfo.weight" placeholder="--请选择--" :disabled="checkBasicInfo.disable">
                          <el-option label="1" value="1"></el-option>
                          <el-option label="2" value="2"></el-option>
                          <el-option label="3" value="3"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="核查信息" name="checkInfo">
                    <el-form label-position="left" label-width="120px" :model="checkBasicInfo">
                      <el-form-item label="检查方式">
                        <el-radio-group v-model="checkBasicInfo.mode" :disabled="checkBasicInfo.disable">
                          <el-radio label="自动" value="1"></el-radio>
                          <el-radio label="手动" value="2"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="检查脚本">
                        <el-input v-model="checkBasicInfo.script" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="解析方式">
                        <el-radio-group v-model="checkBasicInfo.parsingWay" :disabled="checkBasicInfo.disable">
                          <el-radio label="正则表达式" value="1"></el-radio>
                          <el-radio label="JavaScript函数" value="2"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="检查点">
                        <el-input type="textarea" v-model="checkBasicInfo.point" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="检查点规则">
                        <el-input type="textarea" v-model="checkBasicInfo.rule" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="checkItemDetail = false">返 回</el-button>
                </div>
              </el-dialog>
            </template>
          </el-main>
        </el-container>
      </el-container>
      <el-dialog :title="type === 'add' ? '新增组' : '编辑组'" :visible.sync="editTree">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.desc" :rows="4" placeholder="请输入描述">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editTree = false">取 消</el-button>
          <el-button type="primary" @click="editTree = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="核查项列表" :visible.sync="checkList">
        <el-table :data="checkData" border style="width: 100%" @row-click="checkRowData">
          <el-table-column prop="check_num" label="检查项编号" width="180"></el-table-column>
          <el-table-column prop="check_name" label="检查项名称" width="180"></el-table-column>
          <el-table-column prop="check_desc" label="基线值说明"></el-table-column>
          <el-table-column prop="check_val" label="基线值"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="setArguments('close')">取 消</el-button>
          <el-button type="primary" @click="setArguments('ok')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
	</div>
</template>

<script>
	export default {
    data() {
      // const item = {
      //   name: 'Linux主机配置策略',
      //   type: '57/1',
      //   attr: '预定义'
      // };
      return {
        resData: {
          page: 1,
          size: 10
        },
        tableTotals: 0, // 查询策略组总条数
        page: 1,
        size: 10,
        activeName: 'first',
        tableData:  [],
        data: [{name: '内置策略组', pid: 0, _id: 1, is_buildin: 1, children: []}],
        activeLabel: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        editTree: false, // 添加或者编辑树形结构dialog
        checkList: false, // 核查项列表dialog
        checkItemDetail: false, // 检查项详情dialog
        form: {
          name: '',
          desc: ''
        },
        formLabelWidth: '120px',
        type: '',
        checkData: [
          {check_num: 'windows-1', check_name: '启用审核对象访问的审核', check_desc: '启用审核对象访问的审核', check_val: '3'},
          {check_num: 'windows-2', check_name: '关键权限指派安全要求取得文件或其他对象的所有权', check_desc: '关键权限指派安全要求取得文件或其他对象的所有权', check_val: '*S-1-5-32-544'},
          {check_num: 'windows-3', check_name: '关键权限指派安全要求关闭系统', check_desc: '关键权限指派安全要求关闭系统', check_val: '*S-1-5-32-544'},
          {check_num: 'windows-4', check_name: '修改默认远程登录端口', check_desc: '修改默认远程登录端口', check_val: 'Oxd3d'},
          {check_num: 'windows-5', check_name: '口令重复使用次数显示', check_desc: '口令重复使用次数显示', check_val: '5'},
        ],
        itemDetail: false, // 详情
        checkItemData: [
          {check_num: 'Windows-1', check_name: '口令锁定策略', check_type: '/主机/Windows'},
          {check_num: 'Windows-2', check_name: '查找未授权的SUID-SGID文件', check_type: '/主机/Windows'}
        ],
        checkItemDetailName: 'basicInfo',
        checkBasicInfo: {
          name: '口令锁定策略', // 检查项名称
          type: '/主机/Windows', // 设备类型
          num: 'Windows-1', // 检查项编号
          itemize: '1', // 所属分类
          custom: '/自定义分组/自定义1', // 自定义组
          allocation: '对于采用静态口令认证技术的设备，应配置当用户连续认证失败次数超过6次（不含6次），锁定该用户使用的账号', // 配置要求
          basis: '判定依据', // 检测方法与判断依据
          programme: '参考配置操作： 1.执行备份 2.修改策略设', // 加固方案
          weight: '2',  // 权重
          mode: '1', // 检查方式
          script: '检查口令锁定策略', // 检查脚本
          parsingWay: '1', // 解析方式
          point: '', // 检查点
          rule: 'v0 && v1', // 检查点规则
          disable: true,
        },
        copyData: [
          {check_num: 'Windows-1', check_name: '启用审核对象访问的审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-2', check_name: '关键权限指派安全要求取得文件或者其他对象的所有权', check_type: '/主机/Windows'},
          {check_num: 'Windows-3', check_name: '关键权限指派安全要求关闭系统', check_type: '/主机/Windows'},
          {check_num: 'Windows-4', check_name: '修改默认远程登录端口', check_type: '/主机/Windows'},
          {check_num: 'Windows-5', check_name: '口令重复使用次数限制', check_type: '/主机/Windows'},
          {check_num: 'Windows-6', check_name: '共享文件夹权限设置', check_type: '/主机/Windows'},
          {check_num: 'Windows-7', check_name: '记录账户登录日志', check_type: '/主机/Windows'},
          {check_num: 'Windows-8', check_name: 'TCPIP筛选配置', check_type: '/主机/Windows'},
          {check_num: 'Windows-9', check_name: '关闭默认共享', check_type: '/主机/Windows'},
          {check_num: 'Windows-10', check_name: '启用审查账户管理的审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-11', check_name: '启用SYN攻击保护', check_type: '/主机/Windows'},
          {check_num: 'Windows-12', check_name: '日志文件大小设置', check_type: '/主机/Windows'},
          {check_num: 'Windows-13', check_name: '禁用guest用户', check_type: '/主机/Windows'},
          {check_num: 'Windows-14', check_name: '启用审核过程的追踪审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-15', check_name: '启用审核系统事件的审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-16', check_name: '启用审核目录服务访问的审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-17', check_name: '口令生存周期要求', check_type: '/主机/Windows'},
          {check_num: 'Windows-18', check_name: '启用审核特权使用的审核', check_type: '/主机/Windows'},
          {check_num: 'Windows-19', check_name: '启用并正确配置Windows网络时间同步', check_type: '/主机/Windows'},
          {check_num: 'Windows-20', check_name: '安装系统补丁Hotfix', check_type: '/主机/Windows'},
        ]
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initData()
      })
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        if (val === 1) {
          this.checkItemData = this.copyData.slice(0, 10)
        } else {
          this.checkItemData = this.copyData.slice(10)
        }
      },
      async getTableList(id) {
        await this.postFuzz({
          url: "/fuzz/page/view/checkmanage/strategy!searchTypeBygroupid.action",
          params: {start: this.resData.page, group_id: id},
          vm: this
        }).then(res => {
          console.log(res.reu, 'reu')
          let _this = this
          this.tableData = res.reu.map((item, index) => {
            return {
              name: item[1],
              type: item[2],
              attr: item[3],
              is_buildin: _this.data[0]['children'][index]['is_buildin']
            }
          })
        })
        console.log(this.tableData, 'getTable')
      },

      handleNodeClick(data) {
        console.log(data)
        this.activeLabel = data
        if (data.pid === 1) {
          this.resData.page = 1
          this.getTableList(data.id)
          this.postFuzz({
            url: '/fuzz/page/view/checkmanage/strategy!findTotals.action', params: {group_id: data.id}, vm: this
          }).then(res => {
            this.tableTotals = res.totalNum
          })
        }
      },
      /**
       * 检查项设置
       */
      checkRowData() {

      },
      /**
       * 自定义设置参数
       * @param type
       */
      setArguments(type) {
        this.checkList = false
        let _messages = type === 'ok' ? '自定义参数设置成功' : '已取消自定义参数设置'
        this.$message({
          message: _messages,
          type: 'info'
        });
      },
      handleClick(row) {
        this.itemDetail = !this.itemDetail
        this.checkItemData = this.copyData.slice(0, 10)
      },
      /**
       * 分页点击
       */
      handleCurrentChange(val) {
        this.resData.page = val
        this.getTableList(this.activeLabel.id)
      },
      /**
       * 树形结构数据
       */
      async initData() {
        const {data} = await this.fetchFuzz({
          url: '/fuzz/page/view/strategy!strategyTree.action',
          vm: this
        })

        let children = []
        data.forEach(item => {
          if (item.pid !== 0) {
            children.push(item)
          }
        })
        this.data[0]['children'] = children
      },
      /**
       * 判断复选框是否可点击
       * @param row
       * @param index
       * @returns {number} 0 no 1 yes
       */
      selectable(row, index) {
        return row.is_buildin === 1 ? 0 : 1
      },
    }
  }
</script>
<style lang="less">
  .goodsPage {
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
    .goodsTop{
      .re-back {
        display: inline-block;
        position: absolute;
        cursor: pointer;
        right: 20px;
        top: 30px;
        z-index: 99999;
      }
    }
  }
</style>
