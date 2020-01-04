<template>
  <!-- 备份管理 -->
  <div class="page">
    <div class="section">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="项目名称">
          <el-cascader
            :show-all-levels="false"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            @change="fetchAssetSignOptions"
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="IP/资产标识" label-width="90px">
          <el-select
            placeholder="请选择"
            v-model="deviceid"
            clearable
          >
            <el-option
              v-for="item in assetSignOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="query()">查询</el-button>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-remove="beforeRemove"
            :on-remove="handleRemove"
            :file-list="fileList1"
            :auto-upload="true"
            :limit="1"
          >
            <el-button type="primary" @click="submitUpload">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column label="备份文件名" prop="filename"></el-table-column>
        <el-table-column label="备份时间" prop="backuptime"></el-table-column>
        <el-table-column label="备份位置" prop="filepath"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleLoad(scope.$index, scope.row)"
              ><a
                style="color: #fff"
                href="https://raw.githubusercontent.com/ElementUI/Resources/master/Element_Components_v2.0.0.rplib"
                >下载</a
              ></el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions } from "common/utils";

export default {
  data() {
    return {
      pjOptions: [],
      assetSignOptions: [],
      pjValue: [],
      deviceid: '',
      fileList1: [],
      tableData: []
    };
  },
  created() {
    this.fetchPjTreeData();
  },
  computed: {
    getPjId() {
      let id;
      if (this.pjValue && this.pjValue[0]) {
        id = this.pjValue.slice(-1)[0];
      } else {
        id = null;
      }

      return id;
    }
  },
  methods: {
    async query() {
      if (this.deviceid == "") {
        this.$message({
          message: "请选择项目和IP/资产标识",
          type: "warning"
        });

        return;
      }

      const data = await this.fetch({
        url: "/back/getSelectByDeviceid",
        params: {
          deviceid: this.deviceid
        },
        vm: this
      });

      if (data && data[0]) {
        this.tableData = data.map(item => {
          return {
            id: item.id,
            deviceid: item.deviceid,
            filename: item.filename,
            filepath: item.filepath,
            backuptime: item.backuptime,
          };
        });
      }

      
    },
    async fetchAssetSignOptions() {
      const data = await this.fetch({
        url: "/back/getSelectByPjid",
        params: {
          pjid: this.getPjId
        },
        vm: this
      });

      if (data && data[0]) {
        this.assetSignOptions = data.map(item => {
          return {
            value: item.deviceid,
            label: item.ip
          };
        });
      }
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
    },
    submit() {
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    handleLoad() {},
    submitUpload() {
      console.log(this.fileList1);
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
    
  }
};
</script>
<style lang="less" scoped>
.section {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  color: #409eff;
}
.section:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tabs-wrapper {
  position: relative;
  .btn {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

.query-title {
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

/deep/.el-table__row {
  td {
    .el-input__inner {
      height: 28px;
    }
  }
}

.upload-demo {
  position: relative;
  box-sizing: border-box;
  /deep/.el-upload-list {
    position: absolute;
    left: 100px;
    top: -3px;
    // display: none;
  }
}
</style>
