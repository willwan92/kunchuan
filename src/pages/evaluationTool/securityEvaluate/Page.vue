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
				<el-button class="btn-lg" type="primary" @click="output()"><a style="color: #fff" href="https://allall01.baidupcs.com/file/fb769cd5epac8307b6e5a066ce93574b?bkt=en-43ea5360a23c0e2041f4ce0542b30b1c3b43874a83a0598e32b16c69b9de51824318112fda50f0d3b320ad2ed9a537498fe446f200b226cf887fa3f88d1351b9&fid=894058109-250528-889447324372429&time=1577612255&sign=FDTAXGERLQBHSKfW-DCb740ccc5511e5e8fedcff06b081203-Hh2wlFWFEZJkyOakZ%2F5tbchkGlg%3D&to=79&size=10050&sta_dx=10050&sta_cs=1168&sta_ft=xlsx&sta_ct=0&sta_mt=0&fm2=MH%2CYangquan%2CAnywhere%2C%2Cbeijing%2Cpbs&ctime=1577612235&mtime=1577612235&resv0=cdnback&resv1=0&resv2=rlim&resv3=5&resv4=10050&vuk=894058109&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-612b712b27faa6cfc704eb34622cbe6a45b97bf05ccb1fe300874beabdaa1a2d75ecc02dbb6dc5d52c6ee66329c3d48e19dc60fcea5303d8305a5e1275657320&sl=68616270&expires=8h&rt=pr&r=995406220&vbdid=1298347052&fin=expert.xlsx&fn=expert.xlsx&rtype=1&dp-logid=8412835463866727117&dp-callid=0.1&hps=1&tsl=200&csl=200&csign=d765UW7qlGNdcbawH%2BoYbus3IsU%3D&so=0&ut=6&uter=4&serv=0&uc=569815613&ti=0887d9faa0e99264fe7f0b8346fe565c43fdc5af99d8f952305a5e1275657320&reqlabel=250528_f_446cf977a9162627c66d667081e89aa9_-1_6752012fa09ec0be799964ca97bc8e4e&by=themis">结果生成导出</a></el-button>
			</el-form>
			<el-table :data="tableData" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
				<el-table-column label="序号" prop="id" width="50"></el-table-column>
				<el-table-column label="检查项" prop="checkItem" width="140"></el-table-column>
				<el-table-column label="检查子项" prop="checkChildItem" width="140"></el-table-column>
				<el-table-column label="基本要求" prop="require"></el-table-column>
				<el-table-column label="检查方法" prop="method"></el-table-column>
				<el-table-column label="评分标准" prop="standard"></el-table-column>
				<el-table-column label="基准分值" prop="baseMark" width="80"></el-table-column>
				<el-table-column label="操作" width="80">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="handleModify(scope.$index, scope.row)">打分</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="打分" :visible.sync="dialogVisible1" width="60%">
			<el-form width="600px" label-width="260px" ref="form1" :model="form1">
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
					<el-col :span="8">
						<el-form-item label="检查得分:" prop="mark" label-width="100px">
							<el-col :span="22">
								<el-input v-model="form1.mark"></el-input>
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
		</el-dialog>
		<el-dialog title="打分" :visible.sync="dialogVisible2" width="60%">
			<el-form width="600px" label-width="260px" ref="form2" :model="form2">
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
						<el-form-item label="检查得分:" prop="mark">
							<el-col :span="22">
								<el-input v-model="form2.mark"></el-input>
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
		<el-dialog title="打分" :visible.sync="dialogVisible3" width="60%">
			<el-form width="600px" label-width="200px" ref="form3" :model="form3">
				<el-row>
					<el-col :span="12">
						<el-form-item label="有无网络安全培训记录:" prop="record">
							<el-col :span="22">
								<el-input v-model="form3.record"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="检查得分:" prop="mark" label-width="95px">
							<el-col :span="20">
								<el-input v-model="form3.mark"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form3')">重置</el-button>
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
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      form1: {
        leader: "",
        leadername: "",
        job: "",
        mainPerson: "",
        askPerson: "",
        mark: ""
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
        askPerson: "",
        mark: ""
      },
      form3: {
        record: "",
        mark: ""
      }
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
    handleModify(index, row) {
      console.log(index);
      if (index == 0) {
        this.dialogVisible1 = true;
      } else if (index == 1) {
        this.dialogVisible2 = true;
      } else {
        this.dialogVisible3 = true;
      }
    },
    submit() {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
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
          "查验有关领导（网络安全直接责任人和具体负责人）工作分工的相关文件或任命通知;2.查验网络安全相关工作批示、会议记录等，了解主管领导履职情况。",
        standard:
          "1.缺少网络安全直接责任人和具体负责人扣4分；2.网络安全主管领导是单位（企业）正副职领导，否则扣2分（相关人事任命正式文件或通知，可作为本项符合的支撑性材料）。",
        baseMark: 4
      },
      {
        id: 2,
        checkItem: "责任落实",
        checkChildItem: "网络安全机构",
        require: "设立负责网络安全管理工作的内设机构，并明确机构负责人。",
        method:
          "1.查验单位各内设机构职责分工等文件，检查是否指定了网络安全管理机构,或者成立了网络与信息安全领导小组，有相关批示文件；2.检查文件或通知下发的时间不大于5年。",
        standard:
          "1.未成立网络安全组织机构，扣4分；2.网络安全组织机构成立文件明显过期或失效，扣2分。",
        baseMark: 4
      },
      {
        id: 3,
        checkItem: "责任落实",
        checkChildItem: "人员管理",
        require: "各单位（企业）应配备专职网络安全岗位和网络安全工作人员。",
        method:
          "查验单位（企业）网络安全岗位职责文件，检查系统管理员、网络管理员、网络安全员、一般工作人员等不同岗位的网络安全责任是否明确。",
        standard: "单位（企业）未配备专职网络安全管理人员和网络安全，扣4分。",
        baseMark: 4
      }
    ];
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
