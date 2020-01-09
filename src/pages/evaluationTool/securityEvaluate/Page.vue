<template>
  <!-- 安全评估 -->
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="项目名称">
          <el-cascader
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="安全评估模板" label-width="130px">
          <el-select v-model="selectedTpl" placeholder="请选择">
            <el-option
              v-for="item in tplOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :disabled="!selectedTpl" @click="loadTableData('excel')"
          >加载</el-button
        >
        <el-button class="btn-lg" :disabled="!pjname" type="primary" @click="exportResult"
          >评估结果导出</el-button
        >
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="序号" prop="idx" width="50"></el-table-column>
        <el-table-column
          label="检查项"
          prop="checkItem"
          width="140"
        ></el-table-column>
        <el-table-column
          label="检查子项"
          prop="checkChildItem"
          width="140"
        ></el-table-column>
        <el-table-column label="基本要求" prop="require"></el-table-column>
        <el-table-column label="检查方法" prop="method"></el-table-column>
        <el-table-column label="评分标准" prop="standard"></el-table-column>
        <el-table-column
          label="基准分值"
          prop="baseMark"
          width="80"
        ></el-table-column>
				<el-table-column
          label="得分"
          prop="score"
          width="80"
        ></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleScoreClick(scope.row)"
              >打分</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="打分" :visible.sync="dialogVisible" width="800px">
      <el-form label-width="150px" ref="dialogForm" :model="dialogForm">
				<el-form-item v-for="(value, name) in checkListForm" :label="name" :key="name">
          <el-input v-model="checkListForm[name]"></el-input>
        </el-form-item>
        <el-form-item label="检查得分:" prop="score">
          <el-input v-model="dialogForm.score"></el-input>
        </el-form-item>
				<el-form-item label="访谈人:" prop="scorer">
          <el-input v-model="dialogForm.scorer"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCascaderOptions, downloadFileByUrl } from "common/utils";
import { API_URL } from "common/axiosClient";
const path = '/cfgtools/usr/local/safetyassessfile/';

export default {
  data() {
    return {
      pjOptions: [],
      tplOptions: [],
      selectedTpl: "",
      pjValue: [],
      tableData: [],
      isLoading: false,
			dialogVisible: false,
			checkListForm: {},
      dialogForm: {
				score: '',
				scorer: '',
				id: '',
				subitem: ''
      }
    };
  },
  created() {
    this.fetchPjTreeData();
		this.fetchTplOptions();
		this.loadTableData();
	},
	computed: {
		pjname() {
      let pjname;
      if (this.pjValue && this.pjValue[0]) {
        pjname = this.pjValue.slice(-1)[0];
      } else {
        pjname = null;
      }

      return pjname;
    }
	},
  methods: {
    async fetchTplOptions() {
      const data = await this.fetch({
        url: "/file/fileNameUrlPath",
        params: {
          urlPath: path
        },
        vm: this
      });

      if (data || data[0]) {
        this.tplOptions = data.map(item => {
          return {
            label: item,
            value: item
          };
        });
      }
    },
    async loadTableData(type) {
			let params = null;
			let url = "/fuzz/page/view/CIIidentification!loaddatas.action";
			if (type === 'excel') {
				url = "/fuzz/page/view/CIIidentification!getInfoByReadFile.action";
				params = {
          excelType: 3,
          fileName: this.selectedTpl
        };
			}
      const { data } = await this.fetchFuzz({
        url: url,
        params: params,
        vm: this
      });

      if (data && data[0]) {
        this.tableData = data.map((item, index) => {
          return {
            id: item[0],
            idx: index + 1,
            checkItem: item[1],
            checkChildItem: item[2],
            require: item[3],
            method: item[4],
            standard: item[5],
						baseMark: item[6],
						score: item[7]
          };
        });
      }
		},
		async handleScoreClick(row) {
			const data = await this.fetch({
				url: "/back/selectSafetypojoId",
				params: {
					id: row.id
				},
        vm: this
			});
			
			if (data && data[0]) {
				const itemData = data[0];
				this.dialogForm = {
					score: itemData.score,
					scorer: itemData.scorer,
					id: itemData.id,
					subitem: itemData.subitem
				}
				
				this.dialogVisible = true;
				let checkListForm = {};
				let itemArr;
				itemData.checklist.split('&&').slice(1).forEach(item => {
					itemArr = item.split('：');
					checkListForm[itemArr[0]] = itemArr[1];
				});

				this.checkListForm = Object.assign({}, checkListForm)
			} else {
				this.$message.error('获取检查子项数据失败，请稍后再试')
			}
		},
		async exportResult() {
			downloadFileByUrl(`${API_URL}/safe/getSelectSafetyById?projectName=${this.pjname}`);
		},
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });

      this.pjOptions = getCascaderOptions({
        arr: data,
        label: "pjname",
        value: "pjname",
        filter: "isleaf"
      });
		},
		formatCheckListForm(checkListForm) {
			let checkList = '';
			Object.keys(checkListForm).forEach(key => {
				checkList = checkList + '&&' + key + '：' + checkListForm[key];
			})

			return checkList;
		},
    async submit() {
			let params = this.dialogForm;
			params.checklist = this.formatCheckListForm(this.checkListForm);

			const data = await this.fetch({
				url: "/back/updateSafetypojoId",
				params: params,
        vm: this
			});

			if (data && data.code === 10000) {
				this.$message.success("打分成功");
				this.dialogVisible = false;
				this.loadTableData();
			} else {
				this.$message.error("打分失败，请稍后再试")
			}
    }
  }
};
</script>
<style lang="less" scoped>
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
  }
}

.btn-lg {
  width: 150px;
  margin-right: 5px;
}
</style>
