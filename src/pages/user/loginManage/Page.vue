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
          <span style="display: inline-block; width: 24px; line-height: 36px;"
            >—</span
          >
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
            style="width: 400px"
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
          <el-select
            v-model="disUser"
            multiple
            style="width: 400px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="setUserRange">确定</el-button>
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
          <el-select v-model="form.policyType" @change="getPolicyDataByType">
            <el-option
              v-for="item in policyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <app-table
        v-loading="isLoading"
        :table-data="tableData"
        :table-titles="tableTitles"
        @operate="handleOperate"
      ></app-table>
    </div>
  </div>
</template>

<script>
import { judgeGender, deepCopy, commonExport } from "common/utils";

export default {
  data() {
    return {
      isLoading: false,
      timeRange: [],
      ipMethod: "sigIp",
      userOptions: null,
      disUser: [],
      policyData: [],
      ip: "",
      startIp: "",
      endIp: "",
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
          prop: "type",
          title: "策略类别"
        },
        {
          prop: "content",
          title: "策略内容"
        },
        {
          title: "操作",
          prop: "id",
          isTemplate: true,
          width: 150,
          templateType: "check",
          operate: "删除"
        }
      ],
      tableData: []
    };
  },
  created() {
    this.getUserOptions();
    this.getPolicyData();
    this.getPolicyDataByType();
  },
  methods: {
    async getPolicyDataByType() {
      const params = {
        keyvalue: "",
        dtype: this.form.policyType,
        t: Math.random()
      };

      this.isLoading = true;
      this.tableData = [];
      const res = await this.fetchFuzz({
        url: "/fuzz/page/view/system/dictionary!query.action",
        params: params,
        vm: this
      });

      this.isLoading = false;
      if (Array.isArray(res.data)) {
        this.tableData = res.data.map(item => {
          return {
            id: item[0],
            type: item[1],
            content: item[2]
          };
        });
      }
    },
    formatTimePolicy(timePolicyData) {
      let startH, startM, endH, endM;

      timePolicyData.forEach(item => {
        if (item.dkey === 'startH') {
          startH = item.dvalue;
        }

        if (item.dkey === 'startM') {
          startM = item.dvalue;
        }

        if (item.dkey === 'endH') {
          endH = item.dvalue;
        }

        if (item.dkey === 'endM') {
          endM = item.dvalue;
        }
      })

      this.timeRange = [];
      this.timeRange.push(`${startH}:${startM}`)
      this.timeRange.push(`${endH}:${endM}`)
    },
    async getPolicyData() {
      this.disUser = [];
      const policyData = await this.fetchFuzz({
        url: "/fuzz/page/view/system/dictionary!find.action",
        vm: this
      });

      let timePolicyData = [];

      policyData.forEach(item => {
        if (item.dtype === 4) {
          this.disUser.push(Number(item.dvalue));
        } else if (item.dtype === 1) {
          timePolicyData.push(item);
        }
      });

      this.formatTimePolicy(timePolicyData);
    },
    async getUserOptions() {
      const params = {
        start: 0,
        t: Math.random(),
        user_name: ""
      };

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/system/user!getAllUser.action",
        params: params,
        vm: this
      });

      let userArr = [];

      data.map(item => {
        if (item[1] !== 1) {
          userArr.push({
            label: item[0],
            value: item[6]
          });
        }
      });

      this.userOptions = userArr;
    },
    //保存IP
    async setIp() {
      let dtype, dvalue;
      if (this.ipMethod === 'sigIp') {
        dtype = 2;
        dvalue = this.ip;
      } else if (this.ipMethod === 'mulIp') {
        dtype = 3;
        dvalue = `${this.startIp}-${this.endIp}`;
      }
      
      const paramsData = [
        {
          dkey: this.ipMethod,
          dtype: dtype,
          dvalue: dvalue
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
        this.$message.success("策略修改成功！");
        this.getPolicyDataByType();
      } else {
        this.$message.error("策略修改失败，请稍后再试！");
      }
    },

    async setUserRange() {
      let paramsData = [];
      this.disUser.forEach(item => {
        paramsData.push({
          dkey: "disUser",
          dtype: 4,
          dvalue: item
        });
      });

      const data = await this.postFuzz({
        url: "/fuzz/page/view/system/dictionary!updateForUser.action",
        params: {
          dtype: 4,
          data: JSON.stringify(paramsData)
        },
        vm: this
      });

      if (data.state === 1) {
        this.$message.success("策略修改成功！");
        this.getPolicyDataByType();
      } else {
        this.$message.error("策略修改失败，请稍后再试！");
      }
    },

    async seTimeRange() {
      const timeRange = this.timeRange;
      const paramsData = [
        {"dtype":1,"dkey":"startH","dvalue": timeRange[0].split(':')[0]},
        {"dtype":1,"dkey":"startM","dvalue": timeRange[0].split(':')[1]},
        {"dtype":1,"dkey":"endH","dvalue": timeRange[1].split(':')[0]},
        {"dtype":1,"dkey":"endM","dvalue": timeRange[1].split(':')[1]}
      ];

      const data = await this.postFuzz({
        url: "/fuzz/page/view/system/dictionary!updateForTime.action",
        params: {
          dtype: 1,
          data: JSON.stringify(paramsData)
        },
        vm: this
      });

      if (data.state === 1) {
        this.$message.success("策略修改成功！");
        this.getPolicyDataByType();
      } else {
        this.$message.error("策略修改失败，请稍后再试！");
      }
    },

    async handleOperate({ row }) {
      const data = await this.postFuzz({
        url: "/fuzz/page/view/system/dictionary!delete.action",
        params: {
          ids: row.id,
          t: Math.random()
        },
        vm: this
      });

      if (data.state === 1) {
        this.$message.success("删除成功！");
        this.getPolicyDataByType();
        this.getPolicyData();
      } else {
        this.$message.error("删除失败，请稍后再试！");
      }
    },
    viewDetail(row) {
      this.$router.push({
        path: "/user/userDetail",
        query: {
          id: row.userId
        }
      });
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
