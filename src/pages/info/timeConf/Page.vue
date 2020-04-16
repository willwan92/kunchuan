<template>
  <div class="page">
    <div class="section">
      <div class="query-title">
        <span>自定义时间</span>
      </div>
      <el-form class="time-form" size="small" label-width="75px">
        <el-form-item label="当前时间">
          <el-input v-model="formatTime" readonly="" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker type="datetime" v-model="changedTime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="updateServerTime">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="section">
      <div class="query-title">
        <span>网络时间同步</span>
      </div>
      <el-form class="time-form" size="small" label-width="75px">
        <el-form-item label="同步方式">
          <el-radio-group v-model="syncType" @change="handleSyncTypeChange">
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
      timer: null,
			timeServer: '',
      syncType: 1,
      serverTime: '',
      changedTime: '',
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
  destroyed() {
    clearInterval(this.timer);
  },
  computed: {
    formatTime() {
      return this.moment(this.serverTime).format('YYYY-MM-DD HH:mm:ss');
    }
  },
	methods: {
    handleSyncTypeChange() {
      this.timeServer = '';
    },
		async handleSyncClick() {
      if (!this.timeServer) {
        this.$message.error('请填写同步来源！');
        return;
      }

      const data = await this.postFuzz({
        url: '/fuzz/page/view/sysconfig/sysconfig!netTime.action',
        params: {
          ipaddr: this.timeServer
        },
        vm: this
      });
      
      if (data && data.state === 1) {
        this.$message.success('同步时间成功');
        this.getSystemTime();
      } else {
        this.$message.error('同步时间失败，请检查您的网络配置')
      }
    },
    async updateServerTime() {
      const time = this.moment(this.changedTime).format('YYYY-MM-DD HH:mm:ss');
      const data = await this.postFuzz({
        url: '/fuzz/page/view/sysconfig/sysconfig!modifyTime.action',
        params: {
          modifydate: time
        },
        vm: this
      });
      
      if (data && data.state === 1) {
        this.$message.success('修改系统时间成功');
        this.getSystemTime();
        this.changedTime = '';
      } else {
        this.$message.error('修改系统时间失败，请稍后重试')
      }
    },
    updateTime() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.serverTime += 1000;
        }, 1000)
      }
    },
		async getSystemTime() {
			const data = await this.getFuzz({
				url: "/fuzz/page/view/sysconfig/sysconfig!getSystemTime.action",
				vm: this
			});

      if (data && data.ServerTime) {
        this.serverTime = data.ServerTime;
        this.updateTime();
      } else {
        // this.$message.error('获取系统时间失败')
      }
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
