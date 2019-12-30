<template>
	<div class="goodsPage">
		<div class="goodsTop">
      <el-container style="min-height: 500px; height: 100%;border: 1px solid #eee">
        <el-aside width="300px" style="padding: 20px;">
          <!--<el-button icon="el-icon-circle-plus-outline" @click="handleTree('add')"></el-button>-->
          <!--<el-button icon="el-icon-edit-outline" @click="handleTree('edit')"></el-button>-->
          <!--<el-button icon="el-icon-delete" @click="handleTree('delete')"></el-button>-->
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" style="margin-top: 20px;"></el-tree>
        </el-aside>
        <el-container>
          <el-main style="position: relative;">
            <template v-if="!itemDetail">
              <!--<el-button icon="el-icon-plus">新增</el-button>-->
              <!--<el-button icon="el-icon-close">删除</el-button>-->
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top: 20px;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="策略模板名称"></el-table-column>
                <el-table-column prop="type" label="检查项/设备类型"></el-table-column>
                <el-table-column prop="attr" label="模板属性"></el-table-column>
                <el-table-column prop="edit" label="编辑">
                  <template slot-scope="scope">{{'-'}}</template>
                </el-table-column>
                <el-table-column prop="custom" label="自定义参数">
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
              <div v-if="label === '主机类策略组'" style="text-align: center;margin-top: 30px;">
                <el-pagination background :current-page.sync="page" @current-change="handleCurrentChange"
                  :page-size="size" layout="prev, pager, next" :total="20">
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
        page: 1,
        size: 10,
        activeName: 'first',
        tableData:  [{
          name: '全局策略',
          type: '1576/47',
          attr: '预定义'
        }],
        data: [{
          label: '内置策略组',
          children: [{
            label: '综合类策略组',
          }, {
            label: '主机类策略组',
          }, {
            label: '数据库类策略组',
          },{
            label: '中间件策略组',
          },{
            label: '路由器策略组',
          },{
            label: '交换机策略组',
          },{
            label: '防火墙策略组',
          },{
            label: 'WLAN策略组',
          },{
            label: '虚拟机策略组',
          },{
            label: '负载均衡策略组',
          }]
        }],
        label: '',
        defaultProps: {
          children: 'children',
          label: 'label'
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
          {
            check_num: 'Linux',
            check_name: '口令锁定策略',
            check_desc: '设置口令认证失败后锁定策略',
            check_val: '5'
          }
        ],
        itemDetail: false, // 详情
        checkItemData: [
          {
            check_num: 'Windows-1',
            check_name: '口令锁定策略',
            check_type: '/主机/Windows'
          }, {
            check_num: 'Windows-2',
            check_name: '查找未授权的SUID-SGID文件',
            check_type: '/主机/Windows'
          }
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
          {name: 'Windows主机配置策略', type: '68/1', attr: '预定义'},
          {name: 'Windows主机配置策略-1', type: '50/1', attr: '预定义'},
          {name: 'Windows主机配置策略-2', type: '51/1', attr: '预定义'},
          {name: 'Windows主机配置策略-3', type: '48/1', attr: '预定义'},
          {name: 'Windows主机配置策略-4', type: '25/1', attr: '预定义'},
          {name: 'Windows主机配置策略-5', type: '45/1', attr: '预定义'},
          {name: 'Windows主机配置策略-6', type: '55/1', attr: '预定义'},
          {name: 'Windows主机配置策略-7', type: '65/1', attr: '预定义'},
          {name: 'Windows主机配置策略-8', type: '52/1', attr: '预定义'},
          {name: 'Windows主机配置策略-9', type: '45/1', attr: '预定义'},
          {name: 'Windows主机配置策略-10', type: '35/1', attr: '预定义'},
          {name: 'Windows主机配置策略-11', type: '55/1', attr: '预定义'},
          {name: 'Windows主机配置策略-12', type: '54/1', attr: '预定义'},
          {name: 'Windows主机配置策略-13', type: '56/1', attr: '预定义'},
          {name: 'Windows主机配置策略-14', type: '58/1', attr: '预定义'},
          {name: 'Windows主机配置策略-15', type: '45/1', attr: '预定义'},
          {name: 'Windows主机配置策略-16', type: '65/1', attr: '预定义'},
          {name: 'Windows主机配置策略-17', type: '25/1', attr: '预定义'},
          {name: 'Windows主机配置策略-18', type: '58/1', attr: '预定义'},
          {name: 'Windows主机配置策略-19', type: '59/1', attr: '预定义'},
          {name: 'Windows主机配置策略-20', type: '60/1', attr: '预定义'},
        ]
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
        if (val === 1) {
          this.tableData = this.copyData.slice(0, 10)
        } else {
          this.tableData = this.copyData.slice(10)
        }
      },
      handleNodeClick (data) {
        console.log(data)
        this.label = data.label
        if (data.label === '综合类策略组') {
          this.tableData = [{
            name: '全局策略',
            type: '1576/47',
            attr: '预定义'
          }]
        } else if (data.label === '主机类策略组') {
          this.tableData = this.copyData.slice(0, 10)
        } else {
          this.tableData = [
            {name: 'oracle数据库配置策略', type: '33/1', attr: '预定义'},
            {name: 'sqlsever配置策略', type: '16/1', attr: '预定义'}
          ]
        }
      },
      /**
       * 树形结构操作
       * @param type
       */
      handleTree (type) {
        this.type = type
        if (type === 'add') { // 增加
          this.editTree = true
        } else if (type === 'edit') { // 编辑
          this.editTree = true
        } else { // 删除
          this.$confirm('您确认是否要删除该组?', '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      /**
       * 检查项设置
       */
      checkRowData () {

      },
      /**
       * 自定义设置参数
       * @param type
       */
      setArguments (type) {
        this.checkList = false
        let _messages = type === 'ok' ? '自定义参数设置成功' : '已取消自定义参数设置'
        this.$message({
          message: _messages,
          type: 'info'
        });
      },
      handleClick (row) {
        this.itemDetail = !this.itemDetail
      }

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
