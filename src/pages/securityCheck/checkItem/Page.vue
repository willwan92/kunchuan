<template>
  <div class="page">
    <div class="section">
      <el-container
        style="min-height: 500px; height: 100%;border: 1px solid #eee"
      >
        <el-aside width="300px" style="padding: 20px;">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="[-1, 0]"
            @node-click="handleNodeClick"
            v-if="showTree"
            style="margin-top: 20px;"
          ></el-tree>
        </el-aside>
        <el-container>
          <el-main style="position: relative;">
            <template v-if="!itemDetail">
              <el-table
                v-loading="isLoading"
                ref="multipleTable"
                :data="tableData"
                border
                tooltip-effect="dark"
                style="width: 100%;margin-top: 20px;"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  prop="num"
                  label="核查项编号"
                  width="125"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="检查项名称"
                ></el-table-column>
                <el-table-column prop="desc" label="内容"></el-table-column>
                <el-table-column
                  prop="attr"
                  label="核查项属性"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="type"
                  label="核查方式"
                  width="80"
                ></el-table-column>
                <el-table-column fixed="right" label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <app-pagination
                :pageData="tablePageData"
                @change="handleCurrentChange"
              ></app-pagination>
            </template>
            <template v-else>
              <div class="btn-wrapper">
                <el-button class="btn-back" size="small" type="primary" @click="itemDetail = false"
                    >返回</el-button>
              </div>
              <el-tabs
                v-model="checkItemDetailName"
                type="card"
                @tab-click="handleClickTab"
              >
                <el-tab-pane label="基本信息" name="basicInfo">
                  <template>
                    <el-form
                      v-loading="isLoadingDetail"
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
                      <!--<el-input v-model="checkBasicInfo.custom" :disabled="checkBasicInfo.disable"></el-input>-->
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
                  </template>
                </el-tab-pane>
                <el-tab-pane label="核查信息" name="checkInfo">
                  <template>
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
      isLoading: false,
      isLoadingDetail: false,
      showTree: true,
      treeId: "",
      tablePageData: {
        page: 1,
        total: 0
      }, // 分页数据
      label: "",
      tableData: [],
      treeData: [
        {
          id: -1,
          name: "检查项分组",
          level: 0,
          children: [
            {
              name: "资产类型分组",
              id: 0,
              pid: -1,
              status: 0,
              level: 1,
              children: []
            }
          ]
        }
      ], // 树形结构数据
      defaultProps: {
        children: "children",
        label: "name"
      }, // 树形props
      itemDetail: false, // 详情
      checkItemDetailName: "basicInfo",
      checkBasicInfo: {},
      scriptId: "",
      checkid: "",
      talbeDataId: ""
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
  created() {
    this.initData();
  },
  methods: {
    /**
     *table 分页
     * val 分页数据
     */
    handleCurrentChange({page}) {
      this.tablePageData.page = page;
      this.getTableData(this.talbeDataId);
    },
    /**
     * 点击属性结构函数
     */
    handleNodeClick(data) {
      if (data.level === 3) {
        this.itemDetail = false;
        this.treeId = data.id;
        this.talbeDataId = data.id;
        this.getTableData(data.id);
      }
    },
    getTableData(id) {
      this.isLoading = true;
      this.tableData = [];
      this.tablePageData.page = 1;
      this.postFuzz({
        url: "/fuzz/page/view/checkItem!findAliasByid.action",
        params: { id },
        vm: this
      }).then(res => {
        let alias = res.alias,
          stype = res.name,
          _id = res.id;
        this.fetchFuzz({
          url: "/fuzz/page/view/checkItem!check_itemDetail.action",
          params: {
            start: parseInt(this.tablePageData.page - 1) * 10,
            t: Math.random(),
            alias,
            stype,
            id: _id
          },
          vm: this
        }).then(res => {
          this.isLoading = false;
          this.tableData = res.datas.map(item => {
            return {
              num: item[1],
              name: item[2],
              desc: item[3],
              attr: item[4],
              type: item[5],
              id: item[0]
            };
          });
          this.tablePageData.total = res.total;
        });
      });
    },
    /**
     * 点击操作查看基本信息和核查信息
     * @param type
     */
    handleClick(row) {
      // checkmanage/checkItem!checkIteminfo.action?checkid=201
      this.itemDetail = !this.itemDetail;
      this.checkItemDetailName = "basicInfo";
      this.checkid = row.id;
      this.getItemView(this.checkid, "checkItemDetailinfo");
    },
    getItemView(checkid, type, scriptId) {
      this.isLoadingDetail = true;
      let params = { checkid };
      scriptId ? (params.script_id = scriptId) : params;
      this.fetchFuzz({
        url: `/fuzz/page/view/checkmanage/checkItem!${type}.action`,
        params: params,
        vm: this
      }).then(res => {
        this.isLoadingDetail = false;
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
     * tab点击
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
     * 获取树形结构数据
     * @returns {Promise<void>}
     */
    initData() {
      this.fetchFuzz({
        url: "/fuzz/page/view/checkItem!checkItemTree.action",
        vm: this
      }).then(res => {
        let data = res.data;
        let arr = [];
        data.forEach(item => {
          if (item.pId === 0) {
            let _item = item;
            _item.children = [];
            _item.level = 2;
            arr.push(_item);
          }
        });
        arr.forEach((item, index) => {
          data.forEach((_item, _index) => {
            if (item.pId !== _item.pId && item.id === _item.pId) {
              let __item = _item;
              __item.level = 3;
              arr[index]["children"].push(_item);
            }
          });
        });
        this.$set(this.treeData[0]["children"][0], "children", arr);
      });
      let _this = this;
      _this.showTree = false;
      setTimeout(() => {
        _this.showTree = true;
      }, 500);
    }
  }
};
</script>
<style lang="less">
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

    .btn-wrapper {
      position: relative;
      .btn-back {
        position: absolute;
        right: 0;
        z-index: 2000;
      }
    }
  }

  .icon {
    cursor: pointer;
    font-size: 20px;
  }

  
}
</style>
