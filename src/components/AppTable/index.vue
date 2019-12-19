/** 
@desc 表格的公用组件 

@params tableTitles 表头数据 / 类型: 数组 / 是否必填: 必填
@params tableData   表格数据 / 类型: 数组 / 是否必填: 必填

*/

<template>
  <div class="app-table-wrapper">
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :row-style="tableRowStyle"
      :show-header="showHeader"
      @cell-click="cellClick"
      @row-click="rowClick"
    >
      <div class="table-title" v-for="(item, key) in titles" :key="key">
        <el-table-column
          :type="item.type"
          :label="item.title"
          :width="item.width || 50"
          :fixed="item.fixed"
          v-if="item.type === 'selection'"
        ></el-table-column>

        <el-table-column
          :label="item.title"
          :prop="item.prop"					
					:width="item.width || 160"
          :sortable="item.sortable"
          :fixed="item.fixed"
          v-else-if="item.isTemplate"
        >
          <template slot-scope="scope">
            <div v-if="item.templateType==='text'">
              <span
                class="operate-button"
                type="text"
                @click="check(scope.row, 'check', item.prop)"
              >{{item.operate ? item.operate : scope.row[item.prop]}}</span>
            </div>
            <div v-if="item.templateType==='check'">
              <el-button
                class="operate-button"
                type="text"
                @click="check(scope.row, 'check')"
              >{{item.operate ? item.operate : scope.row[item.prop]}}</el-button>
            </div>
            <div v-if="item.templateType==='textBtn'">
              <el-button type="text" @click="check(scope.row, 'text')">{{scope.row[item.prop]}}</el-button>
            </div>
            <div v-if="item.templateType==='plainBtn'">
              <el-button
                :style="scope.row[item.prop] === item.disabled ? item.over : item.success"
                :type="item.buttonType ? item.buttonType: 'primary'"
                @click="check(scope.row, 'plainBtn')"
                :disabled="scope.row[item.prop] === item.disabled ? true : false"
                plain
              >{{scope.row[item.prop]}}</el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="item.title"
          :prop="item.prop"
          :sortable="item.sortable"
          :fixed="item.fixed"
          v-else
        >
          <template slot-scope="scope">
            <span :style="item.sty">{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </div>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'app-table',
  props: {
    tableRowClassName: {
      type: Function,
      default: () => function () { },
      required: false
    },
    tableTitles: {
      type: Array,
      default: () => [],
      required: true
    },
    tableData: {
      type: Array,
      default: () => [],
      required: true
    },
    rowClassName: {
      type: Array,
      default: () => [],
      required: false
    },
    rowStyle: {
      type: Array,
      default: () => [],
      required: false
    },
    showHeader: {
      type: Boolean,
      default: true,
      required: false
    },
    stripe: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  computed: {
    titles() {
      let obj = this.tableTitles
      obj.length > 1 && (obj[0].fixed = true)
      return obj
    }
  },
  methods: {
    /**
     * @desc 返回row 的个性化style
     * @return  style String
     */
    tableRowStyle({ row, rowIndex }) {

    },

    /**
     * @desc cellClick当某个单元格被点击时会触发该事件
     * @params row, column, cell, event
     */
    cellClick(row, column, cell, event) {

    },
    /**
     * @desc row-click当某一行被点击时会触发该事件
     * @params row, event, column
     */
    rowClick(row, event, column) {

    },

    /**
     * @desc 组件回调事件 check 查看
     */
    check(row, type, target) {
      this.$emit('operate', {
        type,
        row,
        target
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-table-wrapper {
  .warning-row {
    background: rgb(246, 246, 246);
  }
  .warning-success {
    background: rgb(231, 241, 252);
  }
}
</style>
