<template>
  <div class="page">
    <div class="section">
      <div class="query-title">
        <span>自定义时间</span>
      </div>
      <el-form class="time-form" size="small" label-width="75px">
        <el-form-item label="当前时间">
          <el-input v-model="fileName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-input v-model="fileName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-button type="primary" @click="0">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="section">
      <div class="query-title">
        <span>网络时间同步</span>
      </div>
      <el-form class="time-form" size="small" label-width="75px">
        <el-form-item label="同步方式">
          <el-radio-group v-model="syncType">
						<el-radio :label="0">内网同步</el-radio>
          	<el-radio :label="1">外网同步</el-radio>
					</el-radio-group>
					
        </el-form-item>
        <el-form-item label="同步来源">
					<el-select v-if="syncType" v-model="timeServer" placeholder="">
						<el-option v-for="item in timeServerOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<el-input v-else v-model="timeServer" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="handleSyncClick">同步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { judgeGender, deepCopy, commonExport } from 'common/utils'

export default {
	data() {
		return {
			fileName: '',
			timeServer: '',
			syncType: 1,
			timeServerOptions: [
				{
					value: 'cn.ntp.org.cn',
					label: 'cn.ntp.org.cn',
				},
				{
					value: 'ntp.sjtu.edu.cn',
					label: 'ntp.sjtu.edu.cn',
				},
				{
					value: 's1a.time.edu.cn',
					label: 's1a.time.edu.cn',
				},
				{
					value: 'time.nist.gov',
					label: 'time.nist.gov',
				},
			]
		}
	},
	created() {
		this.getSystemTime();
	},
	methods: {
		handleSyncClick() {

		},
		handleCurrentChange(page) {
			this.currentPage = page;
			this.fetchData();
		},
		async getSystemTime() {
			const data = await this.fetchFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!getSystemTime.action",
				vm: this
			});

		}
	}
}
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
    .time-form {
			width: 300px;
		}
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
</style>
