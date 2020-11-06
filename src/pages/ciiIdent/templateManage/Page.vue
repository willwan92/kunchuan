<template>
  <!-- 评估模板管理 -->
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="" prop="">
          <el-upload
            action="#"
            :disabled="isUploading"
            :before-upload="beforeUpload">
            <el-button :disabled="isUploading" :loading="isUploading" type="primary" 
          >{{ isUploading ? '正在导入':'导入模板'}}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="tableData" border v-loading="isLoading">
          <el-table-column label="序号" width="100" prop="index"></el-table-column>
          <el-table-column label="模板名称" prop="filename"></el-table-column>
          <el-table-column label="操作"  width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" type="" @click="handleExport(scope.row)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosClientUpload } from "common/axiosClient";
import { checkFileType, downloadFile } from "common/utils";
const path = '/cfgtools/usr/local/keyrulefile/';

export default {
  data() {
    return {
      isUploading:false,
      tableData: [],
      form: {
        id: "",
        modelName: ""
      },
      isLoading: false,
      dialogVisible: false
    };
  },
  created() {
    this.fetchTableData();
  },
  methods: {
    beforeUpload(file) {
      if (!checkFileType(file, ['.xls', '.xlsx'])) {
        this.$message.error('上传文件类型错误，只能上传".xlsx"或".xls"文件！');
        return false;
      }
      
      this.uploadFile(file);
      return false;
    },
    async uploadFile(file) {
      let params = new FormData();
      params.append('file', file);
      params.append('filepath', path);
       this.isUploading = true;
      const { data } = await axiosClientUpload.post("/uploadFile", params);
       this.isUploading = false;
      if  (data && data.code === 10000) {
				this.$message.success("模板导入成功");
				this.fetchTableData();
			} else {
				this.$message.error("模板导入失败，请稍后再试")
			}
    },
    async fetchTableData() {
      this.isLoading = true;
      this.tableData = [];
      const data = await this.post({
        url: '/file/fileNameUrlPath',
        params: {
          urlPath: path
        },
        vm: this
      });
      this.isLoading = false;
      if (Array.isArray(data)) {
				this.tableData = data.map((item, index) => { 
					return {
						index: index + 1,
						filename: item
					};
				});
			}
    },
    async delFile(filename) {
      const data = await this.post({
        url: '/deleteFileName',
        params: {
          filePath: path,
          fileName: filename
        },
        vm: this
      });

      if  (data && data.code === 10000) {
				this.$message.success("模板删除成功");
				this.fetchTableData();
			} else {
				this.$message.error("模板删除失败，请稍后再试")
			}
    },
    handleExport(row) {
      downloadFile({
        url: '/fuzz/page/view/system/syslog!downloadFile.action', 
        params: {
          downloadFile: `${path}${row.filename}`
        },
        filename: row.filename
      })
    },
    handleDelete(row) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.delFile(row.filename);
      })
      .catch(() => {
      });
    }
  },
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

.query-title {
  position: relative;
  margin-bottom: 30px;
  padding: 5px;
  height: 35px;
  color: @blue;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  .icon {
    float: left;
    width: 22px;
    margin: -1px 8px 0 0;
  }
}
.btn-lg {
  width: 150px;
  margin-right: 5px;
}

.upload-demo {
  position: relative;
  box-sizing: border-box;
  /deep/.el-upload-list {
    // display: none;
    position: absolute;
    left: 120px;
    top: -3px;
  }
}

</style>
