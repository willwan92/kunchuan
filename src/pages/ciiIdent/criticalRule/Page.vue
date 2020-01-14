<template>
  <div class="page">
    <div class="section list rule-lib">
      <el-form :inline="true" label-position="left" label-width="90px" v-loading="isUpdate">
        <el-form-item label="评估模板">
          <el-select v-model="excel" placeholder="">
            <el-option
              v-for="item in excelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="loadExcel">加载</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="业务系统" prop="business"></el-table-column>
        <el-table-column label="关键性评级" prop="class"></el-table-column>
        <el-table-column label="关键性" prop="KbValue"></el-table-column>
        <el-table-column label="指标" prop="info"></el-table-column>
        <el-table-column label="量化标准" prop="standard"></el-table-column>
      </el-table>
    </div>

		<div class="section list">
			 <div class="section-title">
        <span>关键性评估规则管理</span>
      </div>
      <el-table :data="ruleTableData" class="rule-lib-table" border v-loading="isLoading">
        <el-table-column label="规则名称" prop="name"></el-table-column>
        <el-table-column label="规则说明" prop="info"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

		<el-dialog
				title="编辑规则"
				:visible.sync="dialogShow"
				width="600px"
				@close="dialogShow = false">
				<el-form v-loading="isUpdate" :model="dialogForm" ref="dialogForm" label-width="140px">
					<el-form-item label="规则名称">
						<el-input v-model="dialogForm.name"></el-input>
					</el-form-item>
					<el-form-item label="A（关键方面）">
						<el-select v-model="dialogForm.aCount" placeholder="">
							<el-option v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="规则说明">
						<el-input type="textarea" v-model="dialogForm.info" placeholder=""></el-input>
					</el-form-item>
				</el-form>
				
				<span slot="footer">
					<el-button :disabled="isUpdate" @click="dialogShow = false">取 消</el-button>
					<el-button :disabled="isUpdate" type="primary" @click="handleComfirmClick">确 定</el-button>
				</span>
			</el-dialog>
  </div>
</template>

<script>
import { getCascaderOptions } from "common/utils";

export default {
  data() {
    return {
			excel: "",
			excelOptions: [],
			options: [
				{
					label: "请选择",
					value: 0
				},
				{
					label: "1个",
					value: 1
				},
				{
					label: "2个",
					value: 2
				},
				{
					label: "3个",
					value: 3
				},
				{
					label: "4个",
					value: 4
				}
			],
			isLoading: false,
			isUpdate:false,
			dialogForm: {
				name: "",
				info: "",
				aCount: 0,
			},
			dialogShow: false,
			tableData: [],
			ruleTableData: []
    };
  },
  created() {
		this.initData();
	},
	computed: {
		
	},
  methods: {
		async initData() {
			await this.fetchFileList();
			this.loadExcel();
			this.fetchRules();
		},

		
		async handleComfirmClick() {
			this.isUpdate = true;
			const dialogForm = this.dialogForm;
			const data = await this.fetch({
				url: "/keyrules/getUpdateId",
				params: {
					name: dialogForm.name,
					id: dialogForm.id,
					explain: dialogForm.info,
					acount: dialogForm.aCount
				},
        vm: this
			});
			this.isUpdate = false;

			if (data.code === 10000) {
				this.$message.success("编辑成功！");
				sessionStorage.setItem('aCount', dialogForm.aCount);
			} else {
				this.$message.error('编辑失败，请稍后再试！');
			}

			this.dialogShow = false;
			this.fetchRules();
		},
		async fetchRules() {
			this.isLoading = true;
        const data = await this.fetch({
        url: "/keyrules/getSelect",
        vm: this
	  });
	  this.isLoading = false;

			if (data && data[0]) {
				this.ruleTableData = data.map(element => {
					return {
						id: element.id,
						aCount: element.acount,
						name: element.name,
						info: element.explain
					}
				});
				
				sessionStorage.setItem('aCount', this.ruleTableData[0].aCount);
			}
		},
		async handleEditClick(id) {
			this.dialogShow = true;
			const data = await this.fetch({
				url: "/keyrules/getSelectById",
				params: {
					id: id
				},
        vm: this
			});
			const detail = data[0];
			
			this.dialogForm = {
				id: detail.id,
				name:  detail.name,
				info: detail.explain,
				aCount: detail.acount
			}
		},
		async fetchFileList() {
      const data = await this.fetch({
        url: "/file/fileNameUrl",
        vm: this
      });

      data[0] && data.forEach(element => {
        this.excelOptions.push({
          label: element,
          value: element
        })
      });

      this.excel = data[0];
		},
		async loadExcel() {
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/CIIidentification!getInfoByReadFile.action",
        params: {
					excelType: 2,
          fileName: this.excel
        },
        vm: this
			});

      data[0] &&
        data.forEach((item, index) => {
          this.tableData.push({
						business: item[0],
						KbValue: item[1],
						class: item[2],
						info: item[3],
						standard: item[5]
					})
        });
    },
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
		
		.section-title {
			margin-bottom: 30px;
			padding: 5px;
			height: 35px;
			color: @blue;
			border-bottom: 1px solid #ccc;
			.icon {
				float: left;
				width: 22px;
				margin: -1px 8px 0 0;
			}
		}
  }
}

.rule-lib {
	max-height: 600px;
	overflow: auto;
}
</style>
