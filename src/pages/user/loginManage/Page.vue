<template>
  <div class="page">
    <div class="section">
      <div class="section-title">
        <span>登录策略配置</span>
      </div>
      <el-form width="600px" :inline="true" label-width="120px">
        <el-form-item label="禁止访问地址">
          <el-radio-group v-model="ipMethod">
            <el-radio label="sigIp">单IP</el-radio>
            <el-radio label="mulIp">IP段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ipMethod === 'sigIp'" label>
          <el-input v-model="ip" placeholder></el-input>
        </el-form-item>
        <span v-else>
          <el-form-item label>
            <el-input v-model="startIp" placeholder></el-input>
          </el-form-item>
          <span style="display: inline-block; width: 24px; line-height: 36px;">—</span>
          <el-form-item label>
            <el-input v-model="endIp" placeholder></el-input>
          </el-form-item>
        </span>
        <el-form-item label>
          <el-button type="primary" @click="setIp">确定</el-button>
        </el-form-item>
        <br />

        <el-form-item label="禁止访问时段">
          <el-time-picker
            is-range
            v-model="timeRange"
            value-format="HH:mm"
            :picker-options="{
              format: 'HH:mm'
            }"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="seTimeRange">确定</el-button>
        </el-form-item>
        <br />
        <el-form-item label="禁止访问用户">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="0">确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="section list">
      <div class="section-title">
        <div class="fl">
          <span>策略查询</span>
        </div>
      </div>
      <el-form :inline="true" label-width="75px">
        <el-form-item label="策略类别">
          <el-select v-model="form.policyType" placeholder>
            <el-option
              v-for="item in policyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table>
    </div>
  </div>
</template>

<script>
import { judgeGender, deepCopy, commonExport } from "common/utils";

export default {
  data() {
    return {
	  timeRange: null,
	  ipMethod: 'sigIp',
	  ip: '',
	  startIp: '',
	  endIp: '',
      form: {
        policyType: 1
      },
      policyTypeOptions: [
        {
          label: "登录时间段策略",
          value: 1
        },
        {
          label: "访问地址策略",
          value: 2
        },
        {
          label: "禁止访问用户策略",
          value: 4
        }
      ],
      tableTitles: [
        {
          prop: "serial",
          title: "策略类别"
        },
        {
          prop: "pushTime",
          title: "策略内容"
        },
        {
          title: "操作",
          prop: "id",
          isTemplate: true,
          width: 150,
          templateType: "check",
          operate: "修改"
        }
      ],
      data: [{"dkey":"mulIp","dtype":3,"dvalue":"10.60.4.250-10.60.4.251"}],
      tableData: []
    };
  },
  methods: {
	//查询
	async setIp() {
		const paramsData = [
				{
					dkey: this.ipMethod,
					dtype: 3,
					dvalue: `${this.startIp}-${this.endIp}`
				}
			];

		const params = {
			data: JSON.stringify(paramsData),
			dtype: 3
		};

		const data = await this.postFuzz({
			url: "/fuzz/page/view/system/dictionary!updateForIP.action",
			params: params,
			vm: this
		});

		if (data.state === 1) {
			this.$message.success('保存成功！')
		} else {
			this.$message.error('保存失败！')
		}
	},
	async seTimeRange() {

	},
    async fetchData() {
      const params = {
        keyvalue: "",
        t: Math.random(),
        dtype: this.form.policyType
      };

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/system/dictionary!query.action",
        params: params,
        vm: this
      });

      // this.tableData = data.map(element => {
      // 	return {
      // 		userName: element[0],
      // 		roleType: element[1],
      // 		permissionList: element[0],
      // 		mobile: element[0],
      // 		telephone: element[0],
      // 		email: element[0],
      // 	}
      // });
    },
    handleOperate(row, type, target) {
      this.editItem({ id: row.id });
    },
    editItem(id) {},
    createParams() {
      let params = deepCopy(this.searchParams);
      params.pageNum = this.currentPage;
      return params;
    },
    viewDetail(row) {
      this.$router.push({
        path: "/user/userDetail",
        query: {
          id: row.userId
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchData();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
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
</style>
