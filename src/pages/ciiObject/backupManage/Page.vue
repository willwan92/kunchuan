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
          <el-button :disabled="!deviceid" type="primary" @click="fetchTableData">查询</el-button>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-upload
            action="#"
            :disabled="!deviceid || isUploading"
            :before-upload="beforeUpload">
            <el-button :disabled="!deviceid || isUploading" :loading="isUploading" type="primary" 
          >{{ isUploading ? '正在上传' : '上传备份' }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="备份文件名" prop="filename"></el-table-column>
        <el-table-column label="备份时间" prop="backuptime"></el-table-column>
        <el-table-column label="备份位置" prop="filepath"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.isUploading">
                上传进度：
                <el-progress :percentage="scope.row.progress"></el-progress>
              </span>
              <span v-else>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDownload(scope.row)"
                  >下载</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { API_URL, axiosClientUpload } from "common/axiosClient";
import { getCascaderOptions, downloadFileByUrl, formatTreeData } from "common/utils";
const baseDir = '/cfgtools/usr/local/backfile/';
export default {
  data() {
    return {
      isUploading: false,
      pjOptions: [],
      assetSignOptions: [],
      pjValue: [],
      deviceid: '',
      fileList1: [],
      isLoading:false,
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
    getFilePath() {
      return `${baseDir}${this.deviceid}/`;
    },
    beforeUpload(file) {
      const fileName = file.name;
      const isRepeat = this.tableData.find(item => item.filename === fileName);
      const size = (file.size / 1024 /1024).toFixed(1);
      if (isRepeat) {
        this.$message.warning('所选文件重复，请重新选择！');
      } else if (size > 1000) {
        this.$message.warning('所选文件超出最大限制（1000MB），请重新选择！');
      } else {
        this.uploadFile(file);
      }
      
      return false;
    },
    async uploadFile(file) {
      let params = new FormData();
      const backuptime = this.moment().format('YYYY-MM-DD HH:mm:ss');
      const filepath = this.getFilePath();
      let progress = 0;

      params.append('file', file);
      params.append('deviceid', this.deviceid);
      params.append('backuptime', backuptime);
      params.append('filepath', filepath);

      this.tableData.push({
        id: null,
        deviceid: this.deviceid,
        filename: file.name,
        filepath: filepath,
        backuptime: backuptime,
        isUploading: true,
        progress: progress
      });

      this.isUploading = true;

      const { data } = await axiosClientUpload.post("/uploadinsert", params, {
        onUploadProgress: (progressEvent) => {
          progress = parseInt(100 * progressEvent.loaded / progressEvent.total);
          this.tableData[this.tableData.length - 1].progress = progress;
        }
      });
      
      this.isUploading = false;

      if  (data && data.code === 10000) {
				this.$message.success("上传备份成功");
				this.fetchTableData();
			} else {
				this.$message.error("上传备份失败，请稍后再试")
			}
    },
    async fetchTableData() {
      if (this.deviceid == "") {
        this.$message({
          message: "请选择项目和IP/资产标识",
          type: "warning"
        });

        return;
      }
    
      this.isLoading = true;
      this.tableData = [];
      const data = await this.post({
        url: "/back/getSelectByDeviceid",
        params: {
          deviceid: this.deviceid
        },
        vm: this
      });
      this.isLoading = false;
      if (Array.isArray(data)) {
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
      const data = await this.post({
        url: "/back/getSelectByPjid",
        params: {
          pjid: this.getPjId
        },
        vm: this
      });

      if (Array.isArray(data)) {
        this.assetSignOptions = data.map(item => {
          return {
            value: item.deviceid,
            label: item.ip
          };
        });
      }
    },
    async fetchPjTreeData() {
			const roleId = sessionStorage.getItem('roleId');

      const data = await this.post({
				url: "/projectInfo/getEnableRole",
				params: {
					enablerole: `(${roleId})`
				},
        vm: this
      });

			const treeData = formatTreeData(data, 0);

      this.pjOptions = getCascaderOptions({
        arr: treeData,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
    handleDelete(row) {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.deleteFile(row);
      })
      .catch(() => {
        
      });
    },
    async deleteFile(row) {
      const data = await this.post({
        url: "/deleteFileName",
        params: {
          filePath: this.getFilePath(),
          fileName: row.filename,
          id: row.id
        },
        vm: this
      });

      if  (data && data.code === 10000) {
				this.$message.success("删除备份成功");
				this.fetchTableData();
			} else {
				this.$message.error("删除备份失败，请稍后再试")
			}
    },
    submit() {
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    handleDownload(row) {
      const url = `${API_URL}/downloadFileName?path=${row.filepath}&fileName=${row.filename}`;
      downloadFileByUrl(url);
    },
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
