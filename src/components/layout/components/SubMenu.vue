<template functional>
  <el-submenu :index="props.menuData.path">
    <template slot="title">
        <i class=""></i>
        <span>{{ props.menuData.meta.title }}</span>
    </template>
    <template v-for="item in props.menuData.children">
        <el-menu-item v-if="!item.children"
            :key="item.path"
            :index="item.path">
						<router-link :to="item.path">{{ item.meta.title }}</router-link>
        </el-menu-item>
        <sub-menu v-else :key="item.path" :menu-data="item"></sub-menu>
    </template>
  </el-submenu>
</template>
<script>
export default {
  props: ["menuData"],
  created() {
    //   console.log(menuData.path)
  }
};
</script>

<style lang="less">
.el-submenu__title i {
    color: #ffffffb3;
}
</style>