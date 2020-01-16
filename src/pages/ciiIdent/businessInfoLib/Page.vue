<template>
  <!-- 业务信息库管理 -->
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="" prop="">
          <el-upload
            action="#"
            :before-upload="beforeUpload">
            <el-button type="primary" 
          >导入业务信息库</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="tableData" border v-loading="isLoading">
          <el-table-column label="序号" width="100" prop="index"></el-table-column>
          <el-table-column label="业务信息库名称" prop="filename"></el-table-column>
          <el-table-column label="操作"  width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosClientUpload } from "common/axiosClient";
import { checkFileType } from "common/utils";
const path = '/cfgtools/usr/local/businessfile/';

export default {
  data() {
    return {
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

      const { data } = await axiosClientUpload.post("/uploadFile", params);

      if  (data && data.code === 10000) {
				this.$message.success("业务信息库导入成功");
				this.fetchTableData();
			} else {
				this.$message.error("业务信息库导入失败，请稍后再试")
			}
    },
    async fetchTableData() {
      this.isLoading = true;
      this.tableData = [];
      const data = await this.fetch({
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
      const data = await this.fetch({
        url: '/deleteFileName',
        params: {
          filePath: path,
          fileName: filename
        },
        vm: this
      });

      if  (data && data.code === 10000) {
				this.$message.success("业务信息库删除成功");
				this.fetchTableData();
			} else {
				this.$message.error("业务信息库删除失败，请稍后再试")
			}
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
