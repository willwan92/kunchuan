/** 
@desc 公用分页组件
 */
<template>
  <div class="lv-pagination-wrapper">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.page ? pageData.page : 1"
      :page-sizes="pageData.sizeLists ? pageData.sizeLists : [10, 20, 30, 40, 50]"
      :page-size="pageData.pageSize ? pageData.pageSize : 10"
      :layout="pageData.layout ? pageData.layout : 'total, sizes, prev, pager, next, jumper'"
      :total="pageData.total ? pageData.total : 0"
    ></el-pagination>
  </div>
</template>
 
<script>
export default {
  name: 'lv-page',
  props: {
    pageData: {
      type: Object,
      default: () => { },
      require: true
    }
  },
  methods: {
    // pageSize 改变时会触发
    handleSizeChange(size) {
      this.$emit('change', { page: this.pageData.page ? this.pageData.page : 1, pageSize: size })
    },
    // currentPage 改变时会触发
    handleCurrentChange(page) {
      this.$emit('change', { page, pageSize: this.pageData.pageSize })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
