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
                <el-table-column prop="num" label="核查项编号"></el-table-column>
                <el-table-column prop="name" label="检查项名称"></el-table-column>
                <el-table-column prop="desc" label="内容"></el-table-column>
                <el-table-column prop="attr" label="核查项属性"></el-table-column>
                <el-table-column prop="type" label="核查方式"></el-table-column>
                <el-table-column fixed="right" label="详情" width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">操作</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="label === 'windows'" style="text-align: center;margin-top: 30px;">
                <el-pagination background :current-page.sync="page" @current-change="handleCurrentChange"
                               :page-size="size" layout="prev, pager, next" :total="20">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <span class="el-icon-refresh-left re-back" @click="itemDetail = false">返回</span>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <template>
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
                  </template>
                </el-tab-pane>
                <el-tab-pane label="核查信息" name="second">
                  <template>
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
                  </template>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        size: 10,
        label: '',
        activeName: 'first',
        tableData: [
          {num: 'Linux-1', name: '口令锁定策略', desc: '对于采用静态口令，应采用设置用户...', type: '自动', attr: '系统内置'},
          {num: 'Linux-2', name: '查找未授权的SUID-SGID文件', desc: '去掉所有文件‘文件系统’属性，防止用户滥用...', type: '自动', attr: '系统内置'}
        ],
        data: [{
          label: '检查项分组',
          children: [{
            label: '资产类型分组',
            children: [{
              label: '主机',
              children: [{
                label: 'Linux',
              }, {
                label: 'windows',
              }, {
                label: 'AIX',
              }, {
                label: 'Solaris',
              },{
                label: 'HP-UX',
              }, {
                label: '中标麒麟',
              }, {
                label: '凝思',
              }]
            },{
              label: '数据库',
              children: [
                {label: 'oracle'}, {label: 'sqlserver'},{label: 'mysql'},{label: 'db2'},{label: 'sybase'},
                {label: 'Informix'}, {label: 'PostgreSQL'},{label: '武汉达梦'},{label: '人大金仓'},{label: '神州通用'},
                {label: '南大通用'}
              ]
            }, {
              label: '交换机',
              children: [{
                label: '华为',
              }, {
                label: '思科',
              }, {
                label: '中心',
              }, {
                label: 'H3C',
              }, {
                label: '锐捷',
              }, {
                label: '力腾',
              }, {
                label: 'Juinper',
              }]
            }]
          }]
        }],
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
        // type: '',
        itemDetail: false, // 详情
        checkItemData: [
          {
            check_num: 'Linux-1',
            check_name: '口令锁定策略',
            check_type: '/主机/Linux'
          }, {
            check_num: 'Linux-2',
            check_name: '查找未授权的SUID-SGID文件',
            check_type: '/主机/Linux'
          }
        ],
        checkItemDetailName: 'basicInfo',
        checkBasicInfo: {
          name: '口令锁定策略', // 检查项名称
          type: '/主机/Linux', // 设备类型
          num: 'Linux-1', // 检查项编号
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
          disable: true
        },
        copyData: [
          {num: 'windows-1', name: '启用审核对象访问的审核', desc: '启用组策略中对windows系统的审核对象的访问，成功和失败都要访问...', type: '自动', attr: '系统内置'},
          {num: 'windows-2', name: '关键权限指派安全要求取得文件或其他...', desc: '在本地安全设置中取得文件或其他对象的所以权限...', type: '自动', attr: '系统内置'},
          {num: 'windows-3', name: '关键权限指派安全要求关闭系统', desc: '在本地安全设置中关闭系统仅指派给admin...', type: '自动', attr: '系统内置'},
          {num: 'windows-4', name: '修改默认远程登录端口...', desc: '如对互联网开放WindowsTerminal服务（remote...', type: '自动', attr: '系统内置'},
          {num: 'windows-5', name: '口令重复使用字数限制', desc: '对于采用静态口令认证的技术设备，应配置设备，...', type: '自动', attr: '系统内置'},
          {num: 'windows-6', name: '共享文件夹权限设置', desc: '查看每个共享文件夹的共享权限，只允许授权的...', type: '自动', attr: '系统内置'},
          {num: 'windows-7', name: '记录账户登录日志...', desc: '设备应配置日志功能，对用户登录进行记录...', type: '自动', attr: '系统内置'},
          {num: 'windows-8', name: 'TCOIP筛选配置', desc: '对没有自带防火墙的windows系统，启用...', type: '自动', attr: '系统内置'},
          {num: 'windows-9', name: '关闭默认共享', desc: '非域环境中，关闭window硬盘默认共享，例如...', type: '自动', attr: '系统内置'},
          {num: 'windows-10', name: '启用审核账号的管理审核', desc: '启用组策略中对windows系统的账号审核管理...', type: '自动', attr: '系统内置'},
          {num: 'windows-11', name: '启用SYN攻击保护', desc: '启用SYN攻击保护，制定出发SYN洪水攻击保护...', type: '自动', attr: '系统内置'},
          {num: 'windows-12', name: '日志文件大小设置', desc: '设置日志应用文件大小至少小于8192kb,设置系统...', type: '自动', attr: '系统内置'},
          {num: 'windows-13', name: '禁用guest用户', desc: '删除或锁定与设备运行，维护等于工作无关的装好...', type: '自动', attr: '系统内置'},
          {num: 'windows-14', name: '启用审核过程追踪的审核', desc: '启用组策略中对Windows系统的审核追踪...', type: '自动', attr: '系统内置'},
          {num: 'windows-15', name: '启用审核过程事件的审核', desc: '启用组策略中对Windows系统的系统事件...', type: '自动', attr: '系统内置'},
          {num: 'windows-16', name: '启用审核目录服务访问的审核', desc: '启用组策略中对Windows系统的审核目录服务...', type: '自动', attr: '系统内置'},
          {num: 'windows-17', name: '口令生存周期要求', desc: '对于采用静态口令认证系统的审核设备，账户口令的生成...', type: '自动', attr: '系统内置'},
          {num: 'windows-18', name: '启用审核特权使用的审核', desc: '启用组策略中对Windows系统的审核特权使用...', type: '自动', attr: '系统内置'},
          {num: 'windows-19', name: '启用并正确配置Windows网络时间', desc: '通过微软active directory管理的终端，或者是独立...', type: '自动', attr: '系统内置'},
          {num: 'windows-20', name: '安装系统补丁', desc: '应安装最新的补丁，对服务器系统应先进行...', type: '自动', attr: '系统内置'},
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
        this.label = data.label
        if (data.label === 'Linux') {
          this.tableData = [
            {num: 'Linux-1', name: '口令锁定策略', desc: '对于采用静态口令，应采用设置用户...', type: '自动', attr: '系统内置'},
            {num: 'Linux-2', name: '查找未授权的SUID-SGID文件', desc: '去掉所有文件‘文件系统’属性，防止用户滥用...', type: '自动', attr: '系统内置'}
          ]
        } else if (data.label === '华为') {
          this.tableData = [
            {num: 'Huawei(sw)-1', name: '已知典型攻击防护', desc: '通过ACL配置对常见的漏洞攻击及进行...', type: '自动', attr: '系统内置'},
            {num: 'Huawei(sw)-2', name: '修改SNMP默认的community字符串', desc: '系统应修改SNMP默认团体字符串...', type: '自动', attr: '系统内置'}
          ]
        } else if (data.label === 'oracle') {
          this.tableData = [
            {num: 'Oracle-1', name: '检查是否根据业务要求定制数据库审查策略', desc: '检查是否根据业务要求定制数据库审查策略...', type: '自动', attr: '系统内置'},
            {num: 'Oracle-2', name: '口令生存期', desc: '对于采用静态口令认证技术的数据库，账户口令...', type: '自动', attr: '系统内置'}
          ]
        } else if (data.label === 'windows') {
          this.tableData = this.copyData.slice(0, 10)
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
