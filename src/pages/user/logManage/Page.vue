<template>
  <div class="page">
    <div class="section list">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        class="query-form"
        label-position="left"
        label-width="75px"
      >
        <el-form-item label="操作人">
          <el-input v-model="queryForm.operator"></el-input>
        </el-form-item>
        <!-- <el-form-item label="操作IP">
					<el-input v-model="queryForm.operatorIp"></el-input>
				</el-form-item> -->
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryForm.log_content"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData">查 询</el-button>
        </el-form-item>
      </el-form>

			<p>
				<el-button
					type="danger"
					size="small"
					:disabled="!multipleSelection.length"
					@click="handleDelClick"
					>删 除</el-button
				>
				<el-button type="primary" size="small" @click="handleExportClick">导 出</el-button>
			</p>
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作人" prop="operator"></el-table-column>
        <el-table-column label="操作IP" prop="operatorIp"></el-table-column>
        <el-table-column label="操作时间" prop="operatorTime"></el-table-column>
        <el-table-column label="日志描述" prop="desc"></el-table-column>
      </el-table>

      <app-pagination
        :pageData="pageData"
        @change="handlePageChange"
      ></app-pagination>
    </div>
  </div>
</template>

<script>
import { downloadFileByUrl } from "common/utils";
import { FUZZ_URL } from "common/axiosClient";
import qs from 'qs';

export default {
  data() {
    return {
      queryForm: {
        dateRange: "",
        operator: "",
        operatorIp: "",
        log_content: ""
			},
			multipleSelection: [],
      tableTitles: [
        {
          prop: "operator",
          title: "操作人"
        },
        {
          prop: "operator",
          title: "操作人"
        },
        {
          prop: "operatorIp",
          title: "操作IP"
        },
        {
          prop: "operatorTime",
          title: "操作时间"
        },
        {
          prop: "desc",
          title: "日志描述"
        }
      ],
      tableData: [],
      pageData: {
        page: 1,
        total: 0
      },
      pageNum: 0
    };
  },
  created() {
    this.setDefaultDateRange(30, "YYYY-MM-DD");
    this.fetchData();
  },
  methods: {
		handleExportClick() {
			const params = qs.stringify(this.createParams());
			const url = `${FUZZ_URL}/fuzz/page/view/system/syslog!exportLog.action?${params}`;
      downloadFileByUrl(url);
    },
		handleDelClick() {
			this.$confirm("确认要删除选中日志吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
			.then(() => {
				const idStr = this.getIds();
				this.delLog(idStr);
			})
			.catch(() => {});
		},
		async delLog(idStr) {
      const data = await this.fetchFuzz({
				url: "/fuzz/page/view/system/syslog!deleteLogs.action",
				params: {
					id: idStr
				},
        vm: this
      });

      if (data.state === 1) {
        this.$message.success("删除成功！");
        this.fetchData();
      } else {
        this.$message.error("删除失败，请稍后再试！");
      }
		},
		getIds() {
			let ids = [];
      this.multipleSelection.forEach(item => {
        ids.push(item.id);
      })

			return ids.toString();
    },
    handlePageChange({ page, size }) {
      page && (this.pageData.page = page);
      size && (this.pageData.size = size);
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleOperate(row, type, target) {
      this.editItem({ id: row.id });
    },
    setDefaultDateRange(days, format) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
      this.queryForm.dateRange = [
        this.moment(start).format(format),
        this.moment(end).format(format)
      ];
		},
		createParams() {
      const queryForm = this.queryForm;
      let params = {
        operator: queryForm.operator,
        log_content: queryForm.log_content
      };

      params.start = queryForm.dateRange[0];
      params.end = queryForm.dateRange[1];
      params.rstart = this.pageData.page - 1;

			return params;
		},
    // 请求列表数据
    async fetchData() {
      this.isFetchingData = true;

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/system/syslog!findAllLogs.action",
        params: this.createParams(),
        vm: this
      });

      if (data.state === 1 && data.data) {
        this.tableData =
          data.data[0] &&
          data.data.map(item => {
            return {
							id: item[4],
              operator: item[0],
              operatorIp: item[1],
              operatorTime: item[2],
              desc: item[3]
            };
          });

        this.pageData.total = data.total;
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
  margin-right: 30px;
}

.query-form {
  margin-bottom: 12px;
}
</style>
