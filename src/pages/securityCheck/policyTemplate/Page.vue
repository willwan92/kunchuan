<template>
  <div class="page">
    <el-container
      style="min-height: 500px; height: 100%;border: 1px solid #eee"
    >

      <!-- 左侧策略树 -->
      <el-aside width="300px" style="padding: 20px;">
        <el-tree
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          style="margin-top: 20px;"
        ></el-tree>
      </el-aside>

      <el-container>
        <el-main style="position: relative;">
          <!-- 策略模板列表 -->
          <template v-if="!itemDetail">
            <el-table
              v-loading="isLoading"
              key="1"
              ref="multipleTable"
              :data="tableData"
              border
              tooltip-effect="dark"
              style="width: 100%;margin-top: 20px;"
            >
              <!-- <el-table-column
                type="selection"
                :selectable="selectable"
                width="55"
              ></el-table-column> -->
              <el-table-column
                prop="name"
                label="策略模板名称"
              ></el-table-column>
              <el-table-column
                prop="type"
                label="检查项/设备类型"
              ></el-table-column>
              <el-table-column
                prop="attr"
                label="模板属性"
                width="100"
              ></el-table-column>
              <!-- <el-table-column prop="edit" label="编辑" width="80">
                <template slot-scope="">{{ "-" }}</template>
              </el-table-column> -->
              <el-table-column prop="custom" label="参数" width="110">
                <template slot-scope="scope">
                  <i
                    class="el-icon-s-tools cursor-point"
                    @click="getArguments(scope.row)"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="详情" width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            
            <app-pagination
              :pageData="tablePageData"
              @change="({page, pageSize}) => handleCurrentChange(page, pageSize, 'table')"
            ></app-pagination>
          </template>

          <!-- 策略模板详情——检查项列表 -->
          <template v-else>
            <el-row>
              <el-col :span="12" style="font-size: 18px;"><el-button type="text">{{itemDetailTitle}}</el-button>
              </el-col>
              <el-col :span="12" style="text-align: right;">
                <el-button class="btn-back" size="small" type="primary" @click="itemDetail = false"
                  >返回</el-button
                >
              </el-col>
            </el-row>
            
            <el-table v-loading="isLoadingTplDetail" :data="checkItemData" border 
              key="2" style="width: 100%">
              <el-table-column
                prop="check_num"
                label="检查项编号"
              ></el-table-column>
              <el-table-column
                prop="check_name"
                label="检查项名称"
              ></el-table-column>
              <el-table-column label="类型" prop="check_type"></el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="itemView(scope.row)"
                    type="text"
                    size="small"
                    >检查项详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <app-pagination
              :pageData="tplDetailPageData"
              @change="({page, pageSize}) => handleCurrentChange(page, pageSize, 'detail')"
            ></app-pagination>

            <!-- 检查项详情 -->
            <el-dialog
              title="检查项详情"
              :visible.sync="checkItemDetail"
              width="60%"
            >
              <el-tabs
                v-model="checkItemDetailName"
                type="card"
                @tab-click="handleClickTab"
              >
                <el-tab-pane label="基本信息" name="basicInfo">
                  <el-form
                    label-position="left"
                    label-width="120px"
                    :model="checkBasicInfo"
                  >
                    <el-form-item label="检查项名称">
                      <el-input
                        v-model="checkBasicInfo.name"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型">
                      <el-input
                        v-model="checkBasicInfo.stype"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="检查项编号">
                      <el-input
                        v-model="checkBasicInfo.check_code"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="所属分类">
                      <el-input
                        v-model="checkBasicInfo.whattype"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <!--<el-form-item label="自定义组">-->
                    <!--<el-input v-model="checkBasicInfo.sys_code" :disabled="checkBasicInfo.disable"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="配置要求">
                      <el-input
                        type="textarea"
                        v-model="checkBasicInfo.check_content"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="检测方法与依据">
                      <el-input
                        type="textarea"
                        v-model="checkBasicInfo.judge_by"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="加固方案">
                      <el-input
                        type="textarea"
                        v-model="checkBasicInfo.reinforce"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="权重">
                      <el-select
                        v-model="checkBasicInfo.weight"
                        placeholder="--请选择--"
                        :disabled="checkBasicInfo.disable"
                      >
                        <el-option
                          v-for="item in 10"
                          :label="item"
                          :value="item"
                          :key="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="核查信息" name="checkInfo">
                  <el-form
                    label-position="left"
                    label-width="120px"
                    :model="checkBasicInfo"
                  >
                    <el-form-item label="检查方式">
                      <el-radio-group
                        v-model="checkBasicInfo.is_auto"
                        :disabled="checkBasicInfo.disable"
                      >
                        <el-radio label="1">自动</el-radio>
                        <el-radio label="0">手动</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="检查脚本">
                      <el-input
                        v-model="checkBasicInfo.name"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="解析方式">
                      <el-radio-group
                        v-model="checkBasicInfo.parse_type"
                        :disabled="checkBasicInfo.disable"
                      >
                        <!--<el-radio label="" value="0">手动</el-radio>-->
                        <el-radio label="1">正则表达式</el-radio>
                        <el-radio label="2">JavaScript函数</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="检查点">
                      <!--<el-input type="textarea" v-model="checkBasicInfo.point" :disabled="checkBasicInfo.disable"></el-input>-->
                      <el-table :data="checkPointTable" border>
                        <el-table-column prop="check_num" label="检查项编号">
                          <template slot-scope="scope"
                            ><p v-html="scope.row.check_num"></p
                          ></template>
                        </el-table-column>
                        <el-table-column
                          prop="check_base_desc"
                          label="基线值说明"
                        >
                          <template slot-scope="scope"
                            ><p v-html="scope.row.check_base_desc"></p
                          ></template>
                        </el-table-column>
                        <el-table-column prop="check_jude" label="判定符">
                          <template slot-scope="scope"
                            ><p v-html="scope.row.check_jude"></p
                          ></template>
                        </el-table-column>
                        <el-table-column prop="check_base" label="合规标准值">
                          <template slot-scope="scope"
                            ><p v-html="scope.row.check_base"></p
                          ></template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                    <el-form-item label="检查点规则">
                      <el-input
                        type="textarea"
                        v-model="checkBasicInfo.baseLineValuesRel"
                        :disabled="checkBasicInfo.disable"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-dialog>
          </template>
        </el-main>
      </el-container>
    </el-container>

    <!-- 策略模板自定义参数dialog -->
    <el-dialog title="核查项列表" :visible.sync="checkList" width="65%">
      <el-table
        v-loading="isLoadingCustomData"
        :data="checkData"
        border
        style="width: 100%"
        align="center"
      >
        <el-table-column prop="check_num" label="检查项编号" width="180">
        </el-table-column>
        <el-table-column
          prop="check_name"
          label="检查项名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="check_desc" label="基线值说明">
          <template slot-scope="scope"
            ><p v-html="scope.row.check_desc"></p
          ></template>
        </el-table-column>
        <el-table-column prop="check_val" label="基线值">
          <template slot-scope="scope">
            <p v-html="scope.row.check_val"></p>
            <!-- @dblclick="modifyBaseVal(scope.row)" v-if="!checkData[scope.row._index]['show']"-->
            <!--              <el-input v-if="checkData[scope.row._index]['show']" v-on:blur="cancelBlur(scope.row)"-->
            <!--                        v-model="checkData[scope.row._index]['check_val']"></el-input>-->
            <!--隐藏自定义参数-->
          </template>
        </el-table-column>
      </el-table>

      <app-pagination
        :pageData="customArgsPageData"
        @change="({page, pageSize}) => handleCurrentChange(page, pageSize, 'check')"
      ></app-pagination>
      <!-- <div slot="footer" class="dialog-footer" style="text-align: center;">-->
        <!-- <el-button @click="setArguments('close')">取 消</el-button>-->
        <!-- <el-button type="primary" @click="setArguments('ok')">确 定</el-button>-->
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isLoadingTplDetail: false,
      isLoadingCustomData: false,
      customArgsPageData: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      tplDetailPageData: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      tablePageData: {
        page: 1,
        pageSize: 10,
        total: 0
      }, // 分页数据
      tableData: [], // 默认表格数据
      data: [
        { name: "内置策略组", pid: 0, _id: 1, is_buildin: 1, children: [] },
        // { name: "自定义组", pid: 0, _id: 100, is_buildin: 0, children: [] }
      ], // 树形数据
      activeLabel: "",
      csId: "",
      checkid: "",
      scriptId: "",
      lastId: "",
      defaultProps: {
        children: "children",
        label: "name"
      }, // 树形props
      checkList: false, // 核查项列表dialog
      checkItemDetail: false, // 检查项详情dialog
      formLabelWidth: "120px",
      type: "",
      checkData: [],
      itemDetail: false, // 详情
      itemDetailTitle: "", // 详情主类
      checkItemData: [], // 检查项table
      checkItemDetailName: "basicInfo",
      checkBasicInfo: {}, // 详情基本信息
      spanArr: [] // 合并数组
    };
  },
  computed: {
    checkPointTable() {
      let data =
        typeof this.checkBasicInfo.datalist === "string"
          ? this.checkBasicInfo.datalist.split(",")
          : this.checkBasicInfo.datalist;
      let arr = [];
      if (data) {
        arr.push({
          check_num: data[0],
          check_base_desc: data[1],
          check_jude: data[2],
          check_base: data[3]
        });
      }
      return arr;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    async getTableList(id) {
      this.tableData  = [];
      this.isLoading = true;
      let tablePageData = this.tablePageData;
      await this.postFuzz({
        url: "/fuzz/page/view/checkmanage/strategy!searchTypeBygroupid.action",
        params: { 
          group_id: id,
          number: tablePageData.pageSize,
          start: parseInt(tablePageData.page - 1) * tablePageData.pageSize
        },
        vm: this
      }).then(({reu}) => {
        this.isLoading = false;
        let _this = this;
        if (Array.isArray(reu)) {
          this.tableData = reu.map((item, index) => {
            return {
              name: item[1],
              type: item[2],
              attr: item[3] === 1 ? '预定义' : '',
              // is_buildin: _this.data[0]["children"][index]["is_buildin"],
              id: item[4]
            };
          });
        }
      });
    },
    /**
     * 自定义设置参数
     * @param type 被注释
     */
    setArguments(type) {
      this.checkList = false;
      this.tablePageData.page = 1;
      let _messages =
        type === "ok" ? "自定义参数设置成功" : "已取消自定义参数设置";
      if (type === "ok") {
        let cs_id = "",
          data = {};
        this.fetch({
          url: "/fuzz/page/view/strategy!insertSelfDefined.action",
          params: { cs_id, data },
          vm: this
        }).then(res => {
          // console.log(res, 'post data')
        });
      }
      this.$message({
        message: _messages,
        type: "info"
      });
    },
    /**
     * 打开自定义参数弹框
     * @param type
     */
    getArguments(row) {
      this.tablePageData.page = 1;
      this.checkList = true;
      this.lastId = row.id;
      this.customArgsPageData.page = 1;
      this.getArgumentsList(this.lastId);
      this.getTotalNumber(row.id, "cs_id").then(response => {
        this.customArgsPageData.total = response.total;
      });
    },
    /**
     * 获取自定义参数列表函数
     * @param cs_id
     */
    async getArgumentsList(cs_id) {
      this.checkData = [];
      this.isLoadingCustomData = true;
      let customArgsPageData = this.customArgsPageData;
      await this.fetchFuzz({
        url: "/fuzz/page/view/strategy!findSelfDefinedById.action",
        params: { 
          cs_id,
          number: customArgsPageData.pageSize,
          start: parseInt(customArgsPageData.page - 1) * customArgsPageData.pageSize 
        },
        vm: this
      }).then(res => {
        this.isLoadingCustomData = false;
        let data = res.reu;
        this.checkData = data.map((item) => {
          return {
            check_num: item[1],
            check_name: item[2],
            check_desc: item[3].replace(/\;/g, '<br/>'),
            check_val: item[4].replace(/\;/g, '<br/>'),
          }
        })
      });
    },
    /**
     * 点击策略模板详情
     * @param row
     */
    handleClick(row) {
      this.itemDetail = !this.itemDetail;
      this.itemDetailTitle = `${row.name}的检查项列表`;
      this.tablePageData.page = 1;
      this.getDetailItem(row.id);

      // 获取数据总条数
      this.getTotalNumber(row.id, "cs_id").then(response => {
        this.tplDetailPageData.total = response.total;
      });
    },
    /**
     * 查看策略模板详情
     */
    async getDetailItem(cs_id) {
      this.csId = cs_id;
      this.isLoadingTplDetail = true;
      let tplDetailPageData = this.tplDetailPageData;
      await this.fetchFuzz({
        url: "/fuzz/page/view/checkmanage/strategy!findStrategyById.action",
        params: {
          cs_id,
          start: parseInt(tplDetailPageData.page - 1) * tplDetailPageData.pageSize,
          number: tplDetailPageData.pageSize,
          t: Math.random()
        },
        vm: this
      }).then(res => {
        this.isLoadingTplDetail = false;
        let data = res.reu,
          check_id = res.checkid;
        this.checkItemData = data.map((item, index) => {
          return {
            check_num: item[0].split('</input>')[1],
            check_name: item[1],
            check_type: item[2],
            id: check_id[index]
          };
        });
      });
    },
    /**
     * 树形结构数据初始化数据
     */
    async initData() {
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/strategy!strategyTree.action",
        vm: this
      });

      let builtInChildren = [];
      let customChildren = [];

      if (Array.isArray(data)) {
         data.forEach(item => {
          if (item.pid === 1) {
            builtInChildren.push(item);
          } else if (item.pid === 100) {
            customChildren.push(item);
          }
        });
      }
     
      this.data[0]["children"] = builtInChildren;

      // 自定义策略组
      // this.data[1]["children"] = customChildren;
    },
    /**
     * 判断复选框是否可点击
     * @param row
     * @param index
     * @returns {number} 0 no 1 yes
     */
    selectable(row, index) {
      return row.is_buildin === 1 ? 0 : 1;
    },
    /**
     * 树形结构点击
     * @param data
     */
    handleNodeClick(data) {
      this.itemDetail = false;
      this.activeLabel = data;
      if (data.pid === 1) {
        this.tablePageData.page = 1;
        this.getTableList(data.id);
        this.getTotalNumber(data.id, "group_id").then(response => {
          this.tablePageData.total = response.totalNum;
        });
      } else {
        this.tableData = [];
        this.tablePageData.total = 0;
      }
    },
    /**
     * 检查项列表查看详情
     * @param row 行数据
     */
    itemView(row) {
      // checkItemDetailName
      // console.log(row, 'row')
      this.checkItemDetailName = "basicInfo";
      this.checkItemDetail = true;
      this.checkid = row.id;
      this.getItemView(this.checkid, "checkItemDetailinfo");
    },
    getItemView(checkid, type, scriptId) {
      let params = { checkid };
      scriptId ? (params.script_id = scriptId) : params;
      this.fetchFuzz({
        url: `/fuzz/page/view/checkmanage/checkItem!${type}.action`,
        params: params,
        vm: this
      }).then(res => {
        if (type === "checkItemDetailinfo") {
          this.scriptId = res.script_id;
        }
        // console.log(res, 'res')
        for (let i in res) {
          this.$set(this.checkBasicInfo, i, res[i] + "");
        }
        this.checkBasicInfo.disable = true;
      });
    },
    /**
     * 分页点击
     * @param val 当前页码
     * @param type 判断是默认列表or详情列表
     */
    handleCurrentChange(page, pageSize, type) {
      if (type === "table") { // 策略模板列表
        this.tablePageData.page = page;
        this.tablePageData.pageSize = pageSize;
        this.getTableList(this.activeLabel.id);
      } else if (type === "check") { // 策略模板参数——检查项列表
        this.customArgsPageData.page = page;
        this.customArgsPageData.pageSize = pageSize;
        this.getArgumentsList(this.lastId);
      } else { // 策略模板详情——检查项列表
        this.tplDetailPageData.page = page;
        this.tplDetailPageData.pageSize = pageSize;
        this.getDetailItem(this.csId);
      }
    },
    /**
     * 弹窗tab点击
     * @param tab
     */
    handleClickTab(tab) {
      this.checkItemDetailName = tab.name;
      if (tab.name === "checkInfo") {
        // 核查项
        this.getItemView(this.checkid, "checkIteminfo", this.scriptId);
      } else {
        // 基本信息
        this.getItemView(this.checkid, "checkItemDetailinfo");
      }
    },
    /**
     * 双击修改自定义参数基线值 被注释
     * @param row
     */
    modifyBaseVal(row) {
      this.$set(this.checkData[row._index], "show", true);
    },
    /**
     * 自定义参数时失去焦点 被注释
     * @param row
     */
    cancelBlur(row) {
      this.$set(this.checkData[row._index], "show", false);
    },
    /**
     * 获取各列表总数
     * @param id
     * @param type
     * @returns {Promise<unknown>}
     */
    getTotalNumber(id, type) {
      let params = {};
      params[`${type}`] = id;
      let url = '/fuzz/page/view/checkmanage/strategy!';

      if (type === 'group_id') {
        url +='findTotals.action';
      } else {
        url += 'findTotalsStrategy.action';
      }
      const res = this.postFuzz({
        url: url,
        params,
        vm: this
      });

      return new Promise(resolve => {
        resolve(res);
      });
    }
  }
};
</script>
<style lang="less">
.page {
  background: #fff;
}

.cursor-point {
  cursor: pointer;
}
</style>
