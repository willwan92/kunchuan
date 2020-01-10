<template>
  <div class="goodsPage">
    <div class="goodsTop">
      <el-container style="min-height: 500px; height: 100%;border: 1px solid #eee">
        <el-aside width="300px" style="padding: 20px;">
          <el-tree :data="TreeData" :props="defaultProps" @node-click="handleNodeClick" v-if="showTree" style="margin-top: 20px;"></el-tree>
        </el-aside>
        <el-container>
          <el-main style="position: relative;">
            <template v-if="!itemDetail">
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top: 20px;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="num" label="核查项编号" width="125"></el-table-column>
                <el-table-column prop="name" label="检查项名称"></el-table-column>
                <el-table-column prop="desc" label="内容"></el-table-column>
                <el-table-column prop="attr" label="核查项属性" width="90"></el-table-column>
                <el-table-column prop="type" label="核查方式" width="80"></el-table-column>
                <el-table-column fixed="right" label="详情" width="60">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">操作</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="tableTotals !== 0" style="text-align: center;margin-top: 30px;">
                <el-pagination background :current-page.sync="resData.page" @current-change="handleCurrentChange"
                               :page-size="resData.size" layout="prev, pager, next" :total="tableTotals">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <span class="el-icon-refresh-left re-back" @click="itemDetail = false">返回</span>
              <el-tabs v-model="checkItemDetailName" type="card" @tab-click="handleClickTab">
                <el-tab-pane label="基本信息" name="basicInfo">
                  <template>
                    <el-form label-position="left" label-width="120px" :model="checkBasicInfo">
                      <el-form-item label="检查项名称">
                        <el-input v-model="checkBasicInfo.name" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="设备类型">
                        <el-input v-model="checkBasicInfo.stype" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="检查项编号">
                        <el-input v-model="checkBasicInfo.check_code" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="所属分类">
                        <el-input v-model="checkBasicInfo.whattype" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <!--<el-form-item label="自定义组">-->
                        <!--<el-input v-model="checkBasicInfo.custom" :disabled="checkBasicInfo.disable"></el-input>-->
                      <!--</el-form-item>-->
                      <el-form-item label="配置要求">
                        <el-input type="textarea" v-model="checkBasicInfo.check_content" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="检测方法与依据">
                        <el-input type="textarea" v-model="checkBasicInfo.judge_by" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="加固方案">
                        <el-input type="textarea" v-model="checkBasicInfo.reinforce" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="权重">
                        <el-select v-model="checkBasicInfo.weight" placeholder="--请选择--" :disabled="checkBasicInfo.disable">
                          <el-option v-for="item in 10" :label="item" :value="item" :key="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-tab-pane>
                <el-tab-pane label="核查信息" name="checkInfo">
                  <template>
                    <el-form label-position="left" label-width="120px" :model="checkBasicInfo">
                      <el-form-item label="检查方式">
                        <el-radio-group v-model="checkBasicInfo.is_auto" :disabled="checkBasicInfo.disable">
                          <el-radio label="1">自动</el-radio>
                          <el-radio label="0">手动</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="检查脚本">
                        <el-input v-model="checkBasicInfo.name" :disabled="checkBasicInfo.disable"></el-input>
                      </el-form-item>
                      <el-form-item label="解析方式">
                        <el-radio-group v-model="checkBasicInfo.parse_type" :disabled="checkBasicInfo.disable">
                          <!--<el-radio label="" value="0">手动</el-radio>-->
                          <el-radio label="1">正则表达式</el-radio>
                          <el-radio label="2">JavaScript函数</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="检查点">
                        <el-table :data="checkPointTable" border>
                          <el-table-column prop="check_num" label="检查项编号">
                            <template slot-scope="scope"><p v-html="scope.row.check_num"></p></template>
                          </el-table-column>
                          <el-table-column prop="check_base_desc" label="基线值说明">
                            <template slot-scope="scope"><p v-html="scope.row.check_base_desc"></p></template>
                          </el-table-column>
                          <el-table-column prop="check_jude" label="判定符">
                            <template slot-scope="scope"><p v-html="scope.row.check_jude"></p></template>
                          </el-table-column>
                          <el-table-column prop="check_base" label="合规标准值">
                            <template slot-scope="scope"><p v-html="scope.row.check_base"></p></template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                      <el-form-item label="检查点规则">
                        <el-input type="textarea" v-model="checkBasicInfo.baseLineValuesRel" :disabled="checkBasicInfo.disable"></el-input>
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
        showTree: true,
        tableTotals: 0,
        treeId: '',
        resData: {
          page: 1,
          size: 10,
        },
        label: '',
        tableData: [],
        data: [{
          name: '检查项分组',
          level: 0,
          children: [
            {name: '资产类型分组', id: 10004, pid: -1, status: 0, level: 1, children: []}
          ]
        }], // 树形结构数据
        defaultProps: {
          children: 'children',
          label: 'name'
        }, // 树形props
        itemDetail: false, // 详情
        checkItemDetailName: 'basicInfo',
        checkBasicInfo: {},
        scriptId: '',
        checkid: '',
        talbeDataId: ''
      }
    },
    computed: {
      TreeData () {
        return this.data
      },
      checkPointTable () {
        let data = typeof this.checkBasicInfo.datalist === 'string' ? this.checkBasicInfo.datalist.split(',') : this.checkBasicInfo.datalist
        let arr = []
        if (data) {
          arr.push({
            check_num: data[0],
            check_base_desc: data[1],
            check_jude: data[2],
            check_base: data[3]
          })
        }
        return arr
      }
    },
    created () {
      this.initData()
    },
    methods: {
      /**
       *table 分页
       * val 分页数据
       */
      handleCurrentChange (val) {
        this.resData.page = val
        this.getTableData(this.talbeDataId)
      },
      /**
       * 点击属性结构函数
       */
      handleNodeClick (data) {
        if (data.level === 3) {
          this.treeId = data.id
          this.talbeDataId = data.id
          this.getTableData(data.id)
        }
      },
      getTableData (id) {
        this.postFuzz({url: '/fuzz/page/view/checkItem!findAliasByid.action', params: {id}, vm: this}).then(res => {
          let alias = res.alias,stype = res.name, _id = res.id
          this.fetchFuzz({url: '/fuzz/page/view/checkItem!check_itemDetail.action', params: {
              start: (parseInt(this.resData.page - 1) * 10), t: Math.random(),alias, stype, id: _id
            }, vm: this}).then(res => {
            // console.log(res.datas, 'data table')
            this.tableData = res.datas.map(item => {
              return {
                num: item[1],
                name: item[2], desc: item[3], attr: item[4],type: item[5], id: item[0]
              }
            })
            this.tableTotals = res.total
          })
        })
      },
      /**
       * 点击操作查看基本信息和核查信息
       * @param type
       */
      handleClick (row) { // checkmanage/checkItem!checkIteminfo.action?checkid=201
        this.itemDetail = !this.itemDetail
        this.checkItemDetailName = 'basicInfo'
        this.checkid = row.id
        this.getItemView(this.checkid, 'checkItemDetailinfo')
      },
      getItemView (checkid, type, scriptId) {
        let params = {checkid}
        scriptId ? params.script_id = scriptId : params
        this.fetchFuzz({url: `/fuzz/page/view/checkmanage/checkItem!${type}.action`, params: params, vm: this}).then(res => {
          if (type === 'checkItemDetailinfo') {
            this.scriptId = res.script_id
          }
          // console.log(res, 'res')
          for (let i in res) {
            this.$set(this.checkBasicInfo, i, res[i] + '')
          }
          this.checkBasicInfo.disable = true
        })
      },
      /**
       * 弹窗tab点击
       * @param tab
       */
      handleClickTab (tab) {
        this.checkItemDetailName = tab.name
        if (tab.name === 'checkInfo') { // 核查项
          this.getItemView(this.checkid, 'checkIteminfo', this.scriptId)
        } else { // 基本信息
          this.getItemView(this.checkid, 'checkItemDetailinfo')
        }
      },
      /**
       * 获取树形结构数据
       * @returns {Promise<void>}
       */
      initData () {
        this.fetchFuzz({url: '/fuzz/page/view/checkItem!checkItemTree.action', vm: this}).then(res => {
          // console.log(res.data, 'data list')
          let data = res.data
          let arr = []
          data.forEach(item => {
            if (item.pId === 0) {
              let _item = item
              _item.children = []
              _item.level = 2
              arr.push(_item)
            }
          })
          arr.forEach((item, index) => {
            data.forEach((_item, _index) => {
              if (item.pId !== _item.pId && item.id === _item.pId) {
                let __item = _item
                __item.level = 3
                arr[index]['children'].push(_item)
              }
            })
          })
          this.$set(this.data[0]['children'][0], 'children', arr)
        })
        let _this = this
        _this.showTree = false
        setTimeout(() => {
          _this.showTree = true
        }, 500)
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
