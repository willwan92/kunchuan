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
                    <i class="el-icon-s-tools" @click="getArguments(scope.row)"></i>
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
                               @current-change="(val) => handleCurrentChange(val, 'table')" :page-size="resData.size" layout="prev, pager, next">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <span class="el-icon-refresh-left re-back" @click="itemDetail = false">返回</span>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane :label="itemDetailTitle" name="first">
                  <template>
                    <el-table :data="checkItemData" border style="width: 100%">
                      <el-table-column label="检查项编号">
                        <template slot-scope="scope">
                          <span v-html="scope.row.check_num"></span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="check_name" label="检查项名称"></el-table-column>
                      <el-table-column prop="check_type" label="类型"></el-table-column>
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button @click="itemView(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div style="text-align: center;margin-top: 30px;"v-if="detailTotal !== 0" >
                      <el-pagination background :current-page.sync="resData.page" layout="prev, pager, next" :total="detailTotal"
                                     @current-change="(val) => handleCurrentChange(val, 'detail')" :page-size="resData.size">
                      </el-pagination>
                    </div>
                  </template>
                </el-tab-pane>
              </el-tabs>
              <el-dialog title="检查项详情" :visible.sync="checkItemDetail" width="60%">
                <el-tabs v-model="checkItemDetailName" type="card" @tab-click="handleClickTab">
                  <el-tab-pane label="基本信息" name="basicInfo">
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
                        <!--<el-input v-model="checkBasicInfo.sys_code" :disabled="checkBasicInfo.disable"></el-input>-->
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
                  </el-tab-pane>
                  <el-tab-pane label="核查信息" name="checkInfo">
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
                        <!--<el-input type="textarea" v-model="checkBasicInfo.point" :disabled="checkBasicInfo.disable"></el-input>-->
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
      <el-dialog title="核查项列表" :visible.sync="checkList">
        <el-table :data="checkData" border style="width: 100%" :span-method="objectSpanMethod" align="center">
          <el-table-column prop="check_num" label="检查项编号" width="180">
            <template slot-scope="scope"><p v-html="scope.row.check_num"></p></template>
          </el-table-column>
          <el-table-column prop="check_name" label="检查项名称" width="180"></el-table-column>
          <el-table-column prop="check_desc" label="基线值说明">
            <template slot-scope="scope"><p v-html="scope.row.check_desc"></p></template>
          </el-table-column>
          <el-table-column prop="check_val" label="基线值">
            <template slot-scope="scope">
              <p v-html="scope.row.check_val" @dblclick="modifyBaseVal(scope.row)" v-if="!checkData[scope.row.index]['show']"></p>
              <el-input v-if="checkData[scope.row.index]['show']"
                        v-model="checkData[scope.row.index]['check_val']"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;" v-if="checkTotals !== 0">
          <el-pagination background :current-page.sync="resData.page" :total="checkTotals"
                         @current-change="(val) => handleCurrentChange(val, 'check')" :page-size="resData.size" layout="prev, pager, next">
          </el-pagination>
        </div>
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
      return {
        resData: {
          page: 1,
          size: 10
        }, // 分页数据
        tableTotals: 0, // 查询策略组总条数
        detailTotal: 0, // 检查项总数
        checkTotals: 0, // 自定义参数总数
        activeName: 'first',
        tableData:  [], // 默认表格数据
        data: [{name: '内置策略组', pid: 0, _id: 1, is_buildin: 1, children: []}], // 树形数据
        activeLabel: '',
        csId: '',
        checkid: '',
        scriptId: '',
        lastId: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        }, // 树形props
        checkList: false, // 核查项列表dialog
        checkItemDetail: false, // 检查项详情dialog
        formLabelWidth: '120px',
        type: '',
        checkData: [],
        itemDetail: false, // 详情
        itemDetailTitle: '', // 详情主类
        checkItemData: [], // 详情table
        checkItemDetailName: 'basicInfo',
        checkBasicInfo: {}, // 详情基本信息
        spanArr: [] // 合并数组
      }
    },
    computed: {
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
    mounted () {
      this.$nextTick(() => {
        this.initData()
      })
    },
    methods: {
      async getTableList(id) {
        await this.postFuzz({
          url: "/fuzz/page/view/checkmanage/strategy!searchTypeBygroupid.action",
          params: {start: (parseInt(this.resData.page - 1) * 10), group_id: id},
          vm: this
        }).then(res => {
          let _this = this
          this.tableData = res.reu.map((item, index) => {
            return {
              name: item[1],
              type: item[2],
              attr: item[3],
              is_buildin: _this.data[0]['children'][index]['is_buildin'],
              id: item[4]
            }
          })
        })
      },
      /**
       * 自定义设置参数
       * @param type
       */
      setArguments(type) {
        this.checkList = false
        this.resData.page = 1
        let _messages = type === 'ok' ? '自定义参数设置成功' : '已取消自定义参数设置'
        this.$message({
          message: _messages,
          type: 'info'
        });
      },
      /**
       * 打开自定义参数弹框
       * @param type
       */
      getArguments (row) {
        console.log(row, 'zidingyi')
        this.resData.page = 1
        this.checkList = true
        this.lastId = row.id
        this.getArgumentsList(this.lastId)
        this.getTotalNumber(row.id, 'cs_id').then(response => {
          this.checkTotals = response.totalNum
        })
      },
      async getArgumentsList (cs_id) {
        await this.fetchFuzz({url: '/fuzz/page/view/strategy!findSelfDefinedById.action',
          params: {cs_id, start: (parseInt(this.resData.page - 1) * 10)}, vm: this}).then(res => {
          console.log(res, 'get custom')
          let data = res.reu
          data.forEach((item, index) => {
            let _data = item[3].split('</a>')
            console.log(_data, 'item 333')
            for (let i = 0, _len = _data.length; i < _len - 1; i++) {
              let _startIdx = _data[i].indexOf('>') + 1
              let val = _data[i].slice(_startIdx)
              let obj = {
                check_num: item[0], check_name: item[1], check_desc: item[2],
                check_val: val, index: index, show: false // 双击判断输入框显示
              }
              this.checkData.push(obj)
            }
          })
          let spanArr = [] // 设定一个数组来存放要连续合并的格数，同时还要设定一个变量来记录，当时间段不同时数据的索引
          let contactDot = 0
          let tableData = this.checkData
          tableData.forEach((item, idx) => {
            if (idx === 0) {
              spanArr.push(1)
            } else {
              if (item.index === tableData[idx - 1].index) { // index相同合并
                spanArr[contactDot] += 1
                spanArr.push(0)
              } else {
                spanArr.push(1)
                contactDot = idx
              }
            }
          })
          this.spanArr = spanArr
        })
        console.log(this.checkData, 'checkDatacheckDatacheckDatacheckData')
      },
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      /**
       * 点击table详情
       * @param row
       */
      handleClick(row) {
        this.itemDetail = !this.itemDetail
        // console.log(row, 'row')
        this.itemDetailTitle = `${row.name}的检查项列表`
        this.resData.page = 1
        this.getDetailItem(row.id)
        this.getTotalNumber(row.id, 'cs_id').then(response => {
          this.detailTotal = response.totalNum
        })
      },
      /**
       * 点击详情查看
       */
      async getDetailItem (cs_id) {
        this.csId = cs_id
        await this.fetchFuzz({url: '/fuzz/page/view/checkmanage/strategy!findStrategyById.action',
          params: {cs_id , start: (parseInt(this.resData.page - 1) * 10), t: Math.random()}, vm: this}).then (res => {
          let data = res.reu, check_id = res.checkid
          this.checkItemData = data.map((item, index) => {
            return {
              check_num: item[0], check_name: item[1], check_type: item[2], id: check_id[index]
            }
          })
        })
      },
      /**
       * 树形结构数据初始化数据
       */
      async initData() {
        const {data} = await this.fetchFuzz({
          url: '/fuzz/page/view/strategy!strategyTree.action',
          vm: this
        })

        console.log(data, 'strategyTree')
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
      /**
       * 树形结构点击
       * @param data
       */
      handleNodeClick(data) {
        this.activeLabel = data
        if (data.pid === 1) {
          this.resData.page = 1
          this.getTableList(data.id)
          this.getTotalNumber(data.id, 'group_id').then(response => {
            this.tableTotals = response.totalNum
          })
        } else {
          this.tableData = []
          this.tableTotals = 0
        }
      },
      /**
       * 检查项列表详情查看
       * @param row 行数据
       */
      itemView (row) { // checkItemDetailName
        // console.log(row, 'row')
        this.checkItemDetailName = 'basicInfo'
        this.checkItemDetail = true
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
       * 获取列表总数
       */
      async getTotalNumber (id, type) {
        let params = {}
        params[`${type}`] = id
        const res = this.postFuzz({
          url: '/fuzz/page/view/checkmanage/strategy!findTotals.action', params, vm: this
        })
        return new Promise((resolve => {
          resolve (res)
        }))
      },
      /**
       * 分页点击
       * @param val 当前页码
       * @param type 判断是默认列表or详情列表
       */
      handleCurrentChange(val, type) {
        this.resData.page = val
        if (type === 'table') {
          this.getTableList(this.activeLabel.id)
        } else if (type === 'check') {
          this.getArgumentsList(this.lastId)
        } else {
          this.getDetailItem(this.csId)
        }
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
      modifyBaseVal (row) {
        console.log(row, 'modify')
        console.log(this.checkData[row.index])
        this.$set(this.checkData[row.index], 'show', true)
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
