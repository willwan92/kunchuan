<template>
	<!-- 安全评估 -->
	<div class="page">
		<div class="section list">
			<el-form :inline="true" label-width="75px" :model="queryForm">
				<el-form-item label="项目名称">
					<el-cascader :options="pjOptions" :props="{ expandTrigger: 'hover', checkStrictly: true }" filterable v-model="queryForm.pjValue">
					</el-cascader>
				</el-form-item>
				<el-form-item label="安全评估模板" label-width="130px">
					<el-select v-model="queryForm.charts" placeholder="" clearable style="width: 300px">
						<el-option v-for="item in chartsOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button class="btn-lg" type="primary" @click="load()">加载</el-button>
				<el-button class="btn-lg" type="primary" @click="output()"><a style="color: #fff" href="https://raw.githubusercontent.com/ElementUI/Resources/master/Element_Components_v2.0.0.rplib">结果生成导出</a></el-button>
			</el-form>
			<el-table :data="tableData" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
				<el-table-column label="序号" prop="id" width="50"></el-table-column>
				<el-table-column label="检查项" prop="checkItem" width="140"></el-table-column>
				<el-table-column label="检查子项" prop="checkChildItem" width="140"></el-table-column>
				<el-table-column label="基本要求" prop="require"></el-table-column>
				<el-table-column label="检查方法" prop="method"></el-table-column>
				<el-table-column label="评分标准" prop="standard"></el-table-column>
				<el-table-column label="基准分值" prop="baseMark" width="80"></el-table-column>
				<el-table-column label="检查得分" prop="mark" width="80"></el-table-column>
				<el-table-column label="操作" width="80">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="handleModify(scope.$index, scope.row)">打分</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="详情" :visible.sync="dialogVisible" width="50%">
			<el-form width="600px" label-width="260px" ref="form1" :model="form1" v-if="modifyRowId==0">
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否明确负责网络安全管理工作的领导:" prop="leader">
							<el-col :span="22">
								<el-input v-model="form1.leader"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="姓名:" prop="leadername" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form1.leadername"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否本单位主要负责同志:" prop="mainPerson">
							<el-col :span="22">
								<el-input v-model="form1.mainPerson"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="职务:" prop="job" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form1.job"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="访谈人:" prop="askPerson">
							<el-col :span="22">
								<el-input v-model="form1.askPerson"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form1')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-form width="600px" label-width="260px" ref="form2" :model="form2" v-if="modifyRowId==1">
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否明确负责网络安全管理的内设机构:" prop="mechanism">
							<el-col :span="22">
								<el-input v-model="form2.mechanism"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="姓名:" prop="mechanismName" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form2.mechanismName"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="负责人:" prop="mainPerson">
							<el-col :span="22">
								<el-input v-model="form2.mainPerson"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="职务:" prop="job" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form2.job"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="联系人:" prop="Contactperson">
							<el-col :span="22">
								<el-input v-model="form2.Contactperson"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办公电话:" prop="phone" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form2.phone"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="移动电话:" prop="mobilephone">
							<el-col :span="22">
								<el-input v-model="form2.mobilephone"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="访谈人:" prop="askPerson" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form2.askPerson"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form2')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCascaderOptions } from "common/utils";

export default {
  data() {
    return {
      pjOptions: [],
      chartsOptions: [
        {
          label: "关键信息基础设施网络安全检查表.xlsx",
          value: "1"
        }
      ],
      queryForm: {
        pjValue: "",
        charts: "1"
      },
      tableData: [],
      isLoading: false,
      dialogVisible: false,
      form1: {
        leader: "",
        leadername: "",
        job: "",
        mainPerson: "",
        askPerson: ""
      },
      form2: {
        mechanism: "",
        mechanismName: "",
        mainPerson: "",
        Contactperson: "",
        phone: "",
        mobilephone: "",
        job: "",
        mainPerson: "",
        askPerson: ""
      },
      modifyRowId: ""
    };
  },
  methods: {
    load() {},
    add() {},
    output() {
      // this.$message({
      //   message: "导出成功",
      //   type: "success"
      // });
    },
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });

      this.pjOptions = getCascaderOptions({
        arr: data,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
    handleEdit(index, row) {
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    handleModify(index, row) {
      console.log(index);
      this.modifyRowId = index;
      this.dialogVisible = true;
    },
    submit() {
      this.dialogVisible = false;
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDelete() {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.fetchPjTreeData();
    let list = [
      {
        id: 1,
        checkItem: "责任落实",
        checkChildItem: "网络安全负责人",
        require:
          "1.各单位（企业）应明确单位网络安全直接责任人;2.各单位（企业）应明确网络安全具体负责人。",
        method:
          "1.查验有关领导（网络安全直接责任人和具体负责人）工作分工的相关文件或任命通知;2.查验网络安全相关工作批示、会议记录等，了解主管领导履职情况。",
        standard:
          "1.缺少网络安全直接责任人和具体负责人扣4分；2.网络安全主管领导是单位（企业）正副职领导，否则扣2分（相关人事任命正式文件或通知，可作为本项符合的支撑性材料）。",
        baseMark: 4,
        mark: "4"
      },
      {
        id: 2,
        checkItem: "责任落实",
        checkChildItem: "网络安全机构",
        require: "1.设立负责网络安全管理工作的内设机构，并明确机构负责人。",
        method:
          "1.查验单位各内设机构职责分工等文件，检查是否指定了网络安全管理机构,或者成立了网络与信息安全领导小组，有相关批示文件；2.检查文件或通知下发的时间不大于5年。",
        standard:
          "1.未成立网络安全组织机构，扣4分；2.网络安全组织机构成立文件明显过期或失效，扣2分。",
        baseMark: 4,
        mark: "4"
      }
    ];
    list.forEach(element => {
      element["show"] = false;
    });
    this.tableData = list;
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
